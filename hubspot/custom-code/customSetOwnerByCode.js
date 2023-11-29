const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const axios = require("axios");
const randomNumber = require("random-number-csprng");

const OWNER_CODE_INPUT_FIELD_ID = "owner_code";
const OWNER_OBJECT_TYPE_ID = "2-19945908";
const OWNER_CODE_PROPERTY_ID = "c_digo_de_assessor";
const OWNER_STATUS_PROPERTY_ID = "status";
const OWNER_STATUS_ACTIVE_VALUE_ID = "Assessor Ativo";

const selectRandomItem = async (arr) =>
  arr[arr.length > 1 ? await randomNumber(0, arr.length - 1) : 0];

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.codigoPersonalizadoRotacaoCodigoAssessor,
  });

  const recordId = event.object.objectId;

  const ownerCode = event.inputFields[OWNER_CODE_INPUT_FIELD_ID];

  try {
    if (!ownerCode) {
      console.log("Error: ownerCode value is not set");
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    let ownerId;

    const matchingOwnerResponse =
      await hubspotClient.crm.objects.searchApi.doSearch(OWNER_OBJECT_TYPE_ID, {
        properties: ["hubspot_owner_id"],
        filterGroups: [
          {
            filters: [
              {
                propertyName: OWNER_CODE_PROPERTY_ID,
                operator: "EQ",
                value: ownerCode,
              },
              {
                propertyName: OWNER_STATUS_PROPERTY_ID,
                operator: "EQ",
                value: OWNER_STATUS_ACTIVE_VALUE_ID,
              },
            ],
          },
        ],
        limit: 1,
      });

    switch (matchingOwnerResponse.total) {
      case 1:
        const [owner] = matchingOwnerResponse.results;

        ownerId = owner.properties.hubspot_owner_id;

        if (!ownerId) {
          console.log(`Error: "Owner" property is not set for ${ownerCode}`);
          return callback({
            outputFields: { hs_execution_state: "FAIL_CONTINUE" },
          });
        }

        break;
      case 0:
        console.log(
          `Info: no active owner found with code ${ownerCode}, searching randomly`
        );

        const allOwnersResponse =
          await hubspotClient.crm.objects.searchApi.doSearch(
            OWNER_OBJECT_TYPE_ID,
            {
              properties: ["hubspot_owner_id"],
              filterGroups: [
                {
                  filters: [
                    {
                      propertyName: OWNER_STATUS_PROPERTY_ID,
                      operator: "EQ",
                      value: OWNER_STATUS_ACTIVE_VALUE_ID,
                    },
                    {
                      propertyName: "hubspot_owner_id",
                      operator: "HAS_PROPERTY",
                    },
                  ],
                },
              ],
              limit: 100,
            }
          );

        if (!allOwnersResponse.total) {
          console.log("Error: no active owners found");
          return callback({
            outputFields: { hs_execution_state: "FAIL_CONTINUE" },
          });
        }

        const randomOwner = await selectRandomItem(allOwnersResponse.results);

        ownerId = randomOwner.properties.hubspot_owner_id;

        break;
      default:
        console.log(`Error: multiple active owners with code ${ownerCode}`);
        return callback({
          outputFields: { hs_execution_state: "FAIL_CONTINUE" },
        });
    }

    await hubspotClient.crm.contacts.basicApi.update(recordId, {
      properties: { hubspot_owner_id: ownerId },
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
    inputFields: { owner_code: "ABCD" },
    object: { objectId: 2820301 },
  },
  console.log
);
