const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]

const axios = require("axios");
const adminUser = process.env.ADMIN_USER;
const adminPassword = process.env.ADMIN_PASSWORD;
const printiBaseUrl = "https://hmg-admin.printi.com.br/";

async function adminAuth() {
  try {
    const url = `${printiBaseUrl}auth/jwt`;
    const data = {
      email: adminUser,
      password: adminPassword,
    };
    const headers = { "Content-Type": "application/json" };

    const accessToken = await axios({ url, method: "POST", headers, data });

    return accessToken.data;
  } catch (error) {
    console.log(error);
    console.log("Erro no login");

    throw new Error(error.response.data.message);
  }
}

exports.main = async (event, callback) => {
  const { inputFields } = event;
  console.log(inputFields);

  const token = await adminAuth();

  try {
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
      c6_nota: "",
    },
    object: { objectId: 285498429539 },
  },
  console.log
);
