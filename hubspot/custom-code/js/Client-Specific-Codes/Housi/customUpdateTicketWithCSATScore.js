const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");
const baseUrl = "https://api.hubapi.com/";
const token = process.env.CHATBOT_REQUEST_TOKEN;

async function searchTicketBy(threadId) {
  try {
    const url = `${baseUrl}crm/v3/objects/ticket/search`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const data = {
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
      properties: ["hs_thread_ids_to_restore", "subject", "hubspot_owner_id"],
    };

    const response = await axios({ url, method: "POST", headers, data });

    return response.data;
  } catch (error) {
    console.log("Error getting ticket.");
    throw error;
  }
}

async function updateTicketBy(id, score) {
  try {
    const url = `${baseUrl}crm/v3/objects/tickets/${id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const data = {
      properties: { csat_score: score },
    };

    const response = await axios({ url, method: "PATCH", headers, data });

    return response.data;
  } catch (error) {
    console.log("Error updating ticket.");
    throw error;
  }
}

exports.main = async (event, callback) => {
  const { hs_thread_id, ticket_score } = event.inputFields;
  try {
    const ticket = await searchTicketBy(hs_thread_id);

    if (ticket.total == 0) {
      console.log("Ticket not found.");
      return await callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          success: false,
          message: "Ticket not found.",
          ticket: null,
        },
      });
    }

    console.log("Updating ticket...");
    await updateTicketBy(ticket.results[0].id, ticket_score);

    return await callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        success: true,
      },
    });
  } catch (err) {
    console.error("ERRO:", err.message);
    await callback({
      outputFields: { hs_execution_state: "FAIL_CONTINUE", success: false },
    });
    // Force retry if error is on cloudflare's side. (https://developers.hubspot.com/docs/api/error-handling#custom-code-workflow-actions)
    if (axios.isAxiosError(err) && JSON.stringify(err).includes("cloudflare"))
      err.response.status = 500;
    // We will automatically retry when the code fails because of a rate limiting error from the HubSpot API.
    throw err.message;
  }
};

// [FINAL]

exports.main(
  {
    inputFields: {
      hs_thread_id: 7954012074,
      ticket_score: 10,
    },
    object: { objectId: 2754704043 },
  },
  console.log
);
