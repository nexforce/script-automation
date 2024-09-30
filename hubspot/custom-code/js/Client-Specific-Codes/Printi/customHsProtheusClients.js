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

async function createClientOnProtheus(data, token) {
  try {
    const url = `${protheusBaseUrl}printi/clientes`;
    const headers = { authorization: `Bearer ${token}` };

    const newClient = await axios({ url, method: "POST", headers, data });

    return newClient.data;
  } catch (error) {
    console.log("Erro na criação de um Cliente", error);

    throw new Error(error.message);
  }
}

function booleanTransformFrom(inputKey, inputValue) {
  const inputKeysToValidateBoolean = [
    "A1_RECISS",
    "A1_CONTRIB",
    "A1_RECIRRF",
    "A1_SIMPNAC",
  ];

  if (inputValue === "Não" || inputValue === "Sim") {
    if (inputKeysToValidateBoolean.some((key) => key == inputKey)) {
      return inputValue === "Não" ? "2" : "1";
    } else {
      return inputValue.slice(0, 1);
    }
  }

  return inputValue;
}

exports.main = async (event, callback) => {
  const { inputFields } = event;
  console.log(inputFields);

  const { access_token } = await protheusAuth();

  // códigos padronizados para Brasil e formatação de nome fantasia

  let dataToSend = {
    A1_PAIS: "105",
    A1_CODPAIS: "01058",
    A1_NREDUZ:
      "nome_fantasia__c" in inputFields
        ? inputFields["nome_fantasia__c"]
        : inputFields["a1_nome"],
  };

  // formatação das chaves para upper case e de valores booleanos para aceitos no protheus
  for (const key in inputFields) {
    if (inputFields[key]) {
      dataToSend = Object.assign(dataToSend, {
        [key.toUpperCase()]: booleanTransformFrom(
          key.toUpperCase(),
          inputFields[key]
        ),
      });
    }
  }

  const data = {
    cliente: [dataToSend],
  };

  console.log("Cliente a ser criado: ", data);

  try {
    console.log("Criando cliente.");
    const clientCreated = await createClientOnProtheus(data, access_token);

    console.log("Cliente criado:", clientCreated);

    callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        client: dataToSend.A1_NOME,
      },
    });
  } catch (error) {
    callback({
      outputFields: {
        hs_execution_state: "FAIL_CONTINUE",
        client: null,
      },
    });
    throw new Error(error.message);
  }
};

// [FINAL]

exports.main(
  {
    inputFields: {
      nome_fantasia__c: "",
      a1_cgc: "37770370019",
      a1_pais: "105",
      a1_codpais: "01058",
      a1_nome: "Luiz Felipe",
      a1_bairro_ent: "Doutor Sílvio Leite",
      a1_end: "RUA CORDELINA SILVEIRA MATOS 11",
      a1_tipo: "F",
      a1_cod_mun: "06200",
      a1_end_ent: "RUA CORDELINA SILVEIRA MATOS 11",
      a1_pessoa: "F",
      a1_bairro: "Doutor Sílvio Leite",
      a1_estado: "MG",
      a1_nreduz: "Luiz Felipe",
      a1_estado_ent: "MG",
      a1_est: "MG",
      a1_cond: "007",
      a1_cep: "69314306",
      a1_cod_mun_ent: "06200",
      a1_cep_ent: "69314306",
      a1_est_ent: "MG",
      a1_contrib: "1",
    },
    object: { objectId: 285498429539 },
  },
  console.log
);
