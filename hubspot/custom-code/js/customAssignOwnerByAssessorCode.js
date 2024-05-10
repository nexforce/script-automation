const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const randomNumber = require("random-number-csprng");

const OWNER_CODE_INPUT_FIELD_ID = "owner_code";
const OWNER_OBJECT_TYPE_ID = "2-19945908";
const OWNER_CODE_PROPERTY_ID = "c_digo_de_assessor";
const CONTACT_STATUS_PROPERTY = "status_do_assessor";
const CUSTOM_OBJECT_STATUS_PROPERTY = "status";
const CUSTOM_OBJECT_REDIRECT_CELL_PROPERTY = "celula_para_redirecionamento";
const CONTACT_REDIRECT_CELL_PROPERTY = "celula_proprietaria";

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

    const matchingOwnerResponse = await hubspotClient.crm.objects.searchApi.doSearch(OWNER_OBJECT_TYPE_ID, {
      properties: [CUSTOM_OBJECT_STATUS_PROPERTY, CUSTOM_OBJECT_REDIRECT_CELL_PROPERTY, "hubspot_owner_id"],
      filterGroups: [
        {
          filters: [
            {
              propertyName: OWNER_CODE_PROPERTY_ID,
              operator: "EQ",
              value: ownerCode,
            },
          ],
        },
      ],
      limit: 1,
    });

    if (matchingOwnerResponse.total === 1) {
      const [owner] = matchingOwnerResponse.results;
      const customObjectStatus = owner.properties[CUSTOM_OBJECT_STATUS_PROPERTY];
      const customObjectRedirectCell = owner.properties[CUSTOM_OBJECT_REDIRECT_CELL_PROPERTY];
      const ownerId = owner.properties.hubspot_owner_id;

      switch (customObjectStatus) {
        case "Assessor Ativo":
          await hubspotClient.crm.contacts.basicApi.update(recordId, {
            properties: {
              hubspot_owner_id: ownerId, // Set owner of contact to owner of custom object
              [CONTACT_STATUS_PROPERTY]: "Assessor Ativo",
              [CONTACT_REDIRECT_CELL_PROPERTY]: customObjectRedirectCell, // Copy custom object property to contact property
            },
          });
          break;
        case "Assessor Inativo":
          await hubspotClient.crm.contacts.basicApi.update(recordId, {
            properties: {
              [CONTACT_STATUS_PROPERTY]: "Assessor Inativo",
              [CONTACT_REDIRECT_CELL_PROPERTY]: customObjectRedirectCell, // Copy custom object property to contact property
            },
          });
          break;
        case "Desativado":
          await hubspotClient.crm.contacts.basicApi.update(recordId, {
            properties: {
              [CONTACT_STATUS_PROPERTY]: "Assessor Desativado",
            },
          });
          break;
        default:
          console.log(`Error: Unrecognized custom object status: ${customObjectStatus}`);
          return callback({
            outputFields: { hs_execution_state: "FAIL_CONTINUE" },
          });
      }
    } else {
      console.log(`Info: no owner found with code ${ownerCode}, setting ${CONTACT_STATUS_PROPERTY} as "Assessor não identificado"`);
      await hubspotClient.crm.contacts.basicApi.update(recordId, {
        properties: {
          [CONTACT_STATUS_PROPERTY]: "Assessor não identificado",
        },
      });
    }

    // Return success state
    return callback({
      outputFields: { hs_execution_state: "SUCCESS" },
    });

  } catch (err) {
    console.error(err);
    // Error handling code remains unchanged
    throw err;
  }
};
// [FINAL]

exports.main(
  {
    inputFields: {},
    object: { objectId: 666244651 },
  },
  console.log
);
