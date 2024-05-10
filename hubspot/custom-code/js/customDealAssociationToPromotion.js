const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const axios = require("axios");

const DEAL_OBJECT_TYPE_ID = "0-3";
const PLATFORMS_OBJECT_TYPE_ID = "2-23645786"; // Defina o ID do objeto "Plataformas" conforme necessário
const token = process.env.CodigoPersonalizadoDeAssociacaoPlataforma;

async function searchPlatformByName(platformName) {
  try {
    const url = `https://api.hubapi.com/crm/v3/objects/${PLATFORMS_OBJECT_TYPE_ID}/search`;
    const headers = {
      authorization: `Bearer ${token}`,
    };

    const data = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "nome_da_plataforma",
              operator: "EQ",
              value: platformName,
            },
          ],
        },
      ],
    };

    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.log("Erro ao buscar uma plataforma:", error.message);
    throw error;
  }
}

exports.main = async (event, callback) => {
  const { inputFields, object } = event;
  const platformName = inputFields["nome_da_plataforma"];

  try {
    if (!platformName) {
      throw new Error("Nome da plataforma não especificado nos inputs.");
    }

    // Buscar a plataforma pelo nome
    const platformResult = await searchPlatformByName(platformName);

    // Verifica se a plataforma foi encontrada com sucesso
    if (!platformResult || platformResult.total !== 1) {
      throw new Error(
        "Nenhuma plataforma encontrada ou múltiplos resultados encontrados."
      );
    }

    // Se chegou até aqui sem erros, prosseguir com a criação da associação
    const platformId = platformResult.results[0]?.id;
    const dealId = object.objectId;

    const hubspotClient = new hubspot.Client({ accessToken: token });

    // Criar associação entre o negócio (deal) e a plataforma
    const associationInput = {
      inputs: [
        {
          _from: { id: dealId },
          to: { id: platformId },
        },
      ],
    };

    const apiResponse =
      await hubspotClient.crm.associations.v4.batchApi.createDefault(
        DEAL_OBJECT_TYPE_ID,
        PLATFORMS_OBJECT_TYPE_ID,
        associationInput
      );

    console.log("Associação criada:", apiResponse);

    // Se a associação foi criada com sucesso, registrar o resultado
    await callback({
      outputFields: { hs_execution_state: "SUCCESS", objectId: dealId },
    });
  } catch (error) {
    console.error("Erro durante o processo:", error);

    // Se ocorreu um erro, registrar o erro e sinalizar falha no callback
    await callback({
      outputFields: {
        hs_execution_state: "FAIL_CONTINUE",
        error_message: error.message,
      },
    });

    // Não lançar o erro novamente aqui para evitar interrupção do workflow
    // Se desejar parar o workflow em caso de erro, pode lançar o erro novamente aqui
  }
};
// [FINAL]

exports.main(
  {
    inputFields: {},
    object: { objectId: 666244651 },
  },
  console.log
);
