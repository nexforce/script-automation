const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");
const baseUrl = "https://api.hubapi.com/";
const token = process.env.NX_SELLER_DEAL_APP_TOKEN;

async function getSellerBy(ownerId) {
  try {
    const url = `${baseUrl}crm/v3/objects/2-34564430/search`;

    const body = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "hubspot_owner_id",
              operator: "EQ",
              value: ownerId,
            },
          ],
        },
      ],
      properties: [
        "hubspot_owner_id",
        "codigo_de_vendedor",
        "filial",
        "nome_do_vendedor",
      ],
    };

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({ url, method: "POST", data: body, headers });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar o owner pelo id", error.message);

    const errorMessage =
      error.response?.data?.message ||
      "Erro desconhecido ao buscar o owner pelo id.";

    throw new Error(errorMessage);
  }
}

exports.main = async (event, callback) => {
  try {
    const { proprietario_de_vendas } = event.inputFields;

    const result = await getSellerBy(proprietario_de_vendas);
    const { total, results } = result;

    const code = total > 0 ? results[0].properties.codigo_de_vendedor : null;
    const subsidiary = total > 0 ? results[0].properties.filial : null;

    return await callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        seller_count: total,
        seller_code: code,
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
      proprietario_de_vendas: "1744054925",
    },
    object: { objectId: "" },
  },
  console.log
);
