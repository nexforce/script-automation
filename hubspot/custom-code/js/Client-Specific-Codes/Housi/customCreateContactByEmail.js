const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");
const baseUrl = "https://api.hubapi.com/";
const token = process.env.CHATBOT_REQUEST_TOKEN;

async function searchContactBy(email) {
  try {
    const url = `${baseUrl}crm/v3/objects/contacts/search`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const data = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "email",
              operator: "EQ",
              value: email,
            },
          ],
        },
      ],
      properties: ["phone", "email", "firstname"],
    };

    const response = await axios({ url, method: "POST", headers, data });

    return response.data;
  } catch (error) {
    console.log("Error getting contact.");
    throw error;
  }
}

async function createContactBy(data) {
  try {
    const url = `${baseUrl}crm/v3/objects/contacts`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({ url, method: "POST", headers, data });

    return response.data;
  } catch (error) {
    console.log("Error getting thread.");
    throw error;
  }
}

exports.main = async (event, callback) => {
  const { contact_email, contact_first_name, contact_phone } =
    event.inputFields;

  const contactFound = await searchContactBy(contact_email);
  if (contactFound.total > 0) {
    console.log("Contact with this email already exists.");
    return await callback({
      outputFields: {
        hs_execution_state: "FAIL_CONTINUE",
        success: false,
        response: "Contact with this email already exists.",
      },
    });
  }

  const newContact = {
    email: contact_email,
    firstname: contact_first_name,
    phone: contact_phone,
    hs_whatsapp_phone_number: contact_phone,
  };

  const payload = {
    properties: newContact,
  };

  await createContactBy(payload);

  try {
    return await callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        success: true,
        response: "Contact created successfully",
        contact_email,
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
      contact_email: "",
      contact_first_name: "",
      contact_phone: "",
    },
    object: { objectId: 2754704043 },
  },
  console.log
);
