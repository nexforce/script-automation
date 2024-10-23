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
    limit: 200,
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
  const client = new hubspot.Client({
    accessToken,
  });
  const existingSolutions = JSON.parse(event.inputFields.existingSolutions);
  const companyId = event.inputFields.companyId;
  const productSkus = event.inputFields.solucoes_do_cliente.split(";");

  let solutionToCompanyAssociationsResponse;
  //stop;
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
    .filter((s) => String(s.to[0].toObjectId) === String(companyId))
    .filter((s) => !!existingSolutions.find((es) => es.id === s._from.id))
    .map((s) => existingSolutions.find((es) => es.id === s._from.id))
    .filter(
      (s) =>
        s.properties.status_da_solucao_do_cliente.trim().toLowerCase() !==
        "inativa"
    )
    .map((s) => s.properties.c_digo_do_produto);

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
    `as seguintes soluções serão criadas: ${JSON.stringify(solutionsToCreate)}`
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
};
