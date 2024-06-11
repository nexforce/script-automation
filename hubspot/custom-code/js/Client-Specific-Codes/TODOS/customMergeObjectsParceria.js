const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");
const token = process.env.secretName;
const baseUrl = "https://api.hubapi.com/crm/v3/objects";
const PARCERIA_OBJECT_ID = "2-25174237";

async function searchParceriasBy(cnpj) {
  try {
    const url = `${baseUrl}/${PARCERIA_OBJECT_ID}/search`;

    const data = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "cnpj_padronizado",
              operator: "EQ",
              value: cnpj,
            },
          ],
        },
      ],
      properties: ["cnpj", "cnpj_padronizado"],
    };

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const parcerias = await axios({ url, method: "POST", data, headers });

    return parcerias.data;
  } catch (error) {
    console.log("Error trying to find a Parceria:", error.message);
    throw new Error("Error trying to find a Parceria.");
  }
}

async function mergeParceriaBy(primaryObjectId, objectIdToMerge) {
  try {
    const url = `${baseUrl}/${PARCERIA_OBJECT_ID}/merge`;

    const data = {
      primaryObjectId,
      objectIdToMerge,
    };

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const parcerias = await axios({ url, method: "POST", data, headers });

    return parcerias.data;
  } catch (error) {
    console.log("Error trying to merge Parcerias:", error.message);
    throw new Error("Error trying to merge Parcerias.");
  }
}

exports.main = async (event, callback) => {
  try {
    const cnpjValue = `${event.inputFields["cnpj"]}`.replace(/[^\d]/g, "");

    if (!cnpjValue) {
      return await callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          information: "CNPJ inválido.",
        },
      });
    }

    const parcerias = await searchParceriasBy(cnpjValue);
    const filteredParcerias = parcerias.results.filter(
      (parceria) => +parceria.id !== event.object.objectId
    );

    console.log("filteredParcerias:", filteredParcerias);

    if (filteredParcerias.length == 0) {
      return await callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          information: "Nenhuma parceria para ser feita o merge.",
        },
      });
    }

    let primaryObjectId;
    let mergedParceria;
    for (const parceria of filteredParcerias) {
      console.log("Merging objects");

      if (filteredParcerias.indexOf(parceria) === 0) {
        primaryObjectId = event.object.objectId;

        mergedParceria = await mergeParceriaBy(primaryObjectId, parceria.id);
        primaryObjectId = mergedParceria.id;
      } else {
        mergedParceria = await mergeParceriaBy(primaryObjectId, parceria.id);
        primaryObjectId = mergedParceria.id;
      }
    }

    await callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        information: `Merge realizado com sucesso em: ${mergedParceria.properties.hs_merged_object_ids}`,
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

// [FINAL]

exports.main(
  {
    inputFields: {
      cnpj: "54.692.291/0001-55",
    },
    object: { objectId: 13555162237 },
  },
  console.log
);
