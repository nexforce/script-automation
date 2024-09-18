const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");
const baseUrlConversations = "https://api.hubapi.com/conversations/v3/";
const token = process.env.CHATBOT_REQUEST_TOKEN;

async function getThreadMessagesBy(id) {
  try {
    const url = `${baseUrlConversations}conversations/threads/${id}/messages`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({ url, method: "GET", headers });

    return response.data;
  } catch (error) {
    console.log("Error getting thread.");
    throw error;
  }
}

exports.main = async (event, callback) => {
  const { hs_thread_id } = event.inputFields;
  try {
    const thread = await getThreadMessagesBy(hs_thread_id);
    const incomingMessage = thread.results.find(
      (t) => t.direction === "INCOMING"
    );

    if (!incomingMessage) {
      console.log("Incoming message not found.");
      return await callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          success: false,
          contact_email: null,
          contact_first_name: null,
          contact_phone: null,
        },
      });
    }

    return await callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        success: true,
        contact_email: thread.results[0].text,
        contact_first_name: incomingMessage.senders[0].name,
        contact_phone: incomingMessage.senders[0].deliveryIdentifier.value,
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
      hs_thread_id: 8004973980,
    },
    object: { objectId: 2754704043 },
  },
  console.log
);
