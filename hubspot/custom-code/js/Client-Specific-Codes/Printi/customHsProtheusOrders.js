const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]

const axios = require("axios");

// Protheus informations
const protheusUser = process.env.PROTHEUS_USER;
const protheusPassword = process.env.PROTHEUS_PASSWORD;
const protheusBaseUrl =
  "https://fmimpressos170648.protheus.cloudtotvs.com.br:2007/rest/api/";

// Hubspot informations
const hubspotBaseUrl = "https://api.hubapi.com";
const hubspotDealToken = process.env.HUBSPOT_DEAL_TOKEN;
const dealItemObjectId = "2-22504469";

async function protheusAuth() {
  try {
    const url = `${protheusBaseUrl}oauth2/v1/token?grant_type=password&password=${protheusPassword}&username=${protheusUser}`;

    const accessToken = await axios({ url, method: "POST" });

    return accessToken.data;
  } catch (error) {
    console.log("Erro no login");

    throw new Error(error.response.data.message);
  }
}

async function getDealAssociationsBy(dealId, itemObjectId) {
  try {
    const url = `${hubspotBaseUrl}/crm/v4/objects/deal/${dealId}/associations/${itemObjectId}`;

    const headers = {
      Authorization: `Bearer ${hubspotDealToken}`,
    };

    const dealAssociations = await axios({ url, method: "GET", headers });

    return dealAssociations.data;
  } catch (error) {
    console.log("Erro ao buscar associations.");

    throw new Error(error.message);
  }
}

async function searchDealItemBy(dealItemId, itemObjectId) {
  try {
    const url = `${hubspotBaseUrl}/crm/v3/objects/${itemObjectId}/search`;

    const headers = {
      Authorization: `Bearer ${hubspotDealToken}`,
    };

    const data = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "hs_object_id",
              operator: "EQ",
              value: dealItemId,
            },
          ],
        },
      ],
      properties: [
        "printi_item_id",
        "c6_item",
        "c6_produto",
        "c6_qtdven",
        "c6_prcven",
        "c6_tes",
        "c6_xitemid",
      ],
    };

    const dealItem = await axios({ url, method: "POST", headers, data });

    return dealItem.data;
  } catch (error) {
    console.log("Erro ao buscar um Deal Item.");

    throw new Error(error.message);
  }
}

async function createOrderOnProtheus(data, token) {
  try {
    const url = `${protheusBaseUrl}printi/incluipedidovenda`;
    const headers = { authorization: `Bearer ${token}` };

    const newOrder = await axios({ url, method: "POST", headers, data });

    return newOrder.data;
  } catch (error) {
    console.log("Erro na criação de um Pedido", error);

    throw new Error(error.message);
  }
}

function dealItemsMapper(dealItems) {
  const keysMapper = [
    // "printi_item_id",
    "c6_item",
    "c6_produto",
    "c6_qtdven",
    "c6_prcven",
    "c6_tes",
    "c6_xitemid",
  ];

  let listOfItemsMapped = [];

  for (const item of dealItems) {
    let dealItemMapped = {};
    for (const key of keysMapper) {
      if (item[key]) {
        dealItemMapped = Object.assign(dealItemMapped, {
          [key.toUpperCase()]:
            key == "c6_prcven" || key == "c6_qtdven"
              ? Math.abs(item[key])
              : item[key],
        });
      }
    }

    listOfItemsMapped.push(dealItemMapped);
  }

  return listOfItemsMapped;
}

function booleanTransformFrom(inputKey, inputValue) {
  const inputKeysToValidateBoolean = [];

  if (inputValue === "Não" || inputValue === "Sim") {
    if (inputKeysToValidateBoolean.some((key) => key == inputKey)) {
      return inputValue === "Não" ? "2" : "1";
    } else {
      return inputValue.slice(0, 1);
    }
  }

  return inputValue;
}

exports.main = async (event, callback) => {
  const { inputFields } = event;
  console.log(inputFields);

  const dealAssociations = await getDealAssociationsBy(
    event.object.objectId,
    dealItemObjectId
  );

  let dealItems = [];

  for await (const dealItem of dealAssociations.results) {
    console.log("dealItem.toObjectId,", dealItem.toObjectId);

    const dealItemFound = await searchDealItemBy(
      dealItem.toObjectId,
      dealItemObjectId
    );

    console.log("dealItemFound", dealItemFound.results[0].properties);

    dealItems.push(dealItemFound.results[0].properties);
  }

  let dataToSend = {};

  // formatação das chaves para upper case e de valores booleanos para aceitos no protheus
  for (const key in inputFields) {
    if (inputFields[key]) {
      dataToSend = Object.assign(dataToSend, {
        [key.toUpperCase()]: booleanTransformFrom(
          key.toUpperCase(),
          inputFields[key]
        ),
      });
    }
  }

  dataToSend.Items = dealItemsMapper(dealItems);

  console.log("Pedido a ser criado: ", dataToSend);

  try {
    const { access_token } = await protheusAuth();

    console.log("Criando pedido...");
    const orderCreated = await createOrderOnProtheus(dataToSend, access_token);

    console.log("Pedido criado:", orderCreated);

    callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        order: dataToSend.C5_XNUM,
      },
    });
  } catch (error) {
    callback({
      outputFields: {
        hs_execution_state: "FAIL_CONTINUE",
        order: null,
      },
    });
    throw new Error(error.message);
  }
};

// [FINAL]

exports.main(
  {
    inputFields: {
      c5_cliente: "000207391",
      c5_lojacli: "0092",
      c5_condpag: "001",
      c5_xend: "Rua Arthur de Azevedo Machado",
      c5_xbairro: "Costa Azul",
      c5_xmun: "2927408",
      c5_xest: "BA",
      c5_xcep: "41760-000",
      c5_xmemo: "test message",
      c5_xnum: "999884",
      c5_xagluti: "N",
      c5_vend1: "000001",
      c5_xforma: "BOL",
      c5_xtipo: "1",
    },
    object: { objectId: 21300964610 },
  },
  console.log
);
