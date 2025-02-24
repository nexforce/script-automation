const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]

const hubspot = require("@hubspot/api-client");

const stringifyOrExtractError = (error) =>
  error.message === "HTTP request failed"
    ? JSON.stringify(error.response, undefined, 2)
    : error.message;

const throwError = (error, message) => {
  throw new Error(`${message}: ${stringifyOrExtractError(error)}`);
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

const solutionObjectTypeId = "2-27581922";
const associationTypeId = 297;

exports.main = async (event, callback) => {
  const { API_TOKEN: accessToken } = process.env;
  const client = new hubspot.Client({
    accessToken,
  });
  const existingSolutions = JSON.parse(event.inputFields.existingSolutions);
  console.log(existingSolutions);
  const productSkus = event.inputFields.solucoes_do_cliente.split(";");

  const solutionsNotToCreate =
    existingSolutions.map(
      (solution) => solution.properties.c_digo_do_produto
    ) || [];

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
    throw new Error(
      `Nenhum produto encontrado com os códigos de SKU: ${solutionsToCreate}`
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
              id: event.inputFields.companyId || event.object.objectId,
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

// [FINAL]

exports.main(
  {
    inputFields: {
      existingSolutions:
        '[{"id":"19484721826","properties":{"c_digo_do_produto":"99104","hs_createdate":"2024-11-08T18:01:23.854Z","hs_lastmodifieddate":"2024-11-08T18:01:25.146Z","hs_object_id":"19484721826","status_da_solucao_do_cliente":"Ativa"}},{"id":"19484721819","properties":{"c_digo_do_produto":"99303","hs_createdate":"2024-11-08T18:01:23.855Z","hs_lastmodifieddate":"2024-11-08T18:01:24.910Z","hs_object_id":"19484721819","status_da_solucao_do_cliente":"Ativa"}},{"id":"19484721825","properties":{"c_digo_do_produto":"99301","hs_createdate":"2024-11-08T18:01:23.855Z","hs_lastmodifieddate":"2024-11-08T18:01:25.146Z","hs_object_id":"19484721825","status_da_solucao_do_cliente":"Ativa"}}]',
      companyId: "25626344450",
      solucoes_do_cliente:
        "99301;99302;99303;99304;99210;99207;99208;99105;99103;99104",
    },
    object: { objectId: 13555162237 },
  },
  console.log
);
