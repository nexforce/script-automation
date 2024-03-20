const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const axios = require("axios");

const CAMPAIGN_CUSTOM_OBJECT_ID = "2-17677686";
const CAMPAIGN_PROPERTY_ID = "agente_captacao";

const shuffleArray = (array) => {
  array = [...array]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
};

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.roundRobinAcessToken,
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

  async function getAllOwners() {
    let ownersList = [];
    let pagingToken = undefined;

    while (true) {
      const ownersResponse = await hubspotClient.crm.owners.ownersApi.getPage(
        undefined,
        pagingToken,
        500,
        false
      );

      ownersList = ownersList.concat(ownersResponse.results);

      pagingToken = ownersResponse.paging?.next.after;

      if (!pagingToken) break;
    }

    return ownersList;
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
      [CAMPAIGN_PROPERTY_ID]
    );

    const agenteCaptacaoProp = campaignData.properties[CAMPAIGN_PROPERTY_ID];

    if (!agenteCaptacaoProp) {
      console.log(`Error: ${CAMPAIGN_PROPERTY_ID} field is empty`);
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    const captureAgentsList = agenteCaptacaoProp.split(";");

    console.log(captureAgentsList);

    const ownersList = await getAllOwners();

    const shuffledOwnersList = shuffleArray(ownersList);

    // Get first existing owner from captureAgentsList
    const selectedOwner = shuffledOwnersList.find(o => captureAgentsList.some(email => email === o.email));

    if (!selectedOwner) {
      console.log(
        `Error: None of the owners in ${CAMPAIGN_PROPERTY_ID} property found in account`
      );
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    const ownerUpdateResponse =
      await hubspotClient.crm.contacts.basicApi.update(event.object.objectId, {
        properties: { responsavel_captacao: selectedOwner.id },
      });

    console.log(ownerUpdateResponse);

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
    object: { objectId: 101 },
  },
  console.log
);
