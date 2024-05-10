const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const axios = require("axios");
const randomNumber = require("random-number-csprng");

const LEAD_CUSTOM_OBJECT_ID = "2-16070026";
const TEAM_LIST_DROPDOWN_PROPERTY = "celula_de_atendimento";
const NEW_PROPERTY = "id_celula_proprietaria"; // New property with the selected value

const selectRandomItem = async (arr) =>
  arr[arr.length > 1 ? await randomNumber(0, arr.length - 1) : 0];

const normalizeStr = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.codigoPersonalizadoRotacaoTime,
  });

  const teamProperty = event.inputFields[TEAM_LIST_DROPDOWN_PROPERTY] ?? "";

  try {
    let teamPropertyList = teamProperty
      .split(";")
      .map(normalizeStr)
      .filter((t) => t);

    // Check if celula_atendimento is empty
    if (!teamPropertyList.length) {
      // If empty, select a random value from available options
      const allTeams = [
        "Squad Alpha",
        "Squad Bravo",
        "Squad Charlie",
        "Squad Delta",
        "Squad Echo",
        "Squad Foxtrot",
        "Squad Golf",
        "Squad Hotel",
        "Squad India",
        "Squad Juliet",
      ];

      teamPropertyList = allTeams;
    }
    console.log("teamPropertyList:", teamPropertyList);
    // Select a random item from the checkbox options
    const selectedTeamLabel = normalizeStr(
      (await selectRandomItem(teamPropertyList)).replace(/^Squad /, "")
    );

    const allTeams = await hubspotClient.settings.users.teamsApi.getAll();

    const selectedTeam = allTeams.results.find(
      (t) => normalizeStr(t.name) === selectedTeamLabel
    );

    if (!selectedTeam) {
      console.log(`Error: No teams match label "${selectedTeamLabel}"`);
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    // Update the object with the selected checkbox value in the new property
    await hubspotClient.crm.objects.basicApi.update(
      LEAD_CUSTOM_OBJECT_ID,
      event.object.objectId,
      { properties: { [NEW_PROPERTY]: selectedTeam.id } }
    );

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
    inputFields: {},
    object: { objectId: 666244651 },
  },
  console.log
);
