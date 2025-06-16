const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");

const unidadeObjectTypeId = "2-44796254";

async function createBatchOfUnidades(inputs) {
  const token = process.env.HOUSI_OBJECT_CREATION_TOKEN;
  try {
    const url = `https://api.hubapi.com/crm/v3/objects/${unidadeObjectTypeId}/batch/create`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({
      method: "POST",
      url,
      data: { inputs },
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("", error.message);
    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

exports.main = async (event, callback) => {
  const {
    nome_do_empreedimento,
    numero_de_unidades_no_predio,
    codigo_do_empreendimento,
    associationCount,
  } = event.inputFields;

  try {
    const loopNumber =
      numero_de_unidades_no_predio - associationCount >= 100
        ? 100
        : numero_de_unidades_no_predio - associationCount;

    let inputs = [];
    for (let i = 0; i < loopNumber; i++) {
      inputs.push({
        properties: {
          identifica__o_da_unidade: `${nome_do_empreedimento} - ${
            associationCount + i + 1
          } - Disponível`,
          codigo_do_empreendimento,
        },
        associations: [
          {
            types: [
              {
                associationCategory: "USER_DEFINED",
                associationTypeId: 165,
              },
            ],
            to: {
              id: event.object.objectId,
            },
          },
        ],
      });
    }

    console.log(`Creating ${inputs.length} unidades...`);

    const unidades = await createBatchOfUnidades(inputs);

    console.log(`Success: Created ${unidades.results.length} unidades.`);

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
      nome_do_empreedimento: "Housi Vila Madalena",
      numero_de_unidades_no_predio: 6,
      codigo_do_empreendimento: 123321,
      associationCount: 2,
    },
    object: { objectId: "29582833163" },
  },
  console.log
);
