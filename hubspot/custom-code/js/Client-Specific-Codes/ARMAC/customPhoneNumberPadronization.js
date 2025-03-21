const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");
const baseUrl = "https://api.hubapi.com/";
const token = process.env.PHONE_PADRONIZATION_TOKEN;

function normalizePhoneNumber(phoneNumber) {
  return `${+phoneNumber.replace(/\D/g, "")}`;
}

async function updateContactBy(id, phoneNumber) {
  try {
    const url = `${baseUrl}crm/v3/objects/contacts/${id}`;
    const body = {
      properties: {
        phone: phoneNumber,
      },
    };
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({ method: "PATCH", url, data: body, headers });

    return response.data;
  } catch (error) {
    console.error("Error updating contact.");

    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

exports.main = async (event, callback) => {
  try {
    const { phone } = event.inputFields;
    const { objectId } = event.object;

    let normalizedPhone = normalizePhoneNumber(phone);
    console.log(normalizedPhone);
    if (!normalizedPhone) {
      throw new Error("Telefone inválido para formatação.");
    }

    const phoneLength = normalizedPhone.length;
    if (phoneLength == 13 || phoneLength == 12) {
      console.log("Atualizando telefone para: ", normalizedPhone);
      await updateContactBy(objectId, normalizedPhone);
    } else if (phoneLength == 11 || phoneLength == 10) {
      normalizedPhone = `55${normalizedPhone}`;
      console.log("Atualizando telefone para: ", normalizedPhone);
      await updateContactBy(objectId, normalizedPhone);
    } else {
      throw new Error("Telefone inválido para formatação.");
    }

    return await callback({
      outputFields: {
        normalizedPhone,
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
      phone: "03499887766",
    },
    object: { objectId: 106671626575 },
  },
  console.log
);
