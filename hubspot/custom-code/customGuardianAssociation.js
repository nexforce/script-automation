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

  const email = event.inputFields["email"];
  const guardianName = event.inputFields["guardian_name"];
  // const guardianLastName = event.inputFields["guardian_last_name"];

  try {
    const filterGroups = [
      {
        filters: [
          {
            propertyName: "email",
            operator: "EQ",
            value: email,
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

    const contactReponse = await hubspotClient.crm.contacts.searchApi.doSearch(
      publicObjectSearchRequest
    );

    console.log("search", contactReponse);

    let contactId = (((contactReponse || {}).results || [])[0] || {}).id;

    if (!contactId) {
      // Contato não encontrado com email, criando ele
      const publicObjectCreateRequest = {
        properties: {
          email,
          firstname: guardianName,
          // lastname: guardianLastName,
        },
      };

      const createContactReponse =
        await hubspotClient.crm.contacts.basicApi.create(
          publicObjectCreateRequest
        );

      console.log("create", createContactReponse);

      contactId = (createContactReponse || {}).id;

      if (!contactId)
        // Não foi possível criar contato
        return callback({
          outputFields: { hs_execution_state: "FAIL_CONTINUE" },
          error: JSON.stringify({ createContactReponse }),
        });
    }

    const guardianId = event.object.objectId;

    const batchInputPublicAssociation = {
      inputs: [
        {
          _from: { id: guardianId },
          to: { id: contactId },
          type: "associated_contact",
        },
      ],
    };

    const fromCustomObjectType = "2-16213212";
    const toObjectType = "contacts";

    const associationResponse =
      await hubspotClient.crm.associations.batchApi.create(
        fromCustomObjectType,
        toObjectType,
        batchInputPublicAssociation
      );

    console.log("association", associationResponse);

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
};
// [FINAL]

exports.main(
  {
    inputFields: {
      email: "testeassociacaoguardiao20@gmail.com",
      guardian_name: "Teste 20 Associação Guardião",
      // guardian_last_name: "Sobrenome",
    },
    object: { objectId: 7181283101 },
  },
  console.log
);
