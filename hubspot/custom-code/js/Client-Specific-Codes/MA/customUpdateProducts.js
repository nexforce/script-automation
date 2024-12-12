const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios").default;
const hsToken = process.env.APP_TOKEN;
const hsBaseUrl = "https://api.hubapi.com";

async function updateProductsBatch(body) {
  try {
    const url = `${hsBaseUrl}/crm/v3/objects/line_items/batch/update`;

    const headers = {
      Authorization: `Bearer ${hsToken}`,
    };

    const response = await axios({ method: "POST", url, data: body, headers });

    return response.data;
  } catch (error) {
    console.error(error.message);

    const errorMessage =
      error.response?.data?.message ||
      "Erro desconhecido ao atualizar um produto.";

    throw new Error(errorMessage);
  }
}

exports.main = async (event, callback) => {
  const { infos_to_products } = event.inputFields;
  const infos = JSON.parse(infos_to_products);

  const body = {
    inputs: infos.map((product) => {
      return {
        id: product.product_code,
        properties: {
          ipi_valor: Number.parseFloat(product.ipi_valor),
          flag_status_imposto: product.flag_status_imposto,
        },
      };
    }),
  };

  //console.log(body.inputs);
  //stop;

  const productsUpdated = await updateProductsBatch(body);
  console.log("productsUpdated", JSON.stringify(productsUpdated));

  try {
    return await callback({
      outputFields: {
        products: infos.map((product) => product.product_code),
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
      infos_to_products: JSON.stringify([
        {
          product_code: "test_lf_01",
          ipi_valor: 0,
          flag_status_imposto:
            "Nao enviado a TAG CodFil dentro a lista oCenar; Nao foi identificado o cadastro do cliente com codigo 0001 / 024024; Nao enviado a TAG QtdSai dentro a lista oCenar",
        },
      ]),
    },
    object: { objectId: "" },
  },
  console.log
);
