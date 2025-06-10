const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");

const customObjectId = "2-28064547";

async function getMigrationCard(id, token) {
  try {
    const url = `https://api.qa.thunders.com.br/bpmn/v1/cards/${id}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({ method: "GET", url, headers });

    return response.data;
  } catch (error) {
    console.error("", error.message);
    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

async function updateUCBy(id, data) {
  try {
    const hsToken = process.env.UNIDADE_CONSUMIDORA_TOKEN;

    const url = `https://api.hubapi.com/crm/v3/objects/${customObjectId}/${id}`;

    const headers = {
      Authorization: `Bearer ${hsToken}`,
    };

    const uc = await axios({ url, method: "PATCH", headers, data });

    return uc.data;
  } catch (error) {
    console.error("Error updating UC", error.message);
    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

function ucPropertiesMapper(migrationCard) {
  return {
    properties: {
      status_da_migracao_thunders: migrationCard.currentStage.name,
      status_da_migracao: findFieldByName(migrationCard.fields, "Status"),
      valor_dhc: findFieldByName(migrationCard.fields, "Valor DHC"),
      valor_m_usd: findFieldByName(migrationCard.fields, "Valor MUSD"),
      pagamento_de_multa: findFieldByName(
        migrationCard.fields,
        "Pagamento Multa"
      ),
      comentario_da_migracao: findFieldByName(
        migrationCard.fields,
        "Coment. Distribuidora"
      ),
      data_da_validacao_concessionaria: findFieldByName(
        migrationCard.fields,
        "Data Validacao"
      ),
      codigoagenteconcessionariaunidadeconsumidora: findFieldByName(
        migrationCard.fields,
        "Codigo agente concessionaria UC"
      ),
      thunders_codigo_do_card_migracao: migrationCard.code,
      data_da_ultima_consulta_de_status_da_migracao: new Date().toISOString(),
      id_migracao_simplificada: findFieldByName(
        migrationCard.fields,
        "Id da Solicitação CCEE"
      ),
    },
  };
}

function findFieldByName(fields, name) {
  return fields.find((field) => field.name === name)?.value;
}

exports.main = async (event, callback) => {
  try {
    const { token, id_migracao } = event.inputFields;

    const migrationCard = await getMigrationCard(id_migracao, token);
    console.log("Migration Card:", migrationCard);

    if (!migrationCard) {
      throw new Error("Migration card not found.");
    }

    const payloadToUpdateUC = ucPropertiesMapper(migrationCard);
    console.log("Payload to update UC:", payloadToUpdateUC);

    await updateUCBy(event.object.objectId, payloadToUpdateUC);
    console.log("UC updated successfully.");

    return await callback({
      outputFields: {},
    });
  } catch (err) {
    console.error(err);
    // Force retry if error is on cloudflare's side. (https://developers.hubspot.com/docs/api/error-handling#custom-code-workflow-actions)
    if (axios.isAxiosError(err) && JSON.stringify(err).includes("cloudflare"))
      err.response.status = 500;
    // We will automatically retry when the code fails because of a rate limiting error from the HubSpot API.
    throw err;
  }
};

// [FINAL];

exports.main(
  {
    inputFields: {
      token:
        "eyJhbGciOiJSUzI1NiIsImtpZCI6IjY1NzQyNTVBRjlDNkNBM0ExRjgzM0ZFQ0E5NkI2QzlDIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE3NDk1NzcwNzgsImV4cCI6MTc0OTU4Nzg3OCwiaXNzIjoiaHR0cHM6Ly9hdXRoLnFhLnRodW5kZXJzLmNvbS5iciIsImF1ZCI6WyJhcGkiLCJUaHVuZGVycyIsIlRodW5kZXJzLkFjck9wZXJhdGlvbnMiLCJUaHVuZGVycy5BY3JPcGVyYXRpb25zLkNCUiIsIlRodW5kZXJzLkFjck9wZXJhdGlvbnMuRW5lcmd5QmFsYW5jZSIsIlRodW5kZXJzLkFDck9wZXJhdGlvbnNDQlIiLCJUaHVuZGVycy5BZGRpdGlvbmFsRW50cnkiLCJUaHVuZGVycy5BcGlHYXRld2F5IiwiVGh1bmRlcnMuQmFja09mZmljZUFjbCIsIlRodW5kZXJzLkJiY2UiLCJUaHVuZGVycy5CSSIsIlRodW5kZXJzLkNhbGN1bGF0aW9uUHJlbWlzZXMiLCJUaHVuZGVycy5DYWxjdWxhdG9yIiwiVGh1bmRlcnMuQ29tbXVuaWNhdGlvbnMiLCJUaHVuZGVycy5DUk0iLCJUaHVuZGVycy5DdXN0b21lckludm9pY2UiLCJUaHVuZGVycy5DdXN0b21lckludm9pY2VTZXJ2aWNlIiwiVGh1bmRlcnMuRGlzdHJpYnV0aW9uIiwiVGh1bmRlcnMuRGlzdHJpYnV0aW9uLkFjci5DY2VhcmMiLCJUaHVuZGVycy5EaXN0cmlidXRpb24uQWNyLkNjZWFyZCIsIlRodW5kZXJzLkRpc3RyaWJ1dGlvbi5BY3IuUXVvdGEiLCJUaHVuZGVycy5FbmVyZ3lQZW5hbHRpZXMiLCJUaHVuZGVycy5Gb3VyRXllcyIsIlRodW5kZXJzLkdlbmVyYXRpb24uUGh5c0d1YXJhbnRlZSIsIlRodW5kZXJzLkd1YXJhbnRlZSIsIlRodW5kZXJzLkd1YXJhbnRlZWRTYXZpbmdzIiwiVGh1bmRlcnMuSWRlbnRpdHlTZXJ2ZXIiLCJUaHVuZGVycy5JbnRlZ3JhdGlvbkhhbmRsZXIiLCJUaHVuZGVycy5JbnRlZ3JhdGlvbnMuQ2NlZSIsIlRodW5kZXJzLkludGVncmF0aW9ucy5DY2VlLkltcG9ydHMiLCJUaHVuZGVycy5JbnRlZ3JhdGlvbnMuRm9jdXMuRW5kdXNlciIsIlRodW5kZXJzLkludGVncmF0aW9ucy5XYXkyIiwiVGh1bmRlcnMuTGVnYWwiLCJUaHVuZGVycy5NYXJrZXRJbmZvIiwiVGh1bmRlcnMuTWVhc3VyZW1lbnQiLCJUaHVuZGVycy5NUkUiLCJUaHVuZGVycy5PcGVyYXRpb25zIiwiVGh1bmRlcnMuUG9ydGZvbGlvIiwiVGh1bmRlcnMuUG9zdG1hbiIsIlRodW5kZXJzLlBvc3RtYW4uRW1haWxDb21tdW5pY2F0aW9ucyIsIlRodW5kZXJzLlByb3Bvc2FscyIsIlRodW5kZXJzLlJpc2tFbmdpbmUiLCJUaHVuZGVycy5TY2VuYXJpb3MiLCJUaHVuZGVycy5TZWFzb25hbGl0eSIsIlRodW5kZXJzLlNlcnZpY2VSZXBvcnRzIiwiVGh1bmRlcnMuU2VydmljZXMuU2ltdWxhdGlvbiIsIlRodW5kZXJzLlNlcnZpY2VzQm9vayIsIlRodW5kZXJzLlNlcnZpY2VzQ2FsY3VsYXRvciIsIlRodW5kZXJzLlNuYXBzaG90IiwiVGh1bmRlcnMuU3VydmV5IiwiVGh1bmRlcnMuU3lzdGVtTWFuYWdlbWVudCIsIlRodW5kZXJzLlR1c2QiXSwiY2xpZW50X2lkIjoiZWNvbXFhX2JwbW4iLCJ0aHVuZGVycy10ZW5hbnRpZCI6IjQ2MGY3MGQ4LTI1OTktNDEwMC05ZmI5LTkxZTQ1NDJmOTRmZCIsImlhdCI6MTc0OTU3NzA3OCwic2NvcGUiOlsiYXBpIiwiVGh1bmRlcnMiLCJUaHVuZGVycy5BY3JPcGVyYXRpb25zIiwiVGh1bmRlcnMuQWNyT3BlcmF0aW9ucy5DQlIiLCJUaHVuZGVycy5BY3JPcGVyYXRpb25zLkVuZXJneUJhbGFuY2UiLCJUaHVuZGVycy5BQ3JPcGVyYXRpb25zQ0JSIiwiVGh1bmRlcnMuQWRkaXRpb25hbEVudHJ5IiwiVGh1bmRlcnMuQXBpR2F0ZXdheSIsIlRodW5kZXJzLkJhY2tPZmZpY2VBY2wiLCJUaHVuZGVycy5CYmNlIiwiVGh1bmRlcnMuQkkiLCJUaHVuZGVycy5DYWxjdWxhdGlvblByZW1pc2VzIiwiVGh1bmRlcnMuQ2FsY3VsYXRvciIsIlRodW5kZXJzLkNvbW11bmljYXRpb25zIiwiVGh1bmRlcnMuQ1JNIiwiVGh1bmRlcnMuQ3VzdG9tZXJJbnZvaWNlIiwiVGh1bmRlcnMuQ3VzdG9tZXJJbnZvaWNlU2VydmljZSIsIlRodW5kZXJzLkRpc3RyaWJ1dGlvbiIsIlRodW5kZXJzLkRpc3RyaWJ1dGlvbi5BY3IuQ2NlYXJjIiwiVGh1bmRlcnMuRGlzdHJpYnV0aW9uLkFjci5DY2VhcmQiLCJUaHVuZGVycy5EaXN0cmlidXRpb24uQWNyLlF1b3RhIiwiVGh1bmRlcnMuRW5lcmd5UGVuYWx0aWVzIiwiVGh1bmRlcnMuRm91ckV5ZXMiLCJUaHVuZGVycy5HZW5lcmF0aW9uLlBoeXNHdWFyYW50ZWUiLCJUaHVuZGVycy5HdWFyYW50ZWUiLCJUaHVuZGVycy5HdWFyYW50ZWVkU2F2aW5ncyIsIlRodW5kZXJzLklkZW50aXR5U2VydmVyIiwiVGh1bmRlcnMuSW50ZWdyYXRpb25IYW5kbGVyIiwiVGh1bmRlcnMuSW50ZWdyYXRpb25zLkNjZWUiLCJUaHVuZGVycy5JbnRlZ3JhdGlvbnMuQ2NlZS5JbXBvcnRzIiwiVGh1bmRlcnMuSW50ZWdyYXRpb25zLkZvY3VzLkVuZHVzZXIiLCJUaHVuZGVycy5JbnRlZ3JhdGlvbnMuV2F5MiIsIlRodW5kZXJzLkxlZ2FsIiwiVGh1bmRlcnMuTWFya2V0SW5mbyIsIlRodW5kZXJzLk1lYXN1cmVtZW50IiwiVGh1bmRlcnMuTVJFIiwiVGh1bmRlcnMuT3BlcmF0aW9ucyIsIlRodW5kZXJzLlBvcnRmb2xpbyIsIlRodW5kZXJzLlBvc3RtYW4iLCJUaHVuZGVycy5Qb3N0bWFuLkVtYWlsQ29tbXVuaWNhdGlvbnMiLCJUaHVuZGVycy5Qcm9wb3NhbHMiLCJUaHVuZGVycy5SaXNrRW5naW5lIiwiVGh1bmRlcnMuU2NlbmFyaW9zIiwiVGh1bmRlcnMuU2Vhc29uYWxpdHkiLCJUaHVuZGVycy5TZXJ2aWNlUmVwb3J0cyIsIlRodW5kZXJzLlNlcnZpY2VzLlNpbXVsYXRpb24iLCJUaHVuZGVycy5TZXJ2aWNlc0Jvb2siLCJUaHVuZGVycy5TZXJ2aWNlc0NhbGN1bGF0b3IiLCJUaHVuZGVycy5TbmFwc2hvdCIsIlRodW5kZXJzLlN1cnZleSIsIlRodW5kZXJzLlN5c3RlbU1hbmFnZW1lbnQiLCJUaHVuZGVycy5UdXNkIl19.ntVSFPFXgwm3Hzk8oNU43BFkQhLGQkuCfNjLzt9-s9GeprmGmQVv-A4OAiy2x5CJAmnmVxKJq0KFetIlvNXbO2IMIl5LWeJWM254xVs3GhCcMbTUaZNyOCOW7L2R0OQc28tuLKB508ssj13h8Ywa2RNp3JL5NtharfbNzUpTndChEJBHVwhnMjpEFMckb-Cc5iPRtTIRL2v591N2mgjxpf9SI93OOJXEbRqcsbJCtHDCkKXmNIVrfhn_dcqsotM7akUUZRabyGATgG7KlJ5SCaxgE7JbMZ8xty5CPKPcx7qrS1OXesmYvihB6JaZ6BPr9I9n1tH_toSvt0TfUa7KJQ",
      id_migracao: "28817f74-14be-4514-aee0-c9fd84c64433",
    },
    object: { objectId: "27592678952" },
  },
  console.log
);
