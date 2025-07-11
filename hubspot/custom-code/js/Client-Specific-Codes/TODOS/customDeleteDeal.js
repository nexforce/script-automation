const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");

async function deleteDealBy(id) {
  const token = process.env.NX_OPERATIONS;
  const url = `https://api.hubapi.com/crm/v3/objects/deals/${id}`;

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({ method: "DELETE", url, headers });

    return response.data;
  } catch (error) {
    console.error("Error deleting deal.", error.message);
    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

exports.main = async (event, callback) => {
  const { objectId } = event.object;
  try {
    console.log("Deleting deal...");
    await deleteDealBy(objectId);
    console.log(`Deal deleted. Id: ${objectId}`);

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
    inputFields: {},
    object: { objectId: "39221664400" },
  },
  console.log
);
