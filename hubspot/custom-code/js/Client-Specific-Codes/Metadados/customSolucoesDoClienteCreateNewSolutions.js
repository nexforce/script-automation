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

const solutionObjectTypeId = "2-29995024";
const associationTypeId = 290;

exports.main = async (event, callback) => {
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

  const solutionsNotToCreate = existingSolutions.results?.map(
    (solution) => solution.c_digo_do_produto
  );

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
// [FINAL]

exports.main(
  {
    inputFields: {
      existingSolutions:
        '[{"id":"14028141406","properties":{"c_digo_do_produto":"99101","hs_createdate":"2024-07-12T20:03:40.644Z","hs_lastmodifieddate":"2024-07-12T20:03:41.924Z","hs_object_id":"14028141406","status_da_solucao_do_cliente":"Ativa"}},{"id":"14101564451","properties":{"c_digo_do_produto":"99205","hs_createdate":"2024-07-15T16:58:00.094Z","hs_lastmodifieddate":"2024-07-15T16:58:01.426Z","hs_object_id":"14101564451","status_da_solucao_do_cliente":"Ativa"}},{"id":"14101564456","properties":{"c_digo_do_produto":"99206","hs_createdate":"2024-07-15T16:58:00.094Z","hs_lastmodifieddate":"2024-07-15T16:58:01.913Z","hs_object_id":"14101564456","status_da_solucao_do_cliente":"Ativa"}},{"id":"14101564458","properties":{"c_digo_do_produto":"99203","hs_createdate":"2024-07-15T16:58:00.094Z","hs_lastmodifieddate":"2024-07-15T16:58:01.773Z","hs_object_id":"14101564458","status_da_solucao_do_cliente":"Ativa"}},{"id":"14101693205","properties":{"c_digo_do_produto":"99205","hs_createdate":"2024-07-15T17:15:57.667Z","hs_lastmodifieddate":"2024-07-15T17:15:58.820Z","hs_object_id":"14101693205","status_da_solucao_do_cliente":"Ativa"}},{"id":"14101693206","properties":{"c_digo_do_produto":"99203","hs_createdate":"2024-07-15T17:15:57.667Z","hs_lastmodifieddate":"2024-07-15T17:15:58.868Z","hs_object_id":"14101693206","status_da_solucao_do_cliente":"Ativa"}},{"id":"14101693207","properties":{"c_digo_do_produto":"99206","hs_createdate":"2024-07-15T17:15:57.667Z","hs_lastmodifieddate":"2024-07-15T17:15:58.868Z","hs_object_id":"14101693207","status_da_solucao_do_cliente":"Ativa"}},{"id":"14101693209","properties":{"c_digo_do_produto":"100101","hs_createdate":"2024-07-15T17:15:57.667Z","hs_lastmodifieddate":"2024-07-15T17:15:59.263Z","hs_object_id":"14101693209","status_da_solucao_do_cliente":"Ativa"}},{"id":"18867253103","properties":{"c_digo_do_produto":"100122","hs_createdate":"2024-10-22T14:13:11.497Z","hs_lastmodifieddate":"2024-10-22T14:13:12.960Z","hs_object_id":"18867253103","status_da_solucao_do_cliente":"Ativa"}},{"id":"18867253104","properties":{"c_digo_do_produto":"99101","hs_createdate":"2024-10-22T14:13:11.497Z","hs_lastmodifieddate":"2024-10-22T14:13:12.985Z","hs_object_id":"18867253104","status_da_solucao_do_cliente":"Ativa"}},{"id":"18867253105","properties":{"c_digo_do_produto":"100001","hs_createdate":"2024-10-22T14:13:11.497Z","hs_lastmodifieddate":"2024-10-22T14:13:13.030Z","hs_object_id":"18867253105","status_da_solucao_do_cliente":"Ativa"}},{"id":"18867253106","properties":{"c_digo_do_produto":"99105","hs_createdate":"2024-10-22T14:13:11.497Z","hs_lastmodifieddate":"2024-10-22T14:13:13.030Z","hs_object_id":"18867253106","status_da_solucao_do_cliente":"Ativa"}},{"id":"18867253107","properties":{"c_digo_do_produto":"100110","hs_createdate":"2024-10-22T14:13:11.497Z","hs_lastmodifieddate":"2024-10-22T14:13:12.991Z","hs_object_id":"18867253107","status_da_solucao_do_cliente":"Ativa"}},{"id":"18867253108","properties":{"c_digo_do_produto":"100101","hs_createdate":"2024-10-22T14:13:11.497Z","hs_lastmodifieddate":"2024-10-22T14:13:12.491Z","hs_object_id":"18867253108","status_da_solucao_do_cliente":"Ativa"}},{"id":"18867253109","properties":{"c_digo_do_produto":"99206","hs_createdate":"2024-10-22T14:13:11.497Z","hs_lastmodifieddate":"2024-10-22T14:13:12.460Z","hs_object_id":"18867253109","status_da_solucao_do_cliente":"Ativa"}},{"id":"18867253110","properties":{"c_digo_do_produto":"100113","hs_createdate":"2024-10-22T14:13:11.497Z","hs_lastmodifieddate":"2024-10-22T14:13:12.768Z","hs_object_id":"18867253110","status_da_solucao_do_cliente":"Ativa"}},{"id":"18867253111","properties":{"c_digo_do_produto":"99203","hs_createdate":"2024-10-22T14:13:11.497Z","hs_lastmodifieddate":"2024-10-22T14:13:12.960Z","hs_object_id":"18867253111","status_da_solucao_do_cliente":"Ativa"}},{"id":"18867253112","properties":{"c_digo_do_produto":"100120","hs_createdate":"2024-10-22T14:13:11.497Z","hs_lastmodifieddate":"2024-10-22T14:13:12.991Z","hs_object_id":"18867253112","status_da_solucao_do_cliente":"Ativa"}},{"id":"18867253113","properties":{"c_digo_do_produto":"100105","hs_createdate":"2024-10-22T14:13:11.497Z","hs_lastmodifieddate":"2024-10-22T14:13:13.214Z","hs_object_id":"18867253113","status_da_solucao_do_cliente":"Ativa"}},{"id":"18867253114","properties":{"c_digo_do_produto":"99205","hs_createdate":"2024-10-22T14:13:11.497Z","hs_lastmodifieddate":"2024-10-22T14:13:13.161Z","hs_object_id":"18867253114","status_da_solucao_do_cliente":"Ativa"}},{"id":"18860511911","properties":{"c_digo_do_produto":"100001","hs_createdate":"2024-10-22T14:30:23.278Z","hs_lastmodifieddate":"2024-10-22T14:30:24.792Z","hs_object_id":"18860511911","status_da_solucao_do_cliente":"Ativa"}},{"id":"18860511912","properties":{"c_digo_do_produto":"100110","hs_createdate":"2024-10-22T14:30:23.278Z","hs_lastmodifieddate":"2024-10-22T14:30:24.421Z","hs_object_id":"18860511912","status_da_solucao_do_cliente":"Ativa"}},{"id":"18860511913","properties":{"c_digo_do_produto":"99206","hs_createdate":"2024-10-22T14:30:23.278Z","hs_lastmodifieddate":"2024-10-22T14:30:24.989Z","hs_object_id":"18860511913","status_da_solucao_do_cliente":"Ativa"}},{"id":"18860511914","properties":{"c_digo_do_produto":"99203","hs_createdate":"2024-10-22T14:30:23.278Z","hs_lastmodifieddate":"2024-10-22T14:30:24.381Z","hs_object_id":"18860511914","status_da_solucao_do_cliente":"Ativa"}},{"id":"18860511915","properties":{"c_digo_do_produto":"100122","hs_createdate":"2024-10-22T14:30:23.278Z","hs_lastmodifieddate":"2024-10-22T14:30:24.792Z","hs_object_id":"18860511915","status_da_solucao_do_cliente":"Ativa"}},{"id":"18860511916","properties":{"c_digo_do_produto":"100113","hs_createdate":"2024-10-22T14:30:23.278Z","hs_lastmodifieddate":"2024-10-22T14:30:24.353Z","hs_object_id":"18860511916","status_da_solucao_do_cliente":"Ativa"}},{"id":"18860511917","properties":{"c_digo_do_produto":"99101","hs_createdate":"2024-10-22T14:30:23.278Z","hs_lastmodifieddate":"2024-10-22T14:30:24.381Z","hs_object_id":"18860511917","status_da_solucao_do_cliente":"Ativa"}},{"id":"18860511918","properties":{"c_digo_do_produto":"99105","hs_createdate":"2024-10-22T14:30:23.278Z","hs_lastmodifieddate":"2024-10-22T14:30:24.989Z","hs_object_id":"18860511918","status_da_solucao_do_cliente":"Ativa"}},{"id":"18860511919","properties":{"c_digo_do_produto":"100105","hs_createdate":"2024-10-22T14:30:23.278Z","hs_lastmodifieddate":"2024-10-22T14:30:24.421Z","hs_object_id":"18860511919","status_da_solucao_do_cliente":"Ativa"}},{"id":"18860511920","properties":{"c_digo_do_produto":"100101","hs_createdate":"2024-10-22T14:30:23.278Z","hs_lastmodifieddate":"2024-10-22T14:30:24.421Z","hs_object_id":"18860511920","status_da_solucao_do_cliente":"Ativa"}},{"id":"18860511921","properties":{"c_digo_do_produto":"100120","hs_createdate":"2024-10-22T14:30:23.278Z","hs_lastmodifieddate":"2024-10-22T14:30:25.101Z","hs_object_id":"18860511921","status_da_solucao_do_cliente":"Ativa"}},{"id":"18860511922","properties":{"c_digo_do_produto":"99205","hs_createdate":"2024-10-22T14:30:23.278Z","hs_lastmodifieddate":"2024-10-22T14:30:24.421Z","hs_object_id":"18860511922","status_da_solucao_do_cliente":"Ativa"}},{"id":"18874323333","properties":{"c_digo_do_produto":"99101","hs_createdate":"2024-10-22T17:49:18.095Z","hs_lastmodifieddate":"2024-10-22T17:49:19.044Z","hs_object_id":"18874323333","status_da_solucao_do_cliente":"Ativa"}},{"id":"18874323335","properties":{"c_digo_do_produto":"99206","hs_createdate":"2024-10-22T17:49:18.096Z","hs_lastmodifieddate":"2024-10-22T17:49:19.295Z","hs_object_id":"18874323335","status_da_solucao_do_cliente":"Ativa"}},{"id":"18880300972","properties":{"c_digo_do_produto":"99101","hs_createdate":"2024-10-22T17:50:43.430Z","hs_lastmodifieddate":"2024-10-22T17:50:44.169Z","hs_object_id":"18880300972","status_da_solucao_do_cliente":"Ativa"}},{"id":"18880300974","properties":{"c_digo_do_produto":"99206","hs_createdate":"2024-10-22T17:50:43.430Z","hs_lastmodifieddate":"2024-10-22T17:50:44.390Z","hs_object_id":"18880300974","status_da_solucao_do_cliente":"Ativa"}},{"id":"18880300975","properties":{"c_digo_do_produto":"99203","hs_createdate":"2024-10-22T17:50:43.430Z","hs_lastmodifieddate":"2024-10-22T17:50:44.245Z","hs_object_id":"18880300975","status_da_solucao_do_cliente":"Ativa"}},{"id":"18869855233","properties":{"c_digo_do_produto":"100001","hs_createdate":"2024-10-23T11:57:13.057Z","hs_lastmodifieddate":"2024-10-23T11:57:14.014Z","hs_object_id":"18869855233","status_da_solucao_do_cliente":"Ativa"}},{"id":"18869855235","properties":{"c_digo_do_produto":"99206","hs_createdate":"2024-10-23T11:57:13.057Z","hs_lastmodifieddate":"2024-10-23T11:57:14.294Z","hs_object_id":"18869855235","status_da_solucao_do_cliente":"Ativa"}},{"id":"18869855239","properties":{"c_digo_do_produto":"99105","hs_createdate":"2024-10-23T11:57:13.057Z","hs_lastmodifieddate":"2024-10-23T11:57:13.738Z","hs_object_id":"18869855239","status_da_solucao_do_cliente":"Ativa"}},{"id":"19074534293","properties":{"c_digo_do_produto":"99105","hs_createdate":"2024-10-29T16:25:00.527Z","hs_lastmodifieddate":"2024-10-29T16:25:01.295Z","hs_object_id":"19074534293","status_da_solucao_do_cliente":"Ativa"}},{"id":"19074534294","properties":{"c_digo_do_produto":"100001","hs_createdate":"2024-10-29T16:25:00.527Z","hs_lastmodifieddate":"2024-10-29T16:25:01.403Z","hs_object_id":"19074534294","status_da_solucao_do_cliente":"Ativa"}},{"id":"19074534302","properties":{"c_digo_do_produto":"99101","hs_createdate":"2024-10-29T16:25:00.527Z","hs_lastmodifieddate":"2024-10-29T16:25:01.403Z","hs_object_id":"19074534302","status_da_solucao_do_cliente":"Ativa"}},{"id":"19371146033","properties":{"c_digo_do_produto":"99205","hs_createdate":"2024-11-05T18:53:54.589Z","hs_lastmodifieddate":"2024-11-05T18:53:55.591Z","hs_object_id":"19371146033","status_da_solucao_do_cliente":"Ativa"}}]',
      companyId: "25007467287",
      solucoes_do_cliente:
        "99203;99205;100302;99101;99105;100001;100120;100122;100101;100105;100113;100110;100203;99206",
    },
    object: { objectId: 13555162237 },
  },
  console.log
);
