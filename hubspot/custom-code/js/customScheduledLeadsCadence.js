const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const axios = require("axios");

const LEAD_OBJECT_ID = "2-14691019";

const segmentArray = (array, batchLength) =>
  Array.from({ length: Math.ceil(array.length / batchLength) }, (_, i) =>
    array.slice(i * batchLength, (i + 1) * batchLength)
  );

exports.main = async (event, callback) => {
  // If it is not a weekday, return
  if ([0, 6].includes(new Date().getDay())) return;

  const hubspotClient = new hubspot.Client({
    accessToken: process.env.cadenceAccessToken,
  });

  async function fetchPropertyHistoryFromRecords(
    objectId,
    recordList,
    propertiesWithHistory
  ) {
    const propertyHistoryResponses = [];

    for (const batch of segmentArray(recordList, 50))
      propertyHistoryResponses.push(
        ...(
          await hubspotClient.crm.objects.batchApi.read(objectId, {
            propertiesWithHistory,
            inputs: batch.map((l) => ({ id: l.id })),
          })
        ).results
      );

    return propertyHistoryResponses;
  }

  const sdrOwnerId = event.inputFields["sdr_owner_id"];
  const maxNumberOfLeadsDaily =
    event.inputFields["max_number_of_leads_to_enter_cadence_daily"];

  try {
    const associatedLeads = await hubspotClient.crm.objects.searchApi.doSearch(
      LEAD_OBJECT_ID,
      {
        limit: 100,
        filterGroups: [
          {
            filters: [
              {
                propertyName: "hubspot_owner_id",
                operator: "EQ",
                value: sdrOwnerId,
              },
              {
                propertyName: "already_entered_cadence",
                operator: "NEQ",
                value: "true",
              },
            ],
          },
          {
            filters: [
              {
                propertyName: "nome_da_sdr",
                operator: "EQ",
                value: sdrOwnerId,
              },
              {
                propertyName: "already_entered_cadence",
                operator: "NEQ",
                value: "true",
              },
            ],
          },
        ],
      }
    );

    const leadsWithPropertyHistory = await fetchPropertyHistoryFromRecords(
      LEAD_OBJECT_ID,
      associatedLeads.results,
      ["already_entered_cadence"]
    );

    // Filter only leads that have not had already_entered_cadence property equal to 'true'
    const filteredLeads = leadsWithPropertyHistory.filter(
      (l) =>
        !l.propertiesWithHistory["already_entered_cadence"].some(
          (p) => p.value === "true"
        )
    );

    const maxNumberLeadsEnteredCadenceToday = Math.min(
      maxNumberOfLeadsDaily,
      filteredLeads.length
    );

    // Batch update leads with already_entered_cadence property
    await hubspotClient.crm.objects.batchApi.update(LEAD_OBJECT_ID, {
      inputs: filteredLeads
        .slice(0, maxNumberLeadsEnteredCadenceToday)
        .map((l) => ({
          id: l.id,
          properties: { already_entered_cadence: true },
        })),
    });

    return callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        count_of_daily_leads_that_entered_cadence_today:
          maxNumberLeadsEnteredCadenceToday,
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
      sdr_owner_id: 402111923,
      max_number_of_leads_to_enter_cadence_daily: 40,
    },
    object: { objectId: 8039068032 },
  },
  console.log
);
