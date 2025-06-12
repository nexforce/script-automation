const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");

async function getLineItemsInformations(ids) {
  const url = "https://api.hubapi.com/crm/v3/objects/line_items/search";
  const token = process.env.HOUSI_OBJECT_CREATION_TOKEN;
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
            values: ids,
          },
        ],
      },
    ],
    properties: [
      "hs_sku",
      "tipo_de_produto",
      "categoria",
      "description",
      "dimensoes",
      "price",
      "quantity",
      "name",
    ],
    limit: 200,
  };

  try {
    const response = await axios({ method: "POST", url, headers, data });

    return response.data;
  } catch (error) {
    console.error("", error.message);
    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

function ticketsPayloadFormatter(deal, lineItems) {
  console.log("Deal:", deal);
  const dealInfosToTickets = {};
  console.log("Line Items:", lineItems);
}

exports.main = async (event, callback) => {
  const { lineItemsIds, ...rest } = event.inputFields;
  const { objectId } = event.object;

  const lineItemsInfos = await getLineItemsInformations(
    JSON.parse(lineItemsIds)
  );

  if (
    !lineItemsInfos ||
    !lineItemsInfos.results ||
    lineItemsInfos.results.length === 0
  ) {
    console.error("No line items found for the given IDs.");
    throw new Error("No line items found for the given IDs.");
  }
  console.log("Line items found:", lineItemsInfos.results);

  ticketsPayloadFormatter(
    Object.assign(rest, { objectId }),
    lineItemsInfos.results
  );

  //console.log(`Creating ${lineItemsInfos.results.length} tickets...`);

  try {
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
    inputFields: {
      dealname: "",
      nome_completo: "",
      email: "",
      numero_de_telefone_do_whatsapp: "",
      cpf: "",
      cnpj: "",
      empreendimento: "",
      numero_da_unidade: "",
      cidade_estado: "",
      brazil_state_list: "",
      regional: "",
      endereco___rua__numero_: "",
      hubspot_owner_id: "696073723",
      lineItemsIds: "[28902159693,28902159694,29752093307,29752093308]",
    },
    object: { objectId: "32956209476" },
  },
  console.log
);
