const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]

const axios = require("axios");
const token = process.env.NX_PEDIDO_TOKEN;
const baseUrl = "https://api.hubapi.com";

async function getDealsLineItemsAssociationsIds(dealId) {
  try {
    const url = `${baseUrl}/crm/v4/objects/deals/${dealId}/associations/line_items`;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({ url, method: "GET", headers });

    return response.data;
  } catch (error) {
    console.error("Error getting associations with deals", error.message);
    console.log(error);
    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

exports.main = async (event, callback) => {
  const { objectId } = event.object;

  try {
    const lineItems = await getDealsLineItemsAssociationsIds(objectId);

    if (lineItems.results.length === 0) {
      throw new Error("No line item associated with Deal");
    }

    const lineItemsIds = JSON.stringify(
      lineItems.results.map((item) => item.toObjectId)
    );

    return await callback({
      outputFields: { lineItemsIds },
    });
  } catch (err) {
    console.error(err);
    console.error(err.message);
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
    object: { objectId: "35474741932" },
  },
  console.log
);
