const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const axios = require("axios");

// Detalhe: Parece que os valores da Sandbox são iguais aos em produção
const MAX_TASKS_ALLOWED_PER_DAY = 40;

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.taskLimitingAccessToken,
  });

  const taskOwnerId = event.inputFields["task_owner"];

  try {
    const tasksResponse = await (
      await hubspotClient.apiRequest({
        path: "/crm/v3/objects/tasks/search",
        method: "POST",
        body: {
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "hubspot_owner_id",
                  operator: "EQ",
                  value: taskOwnerId,
                },
              ],
            },
          ],
        },
      })
    ).json();

    console.log(tasksResponse);

    if (tasksResponse.total >= MAX_TASKS_ALLOWED_PER_DAY)
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
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
  { inputFields: { task_owner: 455411252 }, object: { objectId: 71851 } },
  console.log
);
