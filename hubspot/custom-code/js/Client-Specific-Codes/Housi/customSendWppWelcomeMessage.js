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

async function sendMessageToContact(informations) {
  try {
    const { threadId, recipientId, phone, senderId, channelAccountId } =
      informations;

    const url = `${baseUrlConversations}conversations/threads/${threadId}/messages`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const data = {
      type: "MESSAGE",
      text: "Mensagem de boas vindas!",
      richText: `<div>Olá!</div>
                <div>Sinta-se em casa, você está #indaHOUSi.</div>
                <div>Para conseguirmos te ajudar da melhor maneira possível, precisamos confirmar alguns dados, tá?</div>
                <div>Por favor, informe seu e-mail:</div>`,
      recipients: [
        {
          actorId: recipientId,
          deliveryIdentifier: {
            type: "HS_PHONE_NUMBER",
            value: phone,
          },
        },
      ],
      senderActorId: senderId,
      channelId: "1007",
      channelAccountId: channelAccountId,
    };

    const response = await axios({ url, method: "POST", data, headers });

    return response.data;
  } catch (error) {
    console.log("Error sending message.");
    throw error;
  }
}

exports.main = async (event, callback) => {
  const { hs_thread_id } = event.inputFields;
  try {
    const thread = await getThreadMessagesBy(hs_thread_id);

    const incomingMessage = thread.results.find(
      (result) => result.direction == "INCOMING"
    );

    if (!incomingMessage) {
      console.log("Incoming message not found.");
      return await callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          success: false,
          message: "Incoming message not found.",
        },
      });
    }
    const informations = {
      threadId: hs_thread_id,
      recipientId: incomingMessage.senders[0].actorId,
      phone: incomingMessage.senders[0].deliveryIdentifier.value,
      senderId: "A-61405219", // validar o sender
      channelAccountId: incomingMessage.channelAccountId,
    };

    const messageSent = await sendMessageToContact(informations);
    console.log("messageSent", messageSent);

    console.log("Message sent successfully!");
    return await callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        success: true,
        message: "Message sent successfully!",
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
      threadId: 7913726026,
    },
    object: { objectId: 2754704043 },
  },
  console.log
);
