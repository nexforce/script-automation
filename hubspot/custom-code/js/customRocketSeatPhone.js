const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");
const baseUrlCrm = "https://api.hubapi.com/crm/v3/objects/";
const baseUrlConversations = "https://api.hubapi.com/conversations/v3/";
const token = process.env.WHATSAPP_PHONE_ASSOCIATION_TOKEN;

async function getTicketBy(id) {
  try {
    const url = `${baseUrlCrm}tickets/${id}?properties=hs_thread_ids_to_restore,subject`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({ url, method: "GET", headers });

    return response.data;
  } catch (error) {
    console.log("Error getting ticket.");
    throw error;
  }
}

async function getThreadBy(id) {
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

async function searchContactBy(phone) {
  try {
    const url = `${baseUrlCrm}contacts/search`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const data = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "phone",
              operator: "EQ",
              value: phone,
            },
          ],
        },
      ],
      properties: ["phone", "hs_whatsapp_phone_number", "email"],
    };

    const response = await axios({ url, method: "POST", data, headers });

    return response.data;
  } catch (error) {
    console.log("Error getting contact.");
    throw error;
  }
}

async function associateTicketAndContact(ticketId, contactId) {
  try {
    const url = `${baseUrlCrm}tickets/${ticketId}/associations/contacts/${contactId}/16`;
    const headers = {
      Authorization: `Bearer ${token}`,
      ["Content-Type"]: "application/json",
    };

    const response = await axios({ url, method: "PUT", headers });

    return response.data;
  } catch (error) {
    console.log("Error associating ticket and contact.");
    throw error;
  }
}

async function updateContactBy(id, data) {
  try {
    const url = `${baseUrlCrm}contacts/${id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      ["Content-Type"]: "application/json",
    };

    const payload = {
      properties: {
        hs_whatsapp_phone_number: data.wppNumber,
      },
    };

    const response = await axios({
      url,
      method: "PATCH",
      data: payload,
      headers,
    });

    return response.data;
  } catch (error) {
    console.log("Error updating contact.");
    throw error;
  }
}

exports.main = async (event, callback) => {
  try {
    if (!event.inputFields.subject.includes("WhatsApp")) {
      return await callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          information: "Ticket is not from WhatsApp message.",
        },
      });
    }
    const ticketId = event.object.objectId;
    const ticket = await getTicketBy(ticketId);

    console.log(ticket);

    const threadMessages = await getThreadBy(
      ticket.properties.hs_thread_ids_to_restore
    );

    const inboundMessage = threadMessages.results.find(
      (message) => message.direction === "INCOMING"
    );

    if (!inboundMessage) {
      return await callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          information: "Incoming message was not found.",
        },
      });
    }

    const phone = inboundMessage.senders[0].deliveryIdentifier.value;
    console.log(phone);

    let contact = await searchContactBy(phone);

    console.log(contact);

    if (contact.total > 0) {
      return await callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          information: "An user was found with phone coming from message.",
        },
      });
    }
    const phoneWithNinthDigit = phone.slice(0, 5) + "9" + phone.slice(5);
    console.log(phoneWithNinthDigit);

    contact = await searchContactBy(phoneWithNinthDigit);

    console.log(contact);

    if (contact.total === 0) {
      return await callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          information:
            "A user with the phone number edited to include the ninth digit was not found.",
        },
      });
    }

    const contactId = contact.results[0].id;

    await associateTicketAndContact(ticketId, contactId);

    await updateContactBy(contactId, {
      wppNumber: phone,
    });

    return await callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        information:
          "Contact WhatsApp phone number was updated and association were created.",
        ticketId,
        contactId,
        wppNumber: phoneWithNinthDigit,
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
      subject: "Rocketseat23/05/2024WhatsApp",
    },
    object: { objectId: 2754704043 },
  },
  console.log
);
