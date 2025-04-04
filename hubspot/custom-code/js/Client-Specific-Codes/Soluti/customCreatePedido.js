const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]

const axios = require("axios");
const token = process.env.NX_PEDIDO_TOKEN;
const baseUrl = "https://api.hubapi.com";
const pedidoObjectId = "2-42893283";

async function createPedidoBatch(data) {
  try {
    const url = `${baseUrl}/crm/v3/objects/${pedidoObjectId}/batch/create`;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({ url, method: "POST", headers, data });

    return response.data;
  } catch (error) {
    console.error("Error creating Pedidos.", error.message);
    console.log(error);
    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

function calculateNumberOfPayments(frequency, contractDurationInMonths) {
  let intervalInMonths;

  switch (frequency) {
    case "monthly":
      intervalInMonths = 1;
      break;
    case "quarterly":
      intervalInMonths = 3;
      break;
    case "per_six_months":
      intervalInMonths = 6;
      break;
    case "annually":
      intervalInMonths = 12;
      break;
    case "per_two_years":
      intervalInMonths = 24;
      break;
    case "per_three_years":
      intervalInMonths = 36;
      break;
    case "per_four_years":
      intervalInMonths = 48;
      break;
    case "per_five_years":
      intervalInMonths = 60;
      break;
    default:
      throw new Error("Invalid payment frequency");
  }

  return Math.floor(contractDurationInMonths / intervalInMonths);
}

function setRecurring(recurringBillingPeriod) {
  if (recurringBillingPeriod[recurringBillingPeriod.length - 1] === "M") {
    return recurringBillingPeriod.replace(/[^\d]/g, "");
  }

  return 1;
}

function mapItemToPedido(item, index) {
  const frequencyMapper = {
    weekly: "Semanalmente",
    biweekly: "Quinzenalmente",
    monthly: "Mensalmente",
    quarterly: "Trimestralmente",
    per_six_months: "Semestralmente",
    annually: "Anualmente",
    per_two_years: "A cada dois anos",
    per_three_years: "A cada três anos",
    per_four_years: "A cada quatro anos",
    per_five_years: "A cada cinco anos",
  };

  return {
    pedido: `${item.name} - ${index + 1}` || "",
    quantidade: item.quantity || "",
    preco_unitario: item.price || "",
    desconto_unitario: item.hs_total_discount || "",
    preco_liquido: item.amount || "",
    frequencia_de_cobranca:
      frequencyMapper[item.recurringbillingfrequency] || "",
    prazo: setRecurring(item.hs_recurring_billing_period) || "",
    cobranca_unica_parcelada_: item.cobranca_unica_parcelada || "",
    numero_de_parcelas: item.numero_de_parcelas || "",
  };
}

exports.main = async (event, callback) => {
  const { objectId } = event.object;
  const refinedLineItems = JSON.parse(event.inputFields.refinedLineItems);

  const associations = [
    {
      types: [
        {
          associationCategory: "USER_DEFINED",
          associationTypeId: 354,
        },
      ],
      to: {
        id: objectId,
      },
    },
  ];

  try {
    let inputs = [];

    refinedLineItems.forEach((item) => {
      const numberOfPayments = calculateNumberOfPayments(
        item.recurringbillingfrequency,
        item.hs_recurring_billing_period.replace(/[^\d]/g, "")
      );

      for (let i = 0; i < numberOfPayments; i++) {
        const body = {
          properties: { ...mapItemToPedido(item, i) },
          associations,
        };

        inputs.push(body);
      }
    });

    console.log(`${inputs.length} pedidos serão criados`);

    console.log("Criando pedidos...");
    await createPedidoBatch({ inputs });
    console.log("Pedidos criados com sucesso!");
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
      refinedLineItems: JSON.stringify([
        {
          amount: "190.00",
          cobranca_unica_parcelada: "false",
          hs_object_id: "31184816929",
          hs_recurring_billing_period: "P5M",
          hs_total_discount: "10.00",
          name: "Test line item",
          numero_de_parcelas: "2",
          price: "100",
          quantity: "2",
          recurringbillingfrequency: "monthly",
        },
      ]),
    },
    object: { objectId: "35474741932" },
  },
  console.log
);
