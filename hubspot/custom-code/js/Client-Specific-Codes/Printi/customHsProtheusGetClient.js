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

async function getClientOnProtheus(cgc, token) {
  try {
    const url = `${protheusBaseUrl}printi/clientes/${cgc}`;
    const headers = { authorization: `Bearer ${token}` };

    const client = await axios({ url, method: "GET", headers });

    return client.data;
  } catch (error) {
    console.log("Erro na busca de um Cliente", error);

    throw new Error(error.message);
  }
}

exports.main = async (event, callback) => {
  const { inputFields } = event;
  console.log(inputFields);

  const { access_token } = await protheusAuth();

  console.log("Cliente a ser encontrado: ", inputFields.a1_cgc);

  try {
    console.log("Buscando cliente.");
    const client = await getClientOnProtheus(inputFields.a1_cgc, access_token);

    console.log("Cliente encontrado:", client);

    const clientFound = client.items.length > 0;

    callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        clientFound,
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
      a1_cgc: "37770370019",
    },
    object: { objectId: 285498429539 },
  },
  console.log
);
