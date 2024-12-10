const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");

const token = process.env.NX_OPERATIONS;
const baseUrl = "https://api.hubapi.com/crm/v3/objects";
const leadsCounterObjectId = "2-34820973";

async function getLeadCounterBy(id) {
  try {
    const url = `${baseUrl}/${leadsCounterObjectId}/${id}?properties=numero_de_leads_diarios`;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({ method: "GET", url, headers });

    return response.data;
  } catch (error) {
    console.error("Error getting leads counter:", error.message);

    const errorMessage =
      error.response?.data?.message || "Unknown error getting leads counter.";

    throw new Error(errorMessage);
  }
}

async function updateLeadsCounterBy(id, counter) {
  try {
    const url = `${baseUrl}/${leadsCounterObjectId}/${id}`;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const data = {
      properties: {
        numero_de_leads_diarios: counter,
      },
    };

    const response = await axios({ method: "PATCH", url, data, headers });

    return response.data;
  } catch (error) {
    console.error("Error updating leads counter:", error.message);

    const errorMessage =
      error.response?.data?.message || "Unknown error updating leads counter.";

    throw new Error(errorMessage);
  }
}

exports.main = async (event, callback) => {
  try {
    const leadsCounterId = 15898211985;
    const {
      properties: { numero_de_leads_diarios },
    } = await getLeadCounterBy(leadsCounterId);

    console.log("Number of actual leads: ", numero_de_leads_diarios);

    const updatedLeadsCounter = await updateLeadsCounterBy(
      leadsCounterId,
      +numero_de_leads_diarios + 1
    );

    console.log("Updated leads counter:", updatedLeadsCounter);

    await callback({
      outputFields: {
        contador: updatedLeadsCounter.properties.numero_de_leads_diarios,
      },
    });
  } catch (err) {
    console.error(err);
    await callback({
      outputFields: {
        hs_execution_state: "FAIL_CONTINUE",
      },
    });
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
    inputFields: {},
    object: { objectId: 13555162237 },
  },
  console.log
);
