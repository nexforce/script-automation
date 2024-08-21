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

async function createCustomerOnAdmin(data, token) {
  try {
    const url = `${printiBaseUrl}external/v1/customer`;
    const headers = { token, "Content-Type": "application/json" };

    const newCustomer = await axios({ url, method: "POST", headers, data });

    return newCustomer.data;
  } catch (error) {
    console.log(error);

    throw new Error(
      `Erro na criação de um customer causado por: ${error.response.data.message}`
    );
  }
}

function hubspotAdminPropertiesMapper(data) {
  const properties = {
    locale: "BR",
    first_name: data.firstname,
    last_name: data.lastname,
    email: data.email,
    phone: data.phone,
    type: "PF",
    cpf: data.a1_cgc,
    service_type: "COMMERCIAL",
    birthdate: data.birthdate,
    state_registration: data.zip,
  };

  return properties;
}

exports.main = async (event, callback) => {
  const { inputFields } = event;

  try {
    console.log("Fazendo login...");
    const token = await adminAuth();

    console.log("Formatando propriedades...");
    const payload = {
      hubspot_contact_id: event.object.objectId,
      properties: hubspotAdminPropertiesMapper(inputFields),
    };

    console.log("Enviando ao Admin: ", payload);
    const response = await createCustomerOnAdmin(payload, token);

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
