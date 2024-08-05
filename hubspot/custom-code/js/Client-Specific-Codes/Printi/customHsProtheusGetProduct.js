const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]

const axios = require("axios");
const protheusUser = process.env.PROTHEUS_USER;
const protheusPassword = process.env.PROTHEUS_PASSWORD;
const protheusBaseUrl =
  "https://fmimpressos170648.protheus.cloudtotvs.com.br:2007/rest/api/";

async function protheusAuth() {
  try {
    const url = `${protheusBaseUrl}oauth2/v1/token?grant_type=password&password=${protheusPassword}&username=${protheusUser}`;

    const accessToken = await axios({ url, method: "POST" });

    return accessToken.data;
  } catch (error) {
    console.log("Erro no login");

    throw new Error(error.response.data.message);
  }
}

async function getProductOnProtheus(cod, token) {
  try {
    const url = `${protheusBaseUrl}printi/produtos/${cod}`;
    const headers = { authorization: `Bearer ${token}` };

    const client = await axios({ url, method: "GET", headers });

    return client.data;
  } catch (error) {
    console.log("Erro na busca de um Produto", error);

    throw new Error(error.message);
  }
}

exports.main = async (event, callback) => {
  const { inputFields } = event;
  console.log(inputFields);

  const { access_token } = await protheusAuth();

  console.log("Produto a ser encontrado: ", inputFields.b1_cod);

  try {
    console.log("Buscando produto.");
    const product = await getProductOnProtheus(
      inputFields.b1_cod,
      access_token
    );

    console.log("Produto encontrado:", product);

    const productFound = product.items.length > 0;

    callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        productFound,
      },
    });
  } catch (error) {
    callback({
      outputFields: {
        hs_execution_state: "FAIL_CONTINUE",
      },
    });
    throw new Error(error.message);
  }
};

// [FINAL]

exports.main(
  {
    inputFields: {
      b1_cod: "NXTEST123",
    },
    object: { objectId: 285498429539 },
  },
  console.log
);
