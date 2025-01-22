const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");

const token = process.env.CONVERSATIONS_TOKEN;
const baseUrl = "https://api.hubapi.com";

async function getThreadMessageBy(threadId) {
  try {
    const url = `${baseUrl}/conversations/v3/conversations/threads/${threadId}/messages`;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({ method: "GET", url, headers });

    return response.data;
  } catch (error) {
    console.error("Error getting message by thread ID:", error.message);

    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

async function sendAfkMessageBy(threadId) {
  try {
    const url = `${baseUrl}/conversations/v3/conversations/threads/${threadId}/messages`;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const body = {
      type: "MESSAGE",
      text: "Mensagem de horário de funcionamento.",
      richText:
        "<div><p>Olá! 😊</p><p>É um prazer ter você conosco na Jusfy!</p><p>Recebemos seu contato e retornaremos em breve, dentro do nosso horário de atendimento, que é de segunda a sexta-feira, das 09h00 às 18h00.</p><p>Aguardamos você! 😉</p><p>Atenciosamente,</p><p>Equipe Jusfy</p></div>",
      senderActorId: "A-64279738",
      channelId: "1007",
      channelAccountId: "1049538268",
    };

    const response = await axios({ method: "POST", url, data: body, headers });

    return response.data;
  } catch (error) {
    console.error("Error sending message by thread ID:", error.message);

    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

exports.main = async (event, callback) => {
  try {
    const { threadId } = event.inputFields;

    const threadMessages = await getThreadMessageBy(threadId);

    const incomingMessage = threadMessages.results?.find(
      (message) => message.direction == "INCOMING"
    );

    if (!incomingMessage) {
      throw new Error("No received messages in this thread.");
    }

    const messageSent = await sendAfkMessageBy(threadId);

    const phoneNumber = incomingMessage.senders[0].deliveryIdentifier.value;
    console.log(`Message sent to phone number: ${phoneNumber}`);

    return await callback({
      outputFields: {
        messageId: messageSent.id,
      },
    });
  } catch (err) {
    await callback({
      outputFields: { hs_execution_state: "FAIL_CONTINUE" },
    });
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
    inputFields: {
      threadId: "8648737191",
    },
    object: {
      objectId: "",
    },
  },
  console.log
);
