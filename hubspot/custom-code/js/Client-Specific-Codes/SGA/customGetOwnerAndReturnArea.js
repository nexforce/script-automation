const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");
const baseUrl = "https://api.hubapi.com/";
const token = process.env.CHATBOT_SGA_TOKEN;

async function searchUserBy(id) {
  try {
    const url = `${baseUrl}crm/v3/objects/users/search`;

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const payload = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "hubspot_owner_id",
              operator: "EQ",
              value: id,
            },
          ],
        },
      ],
      properties: [
        "hs_internal_user_id",
        "hs_given_name",
        "hs_availability_status",
        "hs_email",
        "hubspot_owner_id",
      ],
    };

    const response = await axios({
      url,
      method: "POST",
      data: payload,
      headers,
    });

    return response.data;
  } catch (error) {
    console.log("Error searching user.");
    throw error;
  }
}

function emailAreaMapper(email) {
  const mapper = {
    "crm_mobilidade@sgaseguros.com.br": "Mobilidade",
    "crm_demaisramos@sgaseguros.com.br": "Demais ramos",
    "crm_pessoas@sgaseguros.com.br": "Pessoas",
    "crm_consorcio@sgaseguros.com.br": "Consórcio",
    "crm_chama@sgaseguros.com.br": "Sinistros",
    "crm_ti@sgaseguros.com.br": "T.I.",
    "crm_comissoes@sgaseguros.com.br": "Comissões e repasses",
    "crm_financeiro@sgaseguros.com.br": "Financeiro",
    "crm_cocorretagem@sgaseguros.com.br": "Co-corretagem",
    "crm_chama@sgaseguros.com.br": "Parcelas de clientes",
    "crm_chama@sgaseguros.com.br": "Pendências de proposta",
    "crm_chama@sgaseguros.com.br": "Recusas de propostas",
    "crm_qualidade@sgaseguros.com.br": "Qualidade de dados",
  };

  return mapper[email];
}

exports.main = async (event, callback) => {
  const { hubspot_owner_id } = event.inputFields;
  try {
    const user = await searchUserBy(hubspot_owner_id);

    console.log(user.results[0]);
    if (user.results.length == 0) {
      console.log("Nenhum owner encontrado.");
      return await callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          userId: null,
          areaAtentimentoByOwner: null,
        },
      });
    }
    const userResponse = user.results[0];
    const areaAtentimentoByOwner = emailAreaMapper(
      userResponse.properties.hs_email
    );

    if (!areaAtentimentoByOwner) {
      console.log("Owner para transferência inválido.");
      return await callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          userId: userResponse.id,
          areaAtentimentoByOwner: null,
        },
      });
    }
    console.log("Área selecionada.");
    return await callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        userId: userResponse.id,
        areaAtentimentoByOwner,
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
      hubspot_owner_id: "1600962910",
    },
    object: { objectId: "" },
  },
  console.log
);
