const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");
const baseUrl = "https://api.hubapi.com/";
const token = process.env.CHATBOT_SGA_TOKEN;

async function searchTicketBy(threadId) {
  try {
    const url = `${baseUrl}crm/v3/objects/tickets/search`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const payload = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "hs_thread_ids_to_restore",
              operator: "EQ",
              value: threadId,
            },
          ],
        },
      ],
      properties: [
        "subject",
        "hs_object_id",
        "hs_thread_ids_to_restore",
        "area_de_atendimento___chatbot",
      ],
    };

    const response = await axios({
      url,
      method: "POST",
      data: payload,
      headers,
    });

    return response.data;
  } catch (error) {
    console.log("Error getting ticket by thread id.");
    throw error;
  }
}

exports.main = async (event, callback) => {
  const { hs_thread_id } = event.inputFields;
  try {
    const ticket = await searchTicketBy(hs_thread_id);

    if (ticket.results.length == 0) {
      return await callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          ticketId: null,
          areaAtentimento: null,
        },
      });
    }
    const ticketResponse = ticket.results[0];

    return await callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        ticketId: ticketResponse.id,
        areaAtentimento:
          ticketResponse.properties.area_de_atendimento___chatbot,
      },
    });
  } catch (err) {
    await callback({
      outputFields: { hs_execution_state: "FAIL_CONTINUE" },
    });
    console.error("ERRO:", err.message);
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
      hs_thread_id: "7950390032",
    },
    object: { objectId: "" },
  },
  console.log
);
