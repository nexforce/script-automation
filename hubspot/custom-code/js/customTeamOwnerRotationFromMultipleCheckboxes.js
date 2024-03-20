const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const axios = require("axios");
const randomNumber = require("random-number-csprng");

const LEAD_CUSTOM_OBJECT_ID = "2-16070026";
const TEAM_LIST_DROPDOWN_PROPERTY = "celula_de_atendimento";
const SET_OWNER_PROPERTY = "responsavel_atendimento";
const DEFAULT_ALL_TEAMS = [
  "Squad Golf",
  "Squad Echo",
  "Squad Delta",
  "Squad Bravo",
  "Squad Charlie",
  "Squad India",
  "Squad Alpha",
  "Squad Hotel",
  "Squad Juliet",
  "Squad Foxtrot",
];

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

  async function getAllOwners() {
    let ownerList = [];
    let pagingToken = undefined;

    while (true) {
      const ownersResponse = await hubspotClient.crm.owners.ownersApi.getPage(
        undefined,
        pagingToken,
        500,
        false
      );

      ownerList = ownerList.concat(ownersResponse.results);

      pagingToken = ownersResponse.paging?.next.after;

      if (!pagingToken) break;
    }

    return ownerList;
  }

  const teamProperty = event.inputFields[TEAM_LIST_DROPDOWN_PROPERTY] ?? "";

  try {
    let teamPropertyList = teamProperty
      .split(";")
      .map(normalizeStr)
      .filter((t) => t);

    // If empty, rotate based on all teams
    if (!teamPropertyList.length) teamPropertyList = DEFAULT_ALL_TEAMS;

    const allTeams = await hubspotClient.settings.users.teamsApi.getAll();

    const selectedTeams = teamPropertyList
      .map((label) =>
        allTeams.results.find((t) => normalizeStr(t.name).endsWith(label))
      )
      .filter((t) => t);

    if (!selectedTeams.length) {
      console.log(
        `Error: number of matched selectedTeams is zero: ${teamPropertyList}`
      );
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    const allPossibleUserIds = [
      ...new Set(selectedTeams.flatMap((team) => team.userIds)),
    ];

    const ownerList = await getAllOwners();

    const allPossibleOwners = allPossibleUserIds
      .map(Number)
      .map((id) => ownerList.find((o) => o.userId === id))
      .filter((o) => o);

    if (!allPossibleOwners.length) {
      console.log(
        `Error: number of matched allPossibleOwners is zero: ${allPossibleUserIds}`
      );
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    const selectedOwner = await selectRandomItem(allPossibleOwners);

    await hubspotClient.crm.objects.basicApi.update(
      LEAD_CUSTOM_OBJECT_ID,
      event.object.objectId,
      { properties: { [SET_OWNER_PROPERTY]: selectedOwner.id } }
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
    inputFields: { celula_de_atendimento: "" },
    object: { objectId: 101 },
  },
  console.log
);
