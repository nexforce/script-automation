const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const axios = require("axios");

const CAMPAIGN_CUSTOM_OBJECT_ID = "2-17677686";
const CAMPAIGN_PROPERTY_MAPPINGS = {
  beneficios: "beneficios_de_captura",
  taxa_de_btc: "taxa_btc_de_captura",
  faixa_de_corretagem: "tabela_corretagem_de_captura",
  camp_parceiro: "parceiro_de_captura",
  celula_de_atendimento: "celulas_de_atendimento_de_captura",
  camp_lider: "lider_campanha",
  nome_da_campanha: "campanha_de_conversao", // campanha_de_conversao é de fato a Campanha de Captura, utilizamos a propriedade para facilitar e mudamos o rótulo
};

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.CodigoPersonalizadoIndicacaoComercial,
  });

  async function getAssociatedRecordIds(fromObject, toObject, fromObjectId) {
    const BatchInputPublicObjectId = { inputs: [{ id: fromObjectId }] };

    const associatedRecordsResponse =
      await hubspotClient.crm.associations.batchApi.read(
        fromObject,
        toObject,
        BatchInputPublicObjectId
      );

    const associatedRecordsArray =
      (((associatedRecordsResponse || {}).results || [])[0] || {}).to ?? [];

    return associatedRecordsArray.map((t) => t.id);
  }

  async function getUserNameById(userId) {
    const userResponse = await hubspotClient.crm.owners.ownersApi.getById(
      userId
    );
    return userResponse.firstName + " " + userResponse.lastName;
  }

  try {
    const associatedCampaignIdList = await getAssociatedRecordIds(
      "contacts",
      CAMPAIGN_CUSTOM_OBJECT_ID,
      event.object.objectId
    );

    if (!associatedCampaignIdList.length) {
      console.log("Error: no campaign associated with contact");
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    if (associatedCampaignIdList.length > 1) {
      console.log("Error: multiple campaign IDs associated with contact");
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    const [associatedCampaignId] = associatedCampaignIdList;

    const campaignData = await hubspotClient.crm.objects.basicApi.getById(
      CAMPAIGN_CUSTOM_OBJECT_ID,
      associatedCampaignId,
      Object.keys(CAMPAIGN_PROPERTY_MAPPINGS)
    );

    const contactPropertiesToUpdate = {};

    for (const campaignPropertyId in CAMPAIGN_PROPERTY_MAPPINGS) {
      const contactPropertyId = CAMPAIGN_PROPERTY_MAPPINGS[campaignPropertyId];
      const campaignValue = campaignData.properties[campaignPropertyId];
      if (campaignValue) {
        if (campaignPropertyId === "account_manager") {
          const userName = await getUserNameById(campaignValue);
          contactPropertiesToUpdate[contactPropertyId] = userName;
        } else {
          contactPropertiesToUpdate[contactPropertyId] = campaignValue;
        }
      }
    }

    const contactUpdateResponse =
      await hubspotClient.crm.contacts.basicApi.update(event.object.objectId, {
        properties: contactPropertiesToUpdate,
      });

    console.log(contactUpdateResponse);

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
    inputFields: {},
    object: { objectId: 666244651 },
  },
  console.log
);
