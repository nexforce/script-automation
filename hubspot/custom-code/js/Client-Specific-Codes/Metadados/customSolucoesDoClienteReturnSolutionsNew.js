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
        {
          propertyName: "id_da_conta",
          operator: "HAS_PROPERTY",
        },
        {
          propertyName: "lifecyclestage",
          operator: "IN",
          values: [67972101, "customer"],
        },
      ],
    },
  ],
});

const searchExistingSolutionsRequestBody = (ids, after) => {
  let body = {
    filterGroups: [
      {
        filters: [
          {
            operator: "IN",
            propertyName: "hs_object_id",
            values: ids,
          },
          {
            operator: "HAS_PROPERTY",
            propertyName: "c_digo_do_produto",
          },
          {
            operator: "EQ",
            propertyName: "status_da_solucao_do_cliente",
            value: "Ativa",
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

const solutionObjectTypeId = "2-27581922";

exports.main = async (event, callback) => {
  const { API_TOKEN: accessToken } = process.env;
  const cnpj = event.inputFields.cnpj;
  const sdc = event.inputFields.solucoes_do_cliente;
  const client = new hubspot.Client({
    accessToken,
  });

  try {
    const searchCompaniesResponse =
      await client.crm.companies.searchApi.doSearch({
        ...propertyEquals("cnpj", cnpj),
        properties: ["hs_object_id"],
      });

    if (searchCompaniesResponse.results.length === 0) {
      throwMessage(`empresa com cnpj "${cnpj}" não encontrada`);
    } else if (searchCompaniesResponse.results.length > 1) {
      console.warn(
        `encontrada mais de uma empresa com o cnpj "${cnpj}"; a primeira ocorrência será utilizada`
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
      const solutionsAssociatedToCompany =
        await client.crm.associations.v4.basicApi.getPage(
          "company",
          companyId,
          solutionObjectTypeId,
          0,
          100
        );

      const idsToGet = solutionsAssociatedToCompany.results?.map(
        (solution) => solution.toObjectId
      );
      console.log(idsToGet);
      console.log(idsToGet.length);

      if (idsToGet.length === 0) {
        return await callback({
          outputFields: {
            existingSolutions: "[]",
            companyId,
          },
        });
      }

      let existingSolutionsResponse =
        await client.crm.objects.searchApi.doSearch(
          solutionObjectTypeId,
          searchExistingSolutionsRequestBody(idsToGet)
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
        existingSolutions: JSON.stringify(cleanedSolutions) || "[]",
        companyId,
      },
    });
  } catch (error) {
    console.error(stringifyOrExtractError(error));
    throw error;
  }
};

// [FINAL]

exports.main(
  {
    inputFields: {
      nomeEmpresa: "LF TESTE NX 0811",
      solucoes_do_cliente:
        "99301;99302;99303;99304;99210;99207;99208;99105;99103;99104",
    },
    object: { objectId: 13555162237 },
  },
  console.log
);
