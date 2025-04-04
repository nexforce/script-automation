const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]

const axios = require("axios");
const token = process.env.NX_PEDIDO_TOKEN;
const baseUrl = "https://api.hubapi.com";

async function getLineItemsInformations(lineItemsIds) {
  try {
    const url = `${baseUrl}/crm/v3/objects/line_items/search`;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const data = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "hs_object_id",
              operator: "IN",
              values: lineItemsIds,
            },
          ],
        },
      ],
      properties: [
        "quantity",
        "price",
        "hs_total_discount",
        "amount",
        "recurringbillingfrequency",
        "hs_recurring_billing_end_date",
        "cobranca_unica_parcelada",
        "numero_de_parcelas",
      ],
    };

    const response = await axios({ url, method: "POST", headers, data });

    return response.data;
  } catch (error) {
    console.error("Error getting line items informations", error.message);
    console.log(error);
    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

exports.main = async (event, callback) => {
  const lineItemsIds = JSON.parse(event.inputFields.lineItemsIds);

  try {
    const lineItemsInformations = await getLineItemsInformations(lineItemsIds);

    if (lineItemsInformations.total === 0) {
      throw new Error("No line item found.");
    }

    const refinedLineItems = lineItemsInformations.results.map((item) => {
      const { createdate, hs_lastmodifieddate, hs_object_id, ...rest } =
        item.properties;

      return rest;
    });

    console.log(refinedLineItems);

    return await callback({
      outputFields: { refinedLineItems },
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
    inputFields: {
      lineItemsIds: JSON.stringify([
        31184816929, 31184816930, 31184816931, 31184816932, 31184816933,
        31184818226,
      ]),
    },
    object: { objectId: "" },
  },
  console.log
);
