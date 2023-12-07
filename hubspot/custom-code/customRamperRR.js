const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const axios = require("axios");

// List must be in decreasing percentage order
const RAMPERS_CATEGORIES_LIST = [
  {
    teamIds: ["8116944", "12437857", "12437858", "12437867", "12437868"],
    percentage: 0.6,
    category: "AE",
  },
  { teamIds: ["16417743"], percentage: 0.25, category: "Ramper 2" },
  { teamIds: ["16417741"], percentage: 0.15, category: "Ramper 1" },
];
const OBJECT_TYPE_ID = "0-1";
const SET_OWNER_PROPERTY = "sdr_owner";

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.codigoPersonalizadoDeRoundRobinRampers,
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

  try {
    const allTeams = await hubspotClient.settings.users.teamsApi.getAll();

    const categorizedUsers = RAMPERS_CATEGORIES_LIST.flatMap((c) =>
      c.teamIds
        .flatMap(
          (id) => allTeams.results.find((t) => t.id === id)?.userIds ?? []
        )
        // .flatMap((id) => {
        //   const team = allTeams.results.find((t) => t.id === id);
        //   if (!team) return [];
        //   return [...team.userIds, ...team.secondaryUserIds];
        // })
        .map((userId) => ({ ...c, userId }))
    );

    if (!categorizedUsers.length) {
      console.error("Error: No users to select");
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    console.log(categorizedUsers);

    const filteredCategorizedUsers = categorizedUsers.filter(
      (c1) => categorizedUsers.find((c2) => c1.userId === c2.userId) === c1
    ); // If user is in multiple categories, filter only the first category

    console.log(filteredCategorizedUsers);

    let accChances = 0;

    const userDiscriminatorParameters = filteredCategorizedUsers.map((c) => {
      accChances += c.percentage;
      return { userId: c.userId, discriminator: accChances };
    });

    const totalChances =
      userDiscriminatorParameters.at(-1)?.discriminator ?? -Infinity;

    const normalizedUserDiscriminatorParameters =
      userDiscriminatorParameters.map((d) => ({
        ...d,
        discriminator: d.discriminator / totalChances,
      }));

    console.log(normalizedUserDiscriminatorParameters);

    const randomDiscriminator = Math.random(); // Between 0 and 1

    console.log(randomDiscriminator);

    // Select first user with a discriminator greater than randomDiscriminator
    const randomUser = normalizedUserDiscriminatorParameters.find(
      (d) => d.discriminator > randomDiscriminator
    );

    console.log(randomUser);

    const ownerList = await getAllOwners();

    const selectedOwner = ownerList.find(
      (o) => o.userId === Number(randomUser.userId)
    );

    if (!selectedOwner) {
      console.error(
        `Error: userId not found in owner list: ${randomUser.userId}`
      );
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    console.log(selectedOwner);

    await hubspotClient.crm.objects.basicApi.update(
      OBJECT_TYPE_ID,
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
    inputFields: {},
    object: { objectId: 666244651 },
  },
  console.log
);
