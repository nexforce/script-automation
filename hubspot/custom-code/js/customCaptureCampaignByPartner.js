const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");

const UTM_PART_INPUT_FIELD_ID = "utm_part";
const PARTNER_OBJECT_TYPE_ID = "2-27256136"; // Novo ID do objeto parceiro
const REF_ID_PROPERTY_ID = "id_parceiro";
const FAIXA_DE_CORRETAGEM_PROPERTY = "faixa_de_corretagem";
const TAXA_DE_BTC_PROPERTY = "taxa_de_btc";
const BENEFICIOS_PROPERTY = "beneficios";
const BENEFICIOS_ESPECIAL_ADICIONAL_PROPERTY = "beneficios__especial_adicional";

const CAMPANHA_MODIFICADA_TABELA_DE_CORRETAGEM_PROPERTY = "campanha_modificada__tabela_de_corretagem";
const CAMPANHA_MODIFICADA_TAXA_DE_BTC_PROPERTY = "campanha_modificada__taxa_de_btc";
const CAMPANHA_MODIFICADA_BENEFICIOS_PROPERTY = "campanha_modificada__beneficios";
const CAMPANHA_MODIFICADA_BENEFICIO_ESPECIAL_ADICIONAL_PROPERTY = "campanha_modificada__beneficio_especial_adicional";
const CAMPANHA_MODIFICADA_REFERRAL_ID_PARCEIRO_PROPERTY = "campanha_modificada__referral_id_parceiro";

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.roundRobinAcessToken,
  });

  const recordId = event.object.objectId;
  const utmPart = event.inputFields[UTM_PART_INPUT_FIELD_ID];

  try {
    if (!utmPart) {
      console.log("Error: utmPart value is not set");
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    const matchingPartnerResponse = await hubspotClient.crm.objects.searchApi.doSearch(PARTNER_OBJECT_TYPE_ID, {
      properties: [REF_ID_PROPERTY_ID, FAIXA_DE_CORRETAGEM_PROPERTY, TAXA_DE_BTC_PROPERTY, BENEFICIOS_PROPERTY, BENEFICIOS_ESPECIAL_ADICIONAL_PROPERTY],
      filterGroups: [
        {
          filters: [
            {
              propertyName: REF_ID_PROPERTY_ID,
              operator: "EQ",
              value: utmPart,
            },
          ],
        },
      ],
      limit: 1,
    });

    if (matchingPartnerResponse.total !== 1) {
      console.log(`Info: no partner found with refId ${utmPart}`);
      // Definir o estado de execução como ERROR quando nenhum parceiro for encontrado
      return callback({
        outputFields: { hs_execution_state: "ERROR" },
      });
    }

    const [partner] = matchingPartnerResponse.results;
    const faixaDeCorretagem = partner.properties[FAIXA_DE_CORRETAGEM_PROPERTY];
    const taxaDeBTC = partner.properties[TAXA_DE_BTC_PROPERTY];
    const beneficios = partner.properties[BENEFICIOS_PROPERTY];
    const beneficiosEspecialAdicional = partner.properties[BENEFICIOS_ESPECIAL_ADICIONAL_PROPERTY];

    console.log("Partner found:");
    console.log(partner);

    // Atualizar propriedades do contato
    const updateProperties = {};
    if (faixaDeCorretagem) {
      updateProperties[CAMPANHA_MODIFICADA_TABELA_DE_CORRETAGEM_PROPERTY] = faixaDeCorretagem;
    }
    if (taxaDeBTC) {
      updateProperties[CAMPANHA_MODIFICADA_TAXA_DE_BTC_PROPERTY] = taxaDeBTC;
    }
    if (beneficios) {
      updateProperties[CAMPANHA_MODIFICADA_BENEFICIOS_PROPERTY] = beneficios;
    }
    if (beneficiosEspecialAdicional) {
      updateProperties[CAMPANHA_MODIFICADA_BENEFICIO_ESPECIAL_ADICIONAL_PROPERTY] = beneficiosEspecialAdicional;
    }
    updateProperties[CAMPANHA_MODIFICADA_REFERRAL_ID_PARCEIRO_PROPERTY] = utmPart;

    console.log("Updated contact properties:");
    console.log(updateProperties);

    await hubspotClient.crm.contacts.basicApi.update(recordId, {
      properties: updateProperties,
    });

    console.log("Contact properties updated successfully.");

    // Return success state
    return callback({
      outputFields: { hs_execution_state: "SUCCESS" },
    });
  } catch (err) {
    console.error(err);
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
