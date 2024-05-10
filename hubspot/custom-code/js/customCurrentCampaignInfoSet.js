const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");

// Id do objeto DEAL
const DEAL_OBJECT_TYPE_ID = "0-3";
// Id do objeto CAMPANHA
const CAMPAIGN_OBJECT_TYPE_ID = "2-17677686";
// Id do objeto PARCEIRO
const PARTNER_OBJECT_TYPE_ID = "2-27256136";
// {campaign:deal}
const CAMPAIGN_TO_DEAL_MAPPER = {
  beneficios: "beneficios",
  celula_de_atendimento: "celulas_de_atendimento_atual",
  taxa_de_btc: "taxa_btc",
  faixa_de_corretagem: "tabela_de_corretagem_atual",
  camp_parceiro: "parceiro",
  nome_da_campanha: "campanha_atual",
};
// {partner:deal}
const PARTNER_TO_DEAL_MAPPER = {
  beneficios: "beneficios",
  beneficios__especial_adicional:
    "campanha_modificada_por_parceiro__beneficio_especial_adicional",
  taxa_de_btc: "taxa_btc",
  faixa_de_corretagem: "tabela_de_corretagem_atual",
  id_parceiro: "campanha_atual_modificada__id_do_parceiro",
};
const token = process.env.CodigoPersonalizadoCampanhaAtual;

async function searchCampaignBy(field, value) {
  try {
    const url = `https://api.hubapi.com/crm/v3/objects/${CAMPAIGN_OBJECT_TYPE_ID}/search`;
    const headers = {
      authorization: `Bearer ${token}`,
    };

    const data = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: field,
              operator: "EQ",
              value: value,
            },
          ],
        },
      ],
      properties: [
        "beneficios",
        "celula_de_atendimento",
        "taxa_de_btc",
        "faixa_de_corretagem",
        "camp_parceiro",
        "nome_da_campanha",
      ],
    };

    const campaign = await axios({ url, method: "POST", headers, data });

    return campaign.data;
  } catch (error) {
    console.log("Erro ao buscar uma campanha:", error.message);
    throw error;
  }
}

async function searchPartnerBy(field, value) {
  try {
    const url = `https://api.hubapi.com/crm/v3/objects/${PARTNER_OBJECT_TYPE_ID}/search`;
    const headers = { authorization: `Bearer ${token}` };

    const data = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: field,
              operator: "EQ",
              value: value,
            },
          ],
        },
      ],
      properties: [
        "faixa_de_corretagem",
        "taxa_de_btc",
        "taxa_de_btc",
        "beneficios",
        "beneficios__especial_adicional",
        "id_parceiro",
      ],
    };

    const partner = await axios({ url, method: "POST", headers, data });

    return partner.data;
  } catch (error) {
    console.log("Erro ao buscar um parceiro:", error.message);
    throw error;
  }
}

function dealFieldsUpdater(campaignResult, partnerResult) {
  return Object.assign(
    dealFieldsMapper(campaignResult, CAMPAIGN_TO_DEAL_MAPPER),
    dealFieldsMapper(partnerResult, PARTNER_TO_DEAL_MAPPER)
  );
}

function dealFieldsMapper(fields, dealMapper) {
  let fieldsMapped = {};

  if (fields) {
    const properties = fields[0]?.properties;

    for (const key in properties) {
      if (dealMapper[key] && properties[key]) {
        fieldsMapped = Object.assign(fieldsMapped, {
          [dealMapper[key]]: properties[key],
        });
      }
    }
  }

  return fieldsMapped;
}

async function updateDealBy(dealId, data) {
  try {
    const url = `https://api.hubapi.com/crm/v3/objects/${DEAL_OBJECT_TYPE_ID}/${dealId}`;
    const headers = { authorization: `Bearer ${token}` };

    const dealUpdated = await axios({ url, method: "PATCH", headers, data });

    return dealUpdated.data;
  } catch (error) {
    console.log("Erro ao atualizar um deal:", error.message);
    throw error;
  }
}

exports.main = async (event, callback) => {
  const situation =
    !event.inputFields["id_da_campanha_atual_apontada_por_assessor"] &&
    !event.inputFields["id_parceiro_atual_apontado_por_assessor"]
      ? 2
      : 1;

  let campaign;
  let partner;

  try {
    switch (situation) {
      case 1:
        console.log("primeiro cenário");
        campaign =
          event.inputFields["id_da_campanha_atual_apontada_por_assessor"] &&
          (await searchCampaignBy(
            "id_campanha",
            event.inputFields["id_da_campanha_atual_apontada_por_assessor"]
          ));

        partner =
          event.inputFields["id_parceiro_atual_apontado_por_assessor"] &&
          (await searchPartnerBy(
            "id_parceiro",
            event.inputFields["id_parceiro_atual_apontado_por_assessor"]
          ));

        break;

      case 2:
        console.log("segundo cenário");
        campaign =
          event.inputFields["ultima_campanha_de_reconversao"] &&
          (await searchCampaignBy(
            "nome_da_campanha",
            event.inputFields["ultima_campanha_de_reconversao"]
          ));

        partner =
          event.inputFields[
            "campanha_modificada__id_do_ultimo_parceiro_de_recaptura"
          ] &&
          (await searchPartnerBy(
            "id_parceiro",
            event.inputFields[
              "campanha_modificada__id_do_ultimo_parceiro_de_recaptura"
            ]
          ));

        break;

      default:
        console.log("Erro na busca por Campanhas e/ou Parceiros.");
        break;
    }

    console.log("campaign", campaign);
    console.log("partner", partner);

    if (
      (!campaign && !partner) ||
      (campaign?.total !== 1 && partner?.total !== 1)
    ) {
      return await callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          no_matched_campaign: true,
          no_matched_partner: true,
        },
      });
    }

    const newFields = dealFieldsUpdater(campaign?.results, partner?.results);
    console.log("newFields", newFields);

    const { objectId } = event.object;
    const dataToSend = { properties: { ...newFields } };

    await updateDealBy(objectId, dataToSend);

    await callback({
      outputFields: { hs_execution_state: "SUCCESS", objectId },
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
    inputFields: {},
    object: { objectId: 666244651 },
  },
  console.log
);
