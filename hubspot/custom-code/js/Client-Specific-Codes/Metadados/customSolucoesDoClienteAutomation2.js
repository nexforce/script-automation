const hubspot = require("@hubspot/api-client");

const stringifyOrExtractError = (error) =>
  error.message === "HTTP request failed"
    ? JSON.stringify(error.response, undefined, 2)
    : error.message;

const throwError = (error, message) => {
  throw new Error(`${message}: ${stringifyOrExtractError(error)}`);
};

const searchRequestBody = (propertyName, values, after = null) => {
  const body = {
    filterGroups: [
      {
        filters: [
          {
            propertyName,
            operator: "IN",
            values,
          },
        ],
      },
    ],
    limit: 100,
  };
  if (after) body.after = after;
  return body;
};

const exponentialBackoff = async (fn, retries = 3) => {
  let attempt = 0;
  let delay = 1000;

  while (attempt < retries) {
    try {
      return await fn();
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.warn(`Rate limit reached, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        attempt++;
      } else {
        throwError(error, "An error occurred during execution");
      }
    }
  }

  throw new Error("Maximum retries exceeded");
};

const fetchAllResults = async (client, requestBody, objectTypeId) => {
  const results = [];
  let response = await exponentialBackoff(() =>
    client.crm.objects.searchApi.doSearch(objectTypeId, requestBody)
  );

  results.push(...response.results);

  while (response.paging?.next?.after) {
    requestBody.after = response.paging.next.after;
    response = await exponentialBackoff(() =>
      client.crm.objects.searchApi.doSearch(objectTypeId, requestBody)
    );
    results.push(...response.results);
  }

  return results;
};

exports.main = async (event, callback) => {
  const { API_TOKEN: accessToken } = process.env;
  const productSkus = event.inputFields.solucoes_do_cliente.split(";");
  const solutionObjectId = "2-29995024";
  const associationTypeId = 290;

  const client = new hubspot.Client({ accessToken });

  try {
    const companyId = event.object.objectId;

    const existingSolutions = await fetchAllResults(
      client,
      searchRequestBody("c_digo_do_produto", productSkus),
      solutionObjectId
    );

    console.log("existingSolutions", existingSolutions);

    let solutionToCompanyAssociationsResponse;
    try {
      solutionToCompanyAssociationsResponse =
        await client.crm.associations.v4.batchApi.getPage(
          solutionObjectId,
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

    solutionToCompanyAssociationsResponse.results.forEach((solution) =>
      console.log(solution.to)
    );

    const solutionsNotToCreate =
      solutionToCompanyAssociationsResponse.results.filter(
        (s) => String(s.to[0].toObjectId) == companyId
      );
    //   .filter((s) => !!existingSolutions.find((es) => es.id === s._from.id))
    //   .map((s) => existingSolutions.find((es) => es.id === s._from.id))
    //   .filter(
    //     (s) =>
    //       s.properties.status_da_solucao_do_cliente.trim().toLowerCase() !==
    //       "inativa"
    //   )
    //   .map((s) => s.properties.c_digo_do_produto);

    console.log("solutionsNotToCreate", solutionsNotToCreate);

    const solutionsToCreate = productSkus.filter(
      (sku) => !solutionsNotToCreate.includes(sku)
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

    if (!solutionsToCreate.length) {
      console.log("No solutions to create");
      return;
    }

    const products = await fetchAllResults(
      client,
      searchRequestBody(
        "hs_sku",
        solutionsToCreate.map((sku) => sku.toLowerCase())
      ),
      "products"
    );

    if (!products.length) {
      throw new Error(`No products found for SKUs: ${solutionsToCreate}`);
    }

    /*) await client.crm.objects.batchApi.create(solutionObjectId, {
      inputs: products.map((product) => ({
        properties: {
          nome_do_produto: product.properties.name,
          c_digo_do_produto: product.properties.id_metadados,
          status_da_solucao_do_cliente: "Ativa",
        },
        associations: [
          {
            to: { id: companyId },
            types: [
              {
                associationCategory: "USER_DEFINED",
                associationTypeId: associationTypeId,
              },
            ],
          },
        ],
      })),
    });
    */

    console.log("Solutions created successfully.");
  } catch (error) {
    console.error(stringifyOrExtractError(error));
  }
};
