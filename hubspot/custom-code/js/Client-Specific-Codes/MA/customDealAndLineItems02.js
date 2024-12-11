const hubspot = require("@hubspot/api-client");

exports.main = async (event, callback) => {
  const client = new hubspot.Client({
    accessToken: process.env.APP_TOKEN,
  });

  try {
    const response = await client.crm.lineItems.batchApi.read({
      inputs: JSON.parse(event.inputFields.lineItemsIds).map((id) => ({ id })),
      properties: [
        "quantity",
        "amount",
        "discount",
        "name",
        "hs_sku",
        "hs_product_id",
        "price",
        "hs_discount_percentage",
        "b1_cod",
      ],
    });

    return await callback({
      outputFields: {
        lineItems: JSON.stringify(response.results),
      },
    });
  } catch (error) {
    console.error(
      `Erro ao obter informações sobre os line items do deal na HubSpot: ${JSON.stringify(
        error
      )}`
    );

    throw error;
  }
};
