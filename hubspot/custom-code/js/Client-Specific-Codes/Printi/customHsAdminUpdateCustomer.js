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

    throw new Error(
      `Erro no login causado por: ${error.response.data.message}`
    );
  }
}

async function updateCustomerOnAdminBy(id, data, token) {
  try {
    const url = `${printiBaseUrl}external/v1/customer/${id}`;
    const headers = { token, "Content-Type": "application/json" };

    const customerUpdated = await axios({
      url,
      method: "PATCH",
      headers,
      data,
    });

    return customerUpdated.data;
  } catch (error) {
    console.log(error);

    throw new Error(
      `Erro na atualização de um customer causado por: ${error.response.data.message}`
    );
  }
}

function hubspotAdminPropertiesMapper(data) {
  return {
    first_name: data.firstname,
    last_name: data.lastname,
    email: data.email,
    phone: data.phone,
    cpf: data.a1_cgc,
    birthdate: data.birthdate,
    state_registration: data.zip,
  };
}

exports.main = async (event, callback) => {
  const { inputFields } = event;

  try {
    console.log("Fazendo login...");
    const token = await adminAuth();

    console.log("Formatando propriedades...");
    const payload = hubspotAdminPropertiesMapper(inputFields);

    console.log(payload);

    console.log("Enviando ao Admin: ", payload);
    const response = await updateCustomerOnAdminBy(
      event.object.objectId,
      payload,
      token
    );

    return callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        objectId: event.object.objectId,
        message: response.message,
      },
    });
  } catch (error) {
    callback({
      outputFields: {
        hs_execution_state: "FAIL_CONTINUE",
        objectId: event.object.objectId,
        message: "FAILED",
      },
    });
    throw new Error(error.message);
  }
};

// [FINAL]

exports.main(
  {
    inputFields: {
      firstname: "Luiz Felipe",
      lastname: "NX Test 1",
      email: "lfnxtest1@gmail.com",
      phone: "999999991",
      a1_cgc: "161.152.340-00",
      birthdate: "1990-03-12",
      zip: "79020001",
    },
    object: { objectId: 285498429539 },
  },
  console.log
);