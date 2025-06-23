const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");

async function getAssociatedLineItems(id) {
  const token = process.env.HOUSI_OBJECT_CREATION_TOKEN;
  const url = `https://api.hubapi.com/crm/v4/objects/deals/${id}/associations/line_items`;
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios({ method: "GET", url, headers });

    return response.data;
  } catch (error) {
    console.error("Error finding line items: ", error.message);
    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

exports.main = async (event, callback) => {
  const { objectId } = event.object;

  try {
    const lineItems = await getAssociatedLineItems(objectId);

    if (!lineItems || !lineItems.results || lineItems.results.length === 0) {
      console.error("No line items found for the given deal.");
      throw new Error("No line items found for the given deal.");
    }

    const lineItemIds = lineItems.results.map((item) => item.toObjectId);
    return await callback({
      outputFields: {
        lineItemIds: JSON.stringify(lineItemIds),
      },
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
    object: { objectId: "38814052681" },
  },
  console.log
);
