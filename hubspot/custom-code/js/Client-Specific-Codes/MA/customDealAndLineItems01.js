const hubspot = require("@hubspot/api-client");

exports.main = async (event, callback) => {
  const client = new hubspot.Client({
    accessToken: process.env.APP_TOKEN,
  });

  try {
    const response = await client.crm.associations.batchApi.read("0-3", "0-8", {
      inputs: [
        {
          id: event.object.objectId,
        },
      ],
    });

    if (response.results.length === 0) {
      throw {
        message: `Nenhum line item encontrado para o deal ${event.object.objectId}`,
      };
    }

    return await callback({
      outputFields: {
        lineItemsIds: JSON.stringify(response.results[0].to.map((to) => to.id)),
      },
    });
  } catch (error) {
    console.error(
      `Erro ao buscar os IDs dos line items do deal na HubSpot: ${JSON.stringify(
        error
      )}`
    );

    throw error;
  }
};
