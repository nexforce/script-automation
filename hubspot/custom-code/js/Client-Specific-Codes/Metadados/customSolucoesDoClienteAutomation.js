const hubspot = require("@hubspot/api-client");

const stringifyOrExtractError = (error) =>
  error.message === "HTTP request failed"
    ? JSON.stringify(error.response, undefined, 2)
    : error.message;

const throwMessage = (message) => {
  throw {
    message,
  };
};

const throwError = (error, message) => {
  throw {
    message: `${message}: ${stringifyOrExtractError(error)}`,
  };
};

const propertyEquals = (propertyName, value) => ({
  filterGroups: [
    {
      filters: [
        {
          propertyName,
          operator: "EQ",
          value,
        },
      ],
    },
  ],
});

const searchExistingSolutionsRequestBody = (productSkus, after) => {
  let body = {
    filterGroups: [
      {
        filters: [
          {
            operator: "IN",
            propertyName: "c_digo_do_produto",
            values: productSkus,
          },
        ],
      },
    ],
    properties: [
      "hs_object_id",
      "c_digo_do_produto",
      "status_da_solucao_do_cliente",
    ],
    limit: 100,
  };

  if (after) {
    body = {
      ...body,
      ...after,
    };
  }

  return body;
};

const searchProductsRequestBody = (solutionsToCreate, after) => {
  let body = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "hs_sku",
            operator: "IN",
            values: solutionsToCreate.map((sku) => String(sku).toLowerCase()),
          },
        ],
      },
    ],
    properties: ["name", "hs_folder_name", "hs_sku", "id_metadados"],
    limit: 100,
  };

  if (after) {
    body = {
      ...body,
      ...after,
    };
  }

  return body;
};

const solutionObjectTypeId = "2-29995024";
const associationTypeId = 290;

exports.main = async (event) => {
  const { API_TOKEN: accessToken } = process.env;
  const companyName = event.inputFields.nomeEmpresa;
  const sdc = event.inputFields.solucoes_do_cliente;
  const client = new hubspot.Client({
    accessToken,
  });

  try {
    const searchCompaniesResponse =
      await client.crm.companies.searchApi.doSearch({
        ...propertyEquals("name", companyName),
        properties: ["hs_object_id"],
      });

    if (searchCompaniesResponse.results.length === 0) {
      throwMessage(`empresa com nome "${companyName}" não encontrada`);
    } else if (searchCompaniesResponse.results.length > 1) {
      console.warn(
        `encontrada mais de uma empresa com o nome "${companyName}"; a primeira ocorrência será utilizada`
      );
    }

    const companyId =
      searchCompaniesResponse.results[0].properties.hs_object_id;

    delete searchCompaniesResponse;

    if (!sdc) {
      throwMessage('propriedade "Soluções do Cliente" está vazia');
    }

    const productSkus = sdc.split(";");
    console.log(
      `rodando workflow para os seguintes SKUs de produtos: ${productSkus}`
    );

    const existingSolutions = [];
    try {
      let existingSolutionsResponse =
        await client.crm.objects.searchApi.doSearch(
          solutionObjectTypeId,
          searchExistingSolutionsRequestBody(productSkus)
        );

      existingSolutionsResponse.results.forEach((r) =>
        existingSolutions.push(r)
      );

      while (existingSolutionsResponse.paging?.next?.after !== undefined) {
        existingSolutionsResponse = await client.crm.objects.searchApi.doSearch(
          solutionObjectTypeId,
          searchExistingSolutionsRequestBody(productSkus, {
            after: Number.parseInt(existingSolutionsResponse.paging.next.after),
          })
        );

        existingSolutionsResponse.results.forEach((r) =>
          existingSolutions.push(r)
        );
      }
    } catch (error) {
      throwError(
        error,
        "Ocorreu um erro ao buscar as soluções do cliente existentes"
      );
    }

    let solutionToCompanyAssociationsResponse;
    try {
      solutionToCompanyAssociationsResponse =
        await client.crm.associations.v4.batchApi.getPage(
          solutionObjectTypeId,
          "0-2",
          {
            inputs: existingSolutions.map((r) => ({
              id: r.id,
            })),
          }
        );
    } catch (error) {
      throwError(
        error,
        "Ocorreu um erro ao buscar as associações entre as soluções existentes e as empresas"
      );
    }

    const solutionsNotToCreate = solutionToCompanyAssociationsResponse.results
      .filter((s) => String(s.to[0].toObjectId) === companyId)
      .filter((s) => !!existingSolutions.find((es) => es.id === s._from.id))
      .map((s) => existingSolutions.find((es) => es.id === s._from.id))
      .filter(
        (s) =>
          s.properties.status_da_solucao_do_cliente.trim().toLowerCase() !==
          "inativa"
      )
      .map((s) => s.properties.c_digo_do_produto);

    delete existingSolutions;
    delete solutionToCompanyAssociationsResponse;

    const solutionsToCreate = productSkus.filter(
      (sku) => !solutionsNotToCreate.find((es) => !!es && es === sku)
    );

    if (solutionsToCreate.length === 0) {
      console.log(
        "detectei que nenhuma solução precisa ser criada. encerrando por aqui"
      );
      return;
    }

    console.log(
      `as seguintes soluções serão criadas: ${JSON.stringify(
        solutionsToCreate
      )}`
    );
    console.log(
      `as seguintes soluções NÃO serão criadas: ${JSON.stringify(
        solutionsNotToCreate
      )}`
    );

    const products = [];
    let searchProductsResponse;
    try {
      searchProductsResponse = await client.crm.products.searchApi.doSearch(
        searchProductsRequestBody(solutionsToCreate)
      );

      searchProductsResponse.results.forEach((r) => products.push(r));

      while (searchProductsResponse.paging?.next?.after !== undefined) {
        searchProductsResponse = await client.crm.products.searchApi.doSearch(
          searchProductsRequestBody(solutionsToCreate, {
            after: Number.parseInt(searchProductsResponse.paging.next.after),
          })
        );

        searchProductsResponse.results.forEach((r) => products.push(r));
      }
    } catch (error) {
      throwError(error, "ocorreu um erro ao buscar os produtos por SKU");
    }

    delete searchProductsResponse;

    if (products.length === 0) {
      throwMessage(
        `nenhum produto encontrado com os códigos de SKU: ${solutionsToCreate}`
      );
    }

    console.log(
      `encontrados ${products.length} produtos na biblioteca: ${products.map(
        (p) => p.properties.hs_sku
      )}`
    );

    const createdSolutions = await client.crm.objects.batchApi.create(
      solutionObjectTypeId,
      {
        inputs: products.map((product) => ({
          associations: [
            {
              to: {
                id: companyId,
              },
              types: [
                {
                  associationCategory: "USER_DEFINED",
                  associationTypeId,
                },
              ],
            },
          ],
          properties: {
            nome_do_produto: product.properties.name,
            c_digo_do_produto: product.properties.id_metadados,
            shs_sku: product.properties.hs_sku,
            nome_da_pasta: product.properties.hs_folder_name,
            status_da_solucao_do_cliente: "Ativa",
          },
        })),
      }
    );

    console.log("operação de criação terminou");
    console.log(`status: ${createdSolutions.status}`);
    console.log(`${createdSolutions.results.length} soluções criadas`);
    console.log(`erros: ${createdSolutions.errors || 0}`);
  } catch (error) {
    console.error(stringifyOrExtractError(error));
  }
};
