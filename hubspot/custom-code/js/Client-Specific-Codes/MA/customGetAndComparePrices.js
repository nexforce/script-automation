const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]

const axios = require("axios").default;
const baseUrl = "https://api.hubapi.com";
const token = process.env.APP_TOKEN;

async function getLineItemsInfos(lineItemsIds) {
  try {
    const url = `${baseUrl}/crm/v3/objects/line_items/search`;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const body = {
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
        "amount",
        "discount",
        "name",
        "hs_sku",
        "hs_product_id",
        "price",
      ],
    };

    const response = await axios({ url, method: "POST", headers, data: body });

    return response.data;
  } catch (error) {
    console.error("Error getting line items informations");

    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

async function getProductsInfos(productsIds) {
  try {
    const url = `${baseUrl}/crm/v3/objects/products/search`;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const body = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "hs_object_id",
              operator: "IN",
              values: productsIds,
            },
          ],
        },
      ],
      properties: [
        "hs_sku",
        "price",
        "hs_price_brl",
        "hs_price_eur",
        "hs_price_nio",
        "hs_price_usd",
      ],
    };

    const response = await axios({ url, method: "POST", headers, data: body });

    return response.data;
  } catch (error) {
    console.error("Error getting products informations");

    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

exports.main = async (event, callback) => {
  try {
    const { lineItemsIds, hs_currency } = event.inputFields;

    console.log("Currency: ", hs_currency);

    const currencyMapper = {
      USD: "hs_price_usd",
      BRL: "hs_price_brl",
      EUR: "hs_price_eur",
      NIO: "hs_price_nio",
    };

    const { results: lineItemsInformations } = await getLineItemsInfos(
      JSON.parse(lineItemsIds)
    );

    const lineItemsPricesToCompare = lineItemsInformations.map((info) => {
      return {
        productId: info.properties.hs_product_id,
        sku: info.properties.hs_sku,
        lineItemPrice: parseFloat(info.properties.price),
      };
    });

    const { results: productsInformations } = await getProductsInfos(
      lineItemsPricesToCompare.map((item) => item.productId)
    );

    if (lineItemsPricesToCompare.length !== productsInformations.length) {
      throw new Error(
        `Difference between the number of products found and line items; please verify.${productsInformations.length} product(s) and ${lineItemsPricesToCompare.length} line item(s)`
      );
    }

    let pricesMatcher = [];

    lineItemsPricesToCompare.forEach((element) => {
      productsInformations.forEach((product) => {
        if (element.productId == product.id) {
          pricesMatcher.push({
            isPriceModified:
              parseFloat(product.properties[currencyMapper[hs_currency]]) >
              element.lineItemPrice,
            sku: element.sku,
            originalPrice: product.properties[currencyMapper[hs_currency]],
            modifiedPrice: element.lineItemPrice,
            diff:
              (1 -
                element.lineItemPrice /
                  parseFloat(product.properties[currencyMapper[hs_currency]])) *
              100,
          });
        }
      });
    });

    const isValidPrice = !pricesMatcher.some(
      (price) => price.isPriceModified === true
    );

    const message = !isValidPrice
      ? `Os itens modificados foram:${pricesMatcher
          .filter((price) => price.isPriceModified === true)
          .map((price) => {
            if (price.isPriceModified) {
              return ` ${price.sku} de ${price.originalPrice} para ${
                price.modifiedPrice
              } tendo uma diferença de ${price.diff.toFixed(1)}%`;
            }
          })}.`
      : "";

    return await callback({
      outputFields: {
        isValidPrice,
        modifiedItems: message,
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
      lineItemsIds:
        "[26336782960,26336782961,26336782962,26336782963,26336782964]",
      hs_currency: "BRL",
    },
    object: { objectId: "" },
  },
  console.log
);
