const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const axios = require("axios");
const randomNumber = require("random-number-csprng");

const OBJECT_TO_UPDATE = "deals";
const OWNER_CUSTOM_OBJECT_ID = "2-18763819";
const OWNER_RECORD_COUNT_PROPERTY_ID = "n_mero_de_neg_cios_atribu_dos";
const OWNER_NAME_PROPERTY_ID = "nome";

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.roundRobinAccessToken,
  });

  const teamId = event.inputFields["team_id"];

  try {
    if (!teamId) {
      console.log("Error: team value is not set");
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    const allTeams = await hubspotClient.settings.users.teamsApi.getAll();

    const selectedTeam = allTeams.results.find((t) => t.id === teamId);

    if (!selectedTeam) {
      console.log(`Error: team with id ${teamId} not found`);
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    let ownersList = [];
    let pagingToken = undefined;

    while (true) {
      const ownersResponse = await hubspotClient.crm.owners.ownersApi.getPage(
        undefined,
        pagingToken,
        500,
        false
      );

      ownersList = ownersList.concat(ownersResponse.results);

      pagingToken = ownersResponse.paging?.next.after;

      if (!pagingToken) break;
    }

    if (!ownersList.length) {
      console.log(`Error: team without any owners: ${selectedTeam.name}`);
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    const teamOwnerList = ownersList.filter((o) =>
      o.teams?.some((t) => t.id === teamId)
    );

    console.log(
      `Found ${teamOwnerList.length} owners in team ${selectedTeam.name}`
    );

    let customOwnerList = [];
    pagingToken = undefined;

    while (true) {
      const ownersResponse = await hubspotClient.crm.objects.searchApi.doSearch(
        OWNER_CUSTOM_OBJECT_ID,
        {
          properties: [
            "hubspot_owner_id",
            OWNER_NAME_PROPERTY_ID,
            OWNER_RECORD_COUNT_PROPERTY_ID,
          ],
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "hubspot_owner_id",
                  operator: "IN",
                  values: teamOwnerList.map((o) => o.id),
                },
              ],
            },
          ],
          limit: 100,
          after: pagingToken,
        }
      );

      customOwnerList = customOwnerList.concat(ownersResponse.results);

      pagingToken = ownersResponse.paging?.next.after;

      if (!pagingToken) break;
    }

    if (!customOwnerList.length) {
      console.log(
        `Error: no custom owner matches teamOwnerList: ${teamOwnerList
          .map((o) => o.id)
          .join(";")}`
      );
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    console.log(
      `Found ${customOwnerList.length} custom owners objects based on team owners`
    );

    const notFound = teamOwnerList.filter(
      (teamOwner) =>
        !customOwnerList.some(
          (o) => o.properties["hubspot_owner_id"] === teamOwner.id
        )
    );

    if (notFound.length) {
      console.log(
        `Warning: ${notFound.length} team members from ${selectedTeam.name} don't have a custom owner object associated:`
      );

      for (const owner of notFound)
        console.log(`- ${owner.email} (${owner.firstName} ${owner.lastName})`);

      console.log("Continuing only with users with custom owner objects");
    }

    const lowestRecordCount = Math.min(
      ...customOwnerList.map((o) =>
        Number(o.properties[OWNER_RECORD_COUNT_PROPERTY_ID])
      )
    );

    const filteredCustomOwners = customOwnerList.filter(
      (o) =>
        Number(o.properties[OWNER_RECORD_COUNT_PROPERTY_ID]) ===
        lowestRecordCount
    );

    if (!filteredCustomOwners.length) {
      console.log(`Error: filteredCustomOwners has no length`);
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    console.log(
      `Lowest record count is: ${lowestRecordCount} (${filteredCustomOwners.length} custom owners with that value)`
    );

    const randomCustomOwner =
      filteredCustomOwners[
        filteredCustomOwners.length > 1
          ? await randomNumber(0, filteredCustomOwners.length - 1)
          : 0
      ];

    const selectedOwner = ownersList.find(
      (o) => o.id === randomCustomOwner.properties["hubspot_owner_id"]
    );

    if (!selectedOwner) {
      console.log(
        `Error: owner with id ${randomCustomOwner.properties["hubspot_owner_id"]} not found`
      );
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    console.log(
      `Selected user "${selectedOwner.firstName} ${selectedOwner.lastName}" (${selectedOwner.id}) (custom owner object "${randomCustomOwner.properties[OWNER_NAME_PROPERTY_ID]}" (${randomCustomOwner.id}))`
    );

    // Update object (OBJECT_TO_UPDATE)
    await hubspotClient.crm[
      OBJECT_TO_UPDATE
    ].basicApi.update(event.object.objectId, {
      properties: { hubspot_owner_id: selectedOwner.id },
    });

    const customOwnerData = await hubspotClient.crm.objects.basicApi.getById(
      OWNER_CUSTOM_OBJECT_ID,
      randomCustomOwner.id,
      [OWNER_RECORD_COUNT_PROPERTY_ID]
    );

    const currentRecordCount = Number(
      customOwnerData.properties[OWNER_RECORD_COUNT_PROPERTY_ID]
    );

    console.log(
      `Incrementing custom owner object ${
        randomCustomOwner.id
      } record count from ${currentRecordCount} to ${currentRecordCount + 1}`
    );

    const customOwnerUpdateResponse =
      await hubspotClient.crm.objects.basicApi.update(
        OWNER_CUSTOM_OBJECT_ID,
        randomCustomOwner.id,
        {
          properties: {
            [OWNER_RECORD_COUNT_PROPERTY_ID]: currentRecordCount + 1,
          },
        }
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
    inputFields: { team_id: "14447051" },
    object: { objectId: 15253358475 },
  },
  console.log
);
