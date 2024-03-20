const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]

const axios = require("axios");

const accessToken = process.env.Nexforce;
const baseUrl = "https://api.hubapi.com/";

async function getCart(data) {
  try {
    const url = `${baseUrl}crm/v3/objects/2-9619725/search`;
    const headers = { authorization: `Bearer ${accessToken}` };

    const cart = await axios({ url, method: "post", headers, data });

    return cart.data;
  } catch (err) {
    console.log("Erro identificado durante busca pelo carrinho:", err);
    throw err;
  }
}

async function createAssociationDealCart(dealId, cartId) {
  try {
    const url = `${baseUrl}crm/v3/objects/deal/${dealId}/associations/2-9619725/${cartId}/39`;
    const headers = {
      authorization: `Bearer ${accessToken}`,
      ["Content-Type"]: "application/json;charset=utf-8",
    };

    const cart = await axios({ url, method: "put", headers, data: {} });

    return cart.data;
  } catch (err) {
    console.log("Erro identificado durante associação:", err.data);
    throw err;
  }
}

exports.main = async (event, callback) => {
  // Verifica se o evento gatilho está relacionado a propriedade "Carrinho ID" do Negócio
  if (event.object.objectType === "DEAL" && event.inputFields["carrinho_id"]) {
    const cartId = event.inputFields["carrinho_id"];

    try {
      // Step 1: Registra o que estamos pesquisando no objeto Carrinho
      console.log(
        `Pesquisando por registros no objeto Carrinho que contenham o carrinho_id: ${cartId}`
      );

      const data = {
        filterGroups: [
          {
            filters: [
              {
                propertyName: "carrinho_id",
                operator: "EQ",
                value: cartId,
              },
            ],
          },
        ],
        properties: ["nome_carrinho"],
      };

      // Step 2: Utiliza a API de Search para pesquisar no objeto Carrinho um registro relacionado
      const cartRecords = await getCart(data);

      // Verifica se foi encontrado registro correspondente
      if (cartRecords.total > 0) {
        const cart = cartRecords.results[0];
        const cartName = cart.properties.nome_carrinho;

        // Step 3: Registra o que foi encontrado
        console.log(
          `Encontrado registro no objeto Carrinho com o nome: ${cartName}. Associando com o Negócio...`
        );

        // Step 4: Associa o Negócio com o id do Carrinho encontrado
        await createAssociationDealCart(event.object.objectId, cart.id);

        // Step 5: Registra que a associação foi concluída
        console.log(`Negócio associado ao Carrinho: ${cartName} com sucesso!`);

        // Step 6: Retorna o dado do carrinho associado para uso futuro no workflow
        callback({
          outputFields: {
            associatedCarrinho: cartName,
          },
        });
      } else {
        // Step 7: Registra que nenhum registro foi localizado no objeto Carrinho
        console.log(
          `Não foram encontrados registros no objeto Carrinho com o nome: ${cartId}`
        );
        callback(); // No further action needed
      }
    } catch (error) {
      // Lida com erros e registra eles
      console.error("Erro identificado durante associação:", error);
      throw error;
    }
  } else {
    // Registra que o evento não atende os critérios de gatilho
    console.log("Evento não atende aos gatilhos, nada foi realizado.");
    callback();
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
