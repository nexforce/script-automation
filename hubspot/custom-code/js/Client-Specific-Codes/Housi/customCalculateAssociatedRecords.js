const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");

const empreendimentoObjectTypeId = "2-45980757";
const unidadeObjectTypeId = "2-44796254";

async function getAssociatedUnidades(id, after = null, limit = 500) {
  const token = process.env.HOUSI_OBJECT_CREATION_TOKEN;
  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const url = `https://api.hubapi.com/crm/v4/objects/${empreendimentoObjectTypeId}/${id}/associations/${unidadeObjectTypeId}?limit=500${
      after ? `&after=${after}` : ""
    }`;

    const response = await axios({ method: "GET", url, headers });

    return response.data;
  } catch (error) {
    console.error("Error getting associated Unidades: ", error.message);
    const errorMessage =
      error.response?.data?.message || "Unkown error on Hubspot.";

    console.error(errorMessage);

    throw new Error(errorMessage);
  }
}

exports.main = async (event, callback) => {
  const { numero_de_unidades_no_predio } = event.inputFields;

  try {
    const associatedUnidades = await getAssociatedUnidades(
      event.object.objectId
    );

    let next = !!associatedUnidades.paging?.next?.after;

    while (next) {
      const nextPage = await getAssociatedUnidades(
        event.object.objectId,
        associatedUnidades.paging.next.after
      );

      associatedUnidades.results.push(...nextPage.results);
      next = !!nextPage.paging?.next?.after;
    }

    let associationCount = associatedUnidades.results.length;

    console.log("Associated Unidades:", associatedUnidades);
    console.log(`Total Unidades associadas: ${associationCount}`);

    return await callback({
      outputFields: {
        associationCount,
        needsToCreateUnidades: associationCount <= numero_de_unidades_no_predio,
      },
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
      numero_de_unidades_no_predio: 10,
    },
    object: { objectId: "29582833163" },
  },
  console.log
);
