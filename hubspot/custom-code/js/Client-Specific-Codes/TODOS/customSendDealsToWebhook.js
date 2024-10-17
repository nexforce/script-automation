const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");
const baseUrl =
  "https://bg4hpvw7c2.execute-api.us-east-1.amazonaws.com/v1/webhooks/hubspot/beta";

const token = process.env.HmlIntegracaoBackup;

async function sendDealsToWebhook(payload) {
  try {
    const url = `${baseUrl}`;

    const headers = {
      Authorization: token,
    };

    const data = payload;

    const response = await axios({ method: "POST", url, data, headers });

    return response.data;
  } catch (error) {
    console.error("Erro enviar deals:", error.message);

    const errorMessage =
      error.message || "Erro desconhecido ao enviar deals ao webhook.";

    throw new Error(errorMessage);
  }
}

exports.main = async (event, callback) => {
  try {
    const {
      paciente_id,
      amount,
      data,
      id_da_unidade,
      hubspot_owner_id,
      id_consulta,
      dealname,
    } = event.inputFields;

    const payload = {
      Id_do_paciente: paciente_id,
      Id_do_Registro: event.object.objectId,
      Valor: amount,
      Data_do_agendamento: new Date(data),
      Id_da_unidade_clinica: id_da_unidade,
      Proprietario_do_negocio: hubspot_owner_id,
      Id_do_agendamento: id_consulta,
      Nome_do_Negocio: dealname,
    };

    const webhookResponse = await sendDealsToWebhook(payload);

    await callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        webhook_response_number: webhookResponse.SequenceNumber,
      },
    });
  } catch (err) {
    console.error(err);
    await callback({
      outputFields: {
        hs_execution_state: "FAIL_CONTINUE",
      },
    });
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
      paciente_id: 443322,
      amount: 12,
      data: 1729167371479,
      id_da_unidade: 88991010,
      hubspot_owner_id: 112233,
      id_consulta: 223344,
      dealname: "Teste Integração NX",
    },
    object: { objectId: 13555162237 },
  },
  console.log
);
