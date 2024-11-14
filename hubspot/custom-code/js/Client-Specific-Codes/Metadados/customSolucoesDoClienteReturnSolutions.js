const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]

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

function waitFor(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

const solutionObjectTypeId = "2-29995024";

exports.main = async (event, callback) => {
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
        console.log("looping", existingSolutionsResponse.paging?.next?.after);
        existingSolutionsResponse = await client.crm.objects.searchApi.doSearch(
          solutionObjectTypeId,
          searchExistingSolutionsRequestBody(productSkus, {
            after: Number.parseInt(existingSolutionsResponse.paging.next.after),
          })
        );

        existingSolutionsResponse.results.forEach((r) =>
          existingSolutions.push(r)
        );

        if (existingSolutionsResponse.total > 799) {
          console.log("Entrou no wait");
          waitFor(0.5);
        }
      }
    } catch (error) {
      throwError(
        error,
        "Ocorreu um erro ao buscar as soluções do cliente existentes"
      );
    }

    const cleanedSolutions = existingSolutions.map((solution) => {
      const { createdAt, archived, updatedAt, ...rest } = solution;

      return rest;
    });

    return await callback({
      outputFields: {
        existingSolutions: JSON.stringify(cleanedSolutions),
        companyId,
      },
    });
  } catch (error) {
    console.error(stringifyOrExtractError(error));
  }
};

// [FINAL]

exports.main(
  {
    inputFields: {},
    object: { objectId: 13555162237 },
  },
  console.log
);
