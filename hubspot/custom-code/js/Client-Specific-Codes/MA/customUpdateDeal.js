const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");
const baseUrl = "https://api.hubapi.com/";
const token = process.env.NX_SELLER_DEAL_APP_TOKEN;

async function updateDealBy(id, data) {
  try {
    const url = `${baseUrl}crm/v3/objects/deals/${id}`;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({ url, method: "PATCH", data, headers });

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar o Deal", error.message);

    const errorMessage =
      error.response?.data?.message ||
      "Erro desconhecido ao tentar atualizar o Deal";

    throw new Error(errorMessage);
  }
}

exports.main = async (event, callback) => {
  try {
    const { objectId } = event.object;
    const { seller_code, subsidiary } = event.inputFields;
    const payload = {
      properties: { c5_vend1: seller_code, c5_filial: subsidiary },
    };

    await updateDealBy(objectId, payload);

    return await callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        seller_code,
        subsidiary,
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
      seller_code: "000725",
      subsidiary: "0105",
    },
    object: { objectId: "23031717686" },
  },
  console.log
);
