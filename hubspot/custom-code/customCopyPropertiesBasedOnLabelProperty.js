const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const axios = require("axios");

const DESTINATION_OBJECT_TYPE_ID = "2-16070026"; // ID do objeto que roda no Workflow
const ORIGIN_OBJECT_TYPE_ID = "2-17677686"; // ID do objeto associado
const PRIMARY_DESTINATION_LABEL_PROPERTY = "campanha_conversao"; // Type: Dropdown select
const SECONDARY_DESTINATION_LABEL_PROPERTY = "ultima_campanha_de_reconversao"; // Type: Single-line text
const ORIGIN_OBJECT_LABEL_PROPERTY = "nome_da_campanha";
const PROPERTIES_TO_COPY = {
  beneficios: "beneficios", // Campaign: beneficios (Multiple checkboxes) -> Lead: beneficios (Multiple checkboxes)
  celula_de_atendimento: "celula_de_atendimento", // Campaign: celula_de_atendimento (Multiple checkboxes) -> Lead: celula_de_atendimento (Multiple checkboxes)
  taxa_de_btc: "taxa_de_btc", // Campaign: taxa_de_btc (Dropdown select) -> Lead: taxa_de_btcc (Dropdown select)
  faixa_de_corretagem: "tabela_de_corretagem", // Campaign: faixa_de_corretagem (Dropdown select) -> Lead: tabela_de_corretagemc (Dropdown select)
  camp_parceiro: "parceiro_campanha", // Campaign: camp_parceiroc (Dropdown select) -> Lead: parceiro_campanha (Single-line text)
};
const ORIGIN_PROPERTIES = Object.keys(PROPERTIES_TO_COPY);

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken:
      process.env
        .codigoPersonalizadoCopiaDePropriedadesDeCampanhaNaAberturaDeConta,
  });

  const recordId = event.object.objectId;
  const primaryDestinationLabelPropertyValue =
    event.inputFields[PRIMARY_DESTINATION_LABEL_PROPERTY];
  const secondaryDestinationLabelPropertyValue =
    event.inputFields[SECONDARY_DESTINATION_LABEL_PROPERTY];

  try {
    if (
      !primaryDestinationLabelPropertyValue &&
      !secondaryDestinationLabelPropertyValue
    ) {
      console.log(
        `Error: ${PRIMARY_DESTINATION_LABEL_PROPERTY} and ${SECONDARY_DESTINATION_LABEL_PROPERTY} property values are not set`
      );
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    let destinationLabelPropertyValue;

    if (primaryDestinationLabelPropertyValue) {
      const destinationPrimaryPropertyResponse =
        await hubspotClient.crm.properties.coreApi.getByName(
          DESTINATION_OBJECT_TYPE_ID,
          PRIMARY_DESTINATION_LABEL_PROPERTY
        );

      const primarySelectedPropertyOption =
        destinationPrimaryPropertyResponse.options.find(
          (o) => o.value === primaryDestinationLabelPropertyValue
        );

      if (!primarySelectedPropertyOption) {
        console.log(
          `Error: primarySelectedPropertyOption not found with value ${primaryDestinationLabelPropertyValue}`
        );
        return callback({
          outputFields: { hs_execution_state: "FAIL_CONTINUE" },
        });
      }

      destinationLabelPropertyValue = primarySelectedPropertyOption.label;
    } else {
      destinationLabelPropertyValue = secondaryDestinationLabelPropertyValue;
    }

    const originRecordsSearchResponse =
      await hubspotClient.crm.objects.searchApi.doSearch(
        ORIGIN_OBJECT_TYPE_ID,
        {
          properties: ORIGIN_PROPERTIES,
          filterGroups: [
            {
              filters: [
                {
                  propertyName: ORIGIN_OBJECT_LABEL_PROPERTY,
                  operator: "EQ",
                  value: destinationLabelPropertyValue,
                },
              ],
            },
          ],
          limit: 100,
        }
      );

    const originRecords = originRecordsSearchResponse.results;

    if (!originRecords.length) {
      console.log(
        `Error: no ${ORIGIN_OBJECT_TYPE_ID} matches label "${destinationLabelPropertyValue}"`
      );
      return callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          no_matched_campaign: true,
          unmatched_campaign_name: destinationLabelPropertyValue,
        },
      });
    }

    if (originRecords.length > 1) {
      console.log(
        `Error: multiple ${ORIGIN_OBJECT_TYPE_ID} associated with ${DESTINATION_OBJECT_TYPE_ID}`
      );
      return callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          campaign_name_conflict: true,
        },
      });
    }

    const originRecordProperties = originRecords[0].properties;

    const destinationProperties = {};
    for (const [key, value] of Object.entries(PROPERTIES_TO_COPY)) {
      destinationProperties[value] = originRecordProperties[key];
    }

    const destinationUpdateResponse =
      await hubspotClient.crm.objects.basicApi.update(
        DESTINATION_OBJECT_TYPE_ID,
        recordId,
        { properties: destinationProperties }
      );

    console.log(destinationUpdateResponse);

    return callback({
      outputFields: { hs_execution_state: "SUCCESS" },
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
      campanha_conversao: "",
      ultima_campanha_de_reconversao: "Arion Sote Oficial",
    },
    object: { objectId: 12252859181 },
  },
  console.log
);
