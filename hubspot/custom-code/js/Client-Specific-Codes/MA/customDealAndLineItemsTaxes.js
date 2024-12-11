const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]

const axios = require("axios").default;

function operationMapper(operationType) {
  const operationMapperObj = {
    "Venda Representada": "R",
    "Cobrança de Locação": "22",
    "Remessa para Locação": "18",
    "Remessa de mercadoria para exposição ou feira": "10",
    "Remessa bonificação, doação ou brinde": "08",
    "Venda de Mercadoria": "01",
    "Remessa em Comodato": "06",
    "Remessa em Mostruário": "11",
    "Remessa para Demonstração": "05",
    "Remessa de Amostra Grátis": "09",
  };

  return operationMapperObj[operationType];
}

async function getTaxesFromProtheus(body, protheusToken) {
  try {
    const response = await axios.post(
      `${process.env.PROTHEUS_URI}/psintegra/ImpostosSaida`,
      body,
      {
        headers: {
          Authorization: `Bearer ${protheusToken}`,
        },
      }
    );

    return response;
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      if (error.code === "ETIMEDOUT") {
        const err = {
          message: `IP não liberado no Protheus: ${JSON.stringify(
            (await axios.get("https://myip.wtf/json")).data
          )}`,
        };

        throw err;
      } else if (error.response?.status == 500) {
        error.response.status = 400;
        error.status = 400;
        const errorMessage =
          error.response.data.meta.errors[0].message[0] ||
          "Erro desconhecido no Protheus.";

        console.error(errorMessage);

        throw new Error(errorMessage);
      } else {
        console.error("Erro na chamada axios: ", JSON.stringify(error.message));
        throw error;
      }
    }

    console.error(
      `Erro ao criar cliente no Protheus: ${JSON.stringify(error.message)}`
    );

    throw error;
  }
}

exports.main = async (event, callback) => {
  const { protheusToken } = event.inputFields;

  let lineItemMapper = [];
  const body = {
    cenarios: JSON.parse(event.inputFields.lineItems).map((lineItem) => {
      lineItemMapper.push({
        id: lineItem.id,
        hs_sku: lineItem.properties.hs_sku,
      });

      return {
        ItemPrd: lineItem.properties.hs_sku,
        CodCli: event.inputFields.c5_cliente,
        LojCli: event.inputFields.c5_lojacli,
        CodPrd: lineItem.properties.b1_cod,
        TipOpe: operationMapper(event.inputFields.c6_oper),
        QtdSai: +lineItem.properties.quantity,
        PrcSai: Number.parseFloat(lineItem.properties.amount),
        CodFil: event.inputFields.c5_filial,
      };
    }),
  };

  try {
    const taxesFromProtheus = await getTaxesFromProtheus(body, protheusToken);
    console.log("taxesFromProtheus", taxesFromProtheus.data.objects);

    const infosToUpdateProducts = taxesFromProtheus.data.objects.map((tax) => {
      const lineItem = lineItemMapper.find((li) => li.hs_sku === tax.Produto);
      if (lineItem) {
        return {
          product_code: lineItem.id,
          ipi_valor: tax.IPI_Valor,
          flag_status_imposto: tax.Mensagem,
        };
      }
    });

    return await callback({
      outputFields: {
        infos_to_products: JSON.stringify(infosToUpdateProducts),
      },
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
      c5_cliente: "276387",
      c5_lojacli: "0001",
      c6_oper: "Venda de Mercadoria",
      lineItems:
        '[{"createdAt":"2024-10-23T19:40:00.745Z","archived":false,"id":"24331553976","properties":{"amount":"360.00", "c6_oper":"Venda de Mercadoria", "createdate":"2024-10-23T19:40:00.745Z","discount":null,"hs_discount_percentage":null,"hs_lastmodifieddate":"2024-10-23T19:40:00.745Z","hs_object_id":"24331553976","hs_product_id":"3401669434","hs_sku":"5.000.00565", "b1_cod":"5.000.00565","name":"CIRCUITO PACIENTE DESCARTAVEL T5 TESTE","price":"360","quantity":"1"},"updatedAt":"2024-10-23T19:40:00.745Z"},{"createdAt":"2024-10-23T19:40:00.745Z","archived":false,"id":"24331554048","properties":{"amount":"95.00","c6_oper":"Venda de Mercadoria", "createdate":"2024-10-23T19:40:00.745Z","discount":null,"hs_discount_percentage":null,"hs_lastmodifieddate":"2024-10-23T19:40:00.745Z","hs_object_id":"24331554048","hs_product_id":"3392199427","hs_sku":"GEN-243L", "b1_cod":"GEN-243L","name":"MANTA FILTEREDFLO ADULTO CORPO INTEIRO 233,7X127CM","price":"95","quantity":"1"},"updatedAt":"2024-10-23T19:40:00.745Z"},{"createdAt":"2024-10-23T19:40:00.745Z","archived":false,"id":"24331553975","properties":{"amount":"4620.00","c6_oper":"Venda de Mercadoria", "createdate":"2024-10-23T19:40:00.745Z","discount":null,"hs_discount_percentage":null,"hs_lastmodifieddate":"2024-10-23T19:40:00.745Z","hs_object_id":"24331553975","hs_product_id":"3395879568","hs_sku":"1.108.00033","b1_cod":"1.108.00033","name":"TELA LCD TOUCHSCREEN PARA VENTILADOR T6","price":"924","quantity":"5"},"updatedAt":"2024-10-23T19:40:00.745Z"},{"createdAt":"2024-10-23T19:40:00.745Z","archived":false,"id":"24331553977","properties":{"amount":"105.80","c6_oper":"Venda de Mercadoria", "createdate":"2024-10-23T19:40:00.745Z","discount":null,"hs_discount_percentage":null,"hs_lastmodifieddate":"2024-10-23T19:40:00.745Z","hs_object_id":"24331553977","hs_product_id":"3387750941","hs_sku":"CON-130309A-L", "b1_cod":"CON-130309A-L","name":"CANETA ELETROCIRURGICA COM CONTROLE DE MAO","price":"52.9","quantity":"2"},"updatedAt":"2024-10-23T19:40:00.745Z"}]',
      protheusToken:
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InBKd3RQdWJsaWNLZXlGb3IyNTYifQ.eyJpc3MiOiJUT1RWUy1BRFZQTC1GV0pXVCIsInN1YiI6Imh1YnNwb3QuaW50ZWdyYWNhbyIsImlhdCI6MTczMDI5NzE3NSwidXNlcmlkIjoiMDAwNjU3IiwiZXhwIjoxNzMwMzAwNzc1LCJlbnZJZCI6IlBST1RIRVVTX0hNTCJ9.lffXryhbgcAg_tnkZhlIJu_cXEbjYBPlNuHKId-c3NAhMrKyDEeswwVCEZwTkBDueTQKc3KhVkF-icbglJ2uXCCCZLe8hTY8qNITeQEbRCIN_AEjnlet8ov2fDF2MfmV3o8bOgsKCOEU679VulzAXPRHQBkMfRRyk2q3LYa1ZnJxtZLXRfVDS_0lPNByFSDTa6GfNaD7L7wUV6udWifOyHy7Wwlf2kpy-dlp1gpLf1-lk8maaVMEw9pu0zmLliUTmN9ZDCJuyPiv-YE_vvZklJPWDBoTiPs8Ne3CKLHkWfMjLGoOcxqFKiHkobgS9459YuIQStEjCW3xMIUPJUA4wg",
    },
    object: { objectId: "" },
  },
  console.log
);
