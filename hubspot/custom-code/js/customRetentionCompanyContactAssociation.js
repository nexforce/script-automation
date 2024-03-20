const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const axios = require("axios");

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.accessToken,
  });

  const cnpj = event.inputFields["cnpj"].toString().replace(/[^\d]/g, "");

  try {
    const filterGroups = [
      {
        filters: [
          {
            propertyName: "cnpj",
            operator: "EQ",
            value: cnpj.toString(),
          },
        ],
      },
      {
        filters: [
          {
            propertyName: "cpf_cnpj",
            operator: "EQ",
            value: cnpj.toString(),
          },
        ],
      },
    ];
    const sort = JSON.stringify({
      propertyName: "createdate",
      direction: "DESCENDING",
    });
    const query = "";
    const properties = ["createdate", "firstname", "lastname"];
    const limit = 100;
    const after = 0;

    const publicObjectSearchRequest = {
      filterGroups,
      sorts: [sort],
      query,
      properties,
      limit,
      after,
    };

    const companyReponse = await hubspotClient.crm.companies.searchApi.doSearch(
      publicObjectSearchRequest
    );

    console.log(companyReponse);

    const companyId = (((companyReponse || {}).results || [])[0] || {}).id;

    if (!companyId)
      // Empresa não encontrada com CNPJ
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
        error: JSON.stringify({ companyReponse }),
      });

    const contactId = event.object.objectId;

    const batchInputPublicAssociation = {
      inputs: [
        {
          _from: { id: contactId },
          to: { id: companyId },
          type: "contact_to_company",
        },
      ],
    };

    const associationResponse =
      await hubspotClient.crm.associations.batchApi.create(
        "contacts",
        "companies",
        batchInputPublicAssociation
      );

    const associationStatus = (associationResponse || {}).status;

    if (associationStatus !== "COMPLETE")
      // Erro ao criar associação
      return callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          error: JSON.stringify({ associationResponse }),
        },
      });

    return callback({
      outputFields: { hs_execution_state: "SUCCESS" },
    });
  } catch (err) {
    console.error(err);
    // Force retry if error is on cloudflare's side. (https://developers.hubspot.com/docs/api/error-handling#custom-code-workflow-actions)
    if (axios.isAxiosError(err) && JSON.stringify(err).includes("cloudflare"))
      err.response.status = 500;
    // We will automatically retry when the code fails because of a rate limiting error from the HubSpot API.
    throw err;
  }
}
// [FINAL]

exports.main(
  { inputFields: { cnpj: 23948209384029123 }, object: { objectId: 71851 } },
  console.log
);
