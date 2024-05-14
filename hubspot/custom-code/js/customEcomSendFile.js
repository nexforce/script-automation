const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");
const fs = require("fs").promises;
const { createReadStream } = require("fs");
const os = require("os");
const path = require("path");

async function loginOn4Docs() {
  try {
    const user = process.env.DOCS_USER;
    const password = process.env.DOCS_PASSWORD;
    const credentials = Buffer.from(`${user}:${password}`).toString("base64");

    const url =
      "https://api.4docs.cloud/v2/oauth2/token?grant_type=client_credentials";

    const headers = {
      Authorization: `Basic ${credentials}`,
    };

    const accessToken = await axios({ url, method: "POST", headers });

    return accessToken.data;
  } catch (error) {
    console.log("Error loggin on 4 docs.");
    throw error;
  }
}

async function getPdfOnHS(id) {
  try {
    const hsToken = process.env.UNIDADE_CONSUMIDORA_TOKEN;

    const headers = {
      Authorization: `Bearer ${hsToken}`,
    };

    const {
      data: { url },
    } = await axios({
      url: `https://api.hubapi.com/files/v3/files/${id}/signed-url`,
      method: "GET",
      headers,
    });

    const pdf = await axios({
      url,
      method: "GET",
      headers,
      responseType: "arraybuffer",
    });

    return pdf.data;
  } catch (error) {
    console.log("Error getting file.");
    throw error;
  }
}

async function getDocumentInformations(accessToken, data) {
  try {
    const url =
      "https://api.4docs.cloud/v2/quick_parse/9fbc3a280191a0428e55c4a8fb235d8c";

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };

    const docInformations = await axios({ url, method: "POST", headers, data });

    return docInformations.data;
  } catch (error) {
    console.log("Error getting document informations.");
    throw error;
  }
}

async function updateUCBy(id, data) {
  try {
    const hsToken = process.env.UNIDADE_CONSUMIDORA_TOKEN;

    const url = `https://api.hubapi.com/crm/v3/objects/2-28064547/${id}`;

    const headers = {
      Authorization: `Bearer ${hsToken}`,
    };

    const uc = await axios({ url, method: "PATCH", headers, data });

    return uc.data;
  } catch (error) {
    console.log("Error updating UC.");
    throw error;
  }
}

function ucPropertiesFormatter(data) {
  const stateMapper = {
    AC: "Acre",
    AL: "Alagoas",
    AP: "Amapá",
    AM: "Amazonas",
    BA: "Bahia",
    CE: "Ceará",
    DF: "Distrito Federal",
    ES: "Espírito Santo",
    GO: "Goiás",
    MA: "Maranhão",
    MT: "Mato Grosso",
    MS: "Mato Grosso do Sul",
    MG: "Minas Gerais",
    PA: "Pará",
    PB: "Paraíba",
    PR: "Paraná",
    PE: "Pernambuco",
    PI: "Piauí",
    RJ: "Rio de Janeiro",
    RN: "Rio Grande do Norte",
    RS: "Rio Grande do Sul",
    RO: "Rondônia",
    RR: "Roraima",
    SC: "Santa Catarina",
    SP: "São Paulo",
    SE: "Sergipe",
    TO: "Tocantins",
  };

  return {
    properties: {
      distribuidora: providerTransformer(data.stdProvider),
      faixa_de_valor_mensal_da_conta_de_luz: totalChargesMapper(
        data.totalCharges
      ),
      geracao_propria: null,
      cnpj: cnpjFormatter(data.customer.cnpj.toString()),
      razao_social: data.customer.name,
      cidade: data.customer.address.city,
      estado: stateMapper[data.customer.address.state],
      cep: data.customer.address.zipCode,
      consumo__mwm_: calculateMwmBy(data.items),
      ambiente_de_contratacao: null,
      demanda_contratada_p_kw:
        data.items.find(
          (item) => item.type === "demand" && item.period === "peak"
        )?.contract || 0,
      demanda_contratada_fp_kw:
        data.items.find(
          (item) => item.type === "demand" && item.period === "off-peak"
        )?.contract || 0,
      modalidade_tarifaria: data.tariffModality === "green" ? "Verde" : "Azul",
      subgrupo_tarifario: data.subgroup,
      setor_ocr: data.class,
      codigo_uc: data.locationNumber,
    },
  };
}

function providerTransformer(provider) {
  return provider.replaceAll("_", " ").toUpperCase();
}

function totalChargesMapper(totalCharges) {
  const ranges = [
    { range: "Menor que R$ 2 mil", limit: 2000 },
    { range: "De R$ 2 a 5 Mil", limit: 5000 },
    { range: "De R$ 5 a 10 Mil", limit: 10000 },
    { range: "De R$ 10 a 20 Mil", limit: 20000 },
    { range: "De R$ 20 a 50 mil", limit: 50000 },
    { range: "De R$ 50 a 100 Mil", limit: 100000 },
  ];

  for (const object of ranges) {
    if (totalCharges < object.limit) {
      return object.range;
    }
  }

  return "Mais de R$ 100 Mil";
}

function cnpjFormatter(cnpj) {
  cnpj = cnpj.replace(/\D/g, "");

  if (cnpj.length !== 14) {
    return "CNPJ inválido";
  }

  const part1 = cnpj.substring(0, 2);
  const part2 = cnpj.substring(2, 5);
  const part3 = cnpj.substring(5, 8);
  const part4 = cnpj.substring(8, 12);
  const part5 = cnpj.substring(12);

  return `${part1}.${part2}.${part3}/${part4}-${part5}`;
}

function calculateMwmBy(items) {
  const teItems = items.filter((item) => item.kind === "TE");
  const billedSum = teItems.reduce(
    (accumulator, currentItem) => accumulator + currentItem.billed,
    0
  );
  return (billedSum / 1000 / 730).toFixed(2);
}

exports.main = async (event, callback) => {
  try {
    if (!event.inputFields.fatura) {
      console.log("No document to send.");
      return await callback({
        outputFields: { hs_execution_state: "ERROR" },
      });
    }

    const response = await getPdfOnHS(event.inputFields.fatura);

    let tmpDir;
    const appPrefix = "4-docs-hs";

    try {
      tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), appPrefix));

      fs.writeFile(`${tmpDir}/tax.pdf`, response);

      const data = {
        file: createReadStream(`${tmpDir}/tax.pdf`),
        json: JSON.stringify({
          pipelineName: "energy",
          clientData: { record_id: event.object.objectId },
          callbackUrl:
            "https://webhook.site/21f6d5c0-48ff-47b9-92d6-a8fc06a354b4",
        }),
      };

      const { access_token } = await loginOn4Docs();

      const documentInformation = await getDocumentInformations(
        access_token,
        data
      );

      if (
        documentInformation.newStatus !== "SUCCESS" ||
        documentInformation.result.providerData.name.confidence !== "high"
      ) {
        console.log("Error reading document.");
        return await callback({
          outputFields: { hs_execution_state: "ERROR" },
        });
      }

      const { result } = documentInformation;
      const dataForUpdate = ucPropertiesFormatter(result);

      await updateUCBy(event.object.objectId, dataForUpdate);

      console.log("UC updated successfully.");
      return await callback({
        outputFields: {
          hs_execution_state: "SUCCESS",
          hs_object_id: event.object.objectId,
          ...dataForUpdate.properties,
        },
      });
    } catch (error) {
      console.log(error);
      console.log("Erro ao criar arquivo temporário.");
    } finally {
      try {
        if (tmpDir) {
          fs.rm(tmpDir, { recursive: true });
        }
      } catch (e) {
        console.error(
          `An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`
        );
      }
    }
  } catch (err) {
    await callback({
      outputFields: { hs_execution_state: "ERROR" },
    });
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
      fatura: 166800232995,
    },
    object: { objectId: 12887363680 },
  },
  console.log
);
