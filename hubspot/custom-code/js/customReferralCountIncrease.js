const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");

const REFERENCED_BY_INPUT_FIELD_ID = "mgm__referenciado_por";
const CONTACT_OBJECT_TYPE_ID = "0-1"; // ID do objeto Contato
const REFERRAL_PROPERTY_ID = "mgm__referral";
const REFERRED_CONTACTS_PROPERTY_ID = "mgm__numero_de_contatos_indicados";

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.CodigoPersonalizadoMGM,
  });

  const recordId = event.object.objectId;
  const referencedBy = event.inputFields[REFERENCED_BY_INPUT_FIELD_ID];

  console.log("Record ID:", recordId);
  console.log("Referenced By:", referencedBy);

  try {
    if (!referencedBy) {
      console.log("Error: ReferencedBy value is not set");
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    // Realizando a busca pelo contato correspondente
    const matchingContactResponse = await hubspotClient.crm.objects.searchApi.doSearch(CONTACT_OBJECT_TYPE_ID, {
      properties: [REFERRAL_PROPERTY_ID, REFERRED_CONTACTS_PROPERTY_ID], // Adicionando a propriedade REFERRED_CONTACTS_PROPERTY_ID na busca
      filterGroups: [
        {
          filters: [
            {
              propertyName: REFERRAL_PROPERTY_ID,
              operator: "EQ",
              value: referencedBy,
            },
          ],
        },
      ],
      limit: 1,
    });

    console.log("Matching Contact Response:", matchingContactResponse);

    if (matchingContactResponse.total === 1) {
      const [contact] = matchingContactResponse.results;
      console.log("Contact Found:", contact);

      // Obtendo o número atual de contatos indicados pelo contato encontrado
      const referredContactsCount = parseInt(contact.properties[REFERRED_CONTACTS_PROPERTY_ID], 10) || 0; // Convertendo para número

      console.log("Referred Contacts Count:", referredContactsCount);

      // Atualizando o número de contatos indicados pelo contato encontrado
      const updatedProperties = {
        [REFERRED_CONTACTS_PROPERTY_ID]: referredContactsCount + 1,
      };

      console.log("Updating contact properties:", updatedProperties); // Adicionando log antes da atualização

      try {
        // Realizando a atualização das propriedades do contato
        await hubspotClient.crm.objects.basicApi.update(CONTACT_OBJECT_TYPE_ID, contact.id, {
          properties: updatedProperties,
        });

        console.log(`Referred contacts count updated for contact with ID ${contact.id}`);
      } catch (error) {
        console.error("Error updating contact properties:", error);
        throw error;
      }
    } else {
      console.log(`Info: No contact found with referral ID ${referencedBy}`);
      return callback({
        outputFields: { hs_execution_state: "ERROR" },
      });
    }

    return callback({
      outputFields: { hs_execution_state: "SUCCESS" },
    });
  } catch (err) {
    console.error("Error:", err);
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
