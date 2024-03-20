const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require('@hubspot/api-client');
const axios = require('axios');

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.accessToken
  });

    // Supondo que você tenha o ID do Goal disponível
    const goalId = event.object.objectId;

    try {
        // Buscar detalhes do Goal
      const goalDetails = await hubspotClient.crm.objects.basicApi.getById('goals', goalId);

      console.log(goalDetails)
        
        // Extrair as propriedades específicas do Goal
        const goalProperties = goalDetails.properties;
        const goalTarget = goalProperties['Goal Target'];
        const startDate = goalProperties['Start Date'];
        const endDate = goalProperties['End Date'];
        const currentProgress = goalProperties['Current Progress'];
        ;

        const comissionResponse = await hubspotClient.crm.objects.basicApi.create('comission', comissionData);

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
    inputFields: { franquiactn: "308" },
    object: { objectId: 285498429539 },
  },
  console.log
);


