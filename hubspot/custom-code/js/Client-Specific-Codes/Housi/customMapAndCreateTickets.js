const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");

const token = process.env.HOUSI_OBJECT_CREATION_TOKEN;

async function getLineItemsInformations(ids) {
  const url = "https://api.hubapi.com/crm/v3/objects/line_items/search";
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
    console.error("Error getting line item informations: ", error.message);
    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

async function createBatchTickets(payload) {
  const url = "https://api.hubapi.com/crm/v3/objects/tickets/batch/create";
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await axios({
      method: "POST",
      url,
      headers,
      data: payload,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating tickets: ", error.message);
    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

function ticketsPayloadFormatter(deal, lineItems) {
  const dealInfosToTickets = {
    nome_do_cliente: deal.nome_completo,
    email: deal.email,
    numero_de_telefone_do_whatsapp: deal.numero_de_telefone_do_whatsapp,
    cpf: deal.cpf,
    cnpj: deal.cnpj,
    empreendimento: deal.empreendimento,
    unidade: deal.numero_da_unidade,
    cidade_estado: deal.cidade_estado,
    brazil_state_list: deal.brazil_state_list,
    regiao: deal.regional,
    endereco_completo_do_empreendimento: deal.endereco___rua__numero_,
    proprietario_da_venda: deal.hubspot_owner_id,
  };

  return {
    inputs: lineItems.map((lineItem) => {
      const { properties: lineItemProperties } = lineItem;
      return {
        properties: {
          ...dealInfosToTickets,
          subject: deal.dealname + " - " + lineItemProperties.name,
          sku: lineItemProperties.hs_sku,
          tipo_de_produto: lineItemProperties.tipo_de_produto,
          categoria: lineItemProperties.categoria,
          descricao: lineItemProperties.description,
          dimensoes: lineItemProperties.dimensoes,
          preco: lineItemProperties.price,
          quantidade: lineItemProperties.quantity,
          hs_pipeline_stage: "1089057567",
        },
        associations: [
          {
            types: [
              {
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: 28,
              },
            ],
            to: {
              id: deal.objectId,
            },
          },
        ],
      };
    }),
  };
}

exports.main = async (event, callback) => {
  const { lineItemIds, ...rest } = event.inputFields;
  const { objectId } = event.object;

  const lineItemsInfos = await getLineItemsInformations(
    JSON.parse(lineItemIds)
  );

  if (
    !lineItemsInfos ||
    !lineItemsInfos.results ||
    lineItemsInfos.results.length === 0
  ) {
    console.error("No line items found for the given IDs.");
    throw new Error("No line items found for the given IDs.");
  }

  const ticketsPayload = ticketsPayloadFormatter(
    Object.assign(rest, { objectId }),
    lineItemsInfos.results
  );

  console.log("Tickets payload:", ticketsPayload.inputs);

  console.log(`Creating ${ticketsPayload.inputs.length} tickets...`);
  const response = await createBatchTickets(ticketsPayload);
  console.log(`Total tickets created: ${response.results.length}`);

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
      dealname: "LF testes",
      nome_completo: "Nome",
      email: "lf@teste.com",
      numero_de_telefone_do_whatsapp: "+5511999999999",
      cpf: 12345678901,
      cnpj: 12345678000195,
      empreendimento: "+55 STUDIOS",
      numero_da_unidade: 12,
      cidade_estado: "São Paulo - SP",
      brazil_state_list: "São Paulo",
      regional: "Sudeste",
      endereco___rua__numero_: "Rua Teste, 123",
      hubspot_owner_id: "696073723",
      lineItemIds: "[34505270453,34505270454,34505270455]",
    },
    object: { objectId: "38814052681" },
  },
  console.log
);
