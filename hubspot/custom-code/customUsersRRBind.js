const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const axios = require("axios");

const USER_LIST = [
  {
    userId: "50630080",
    percentage: 0.16,
  },
  {
    userId: "6905116",
    percentage: 0.16,
  },
  {
    userId: "53837823",
    percentage: 0.16,
  },
  {
    userId: "26584113",
    percentage: 0.16,
  },
  {
    userId: "43849303",
    percentage: 0.16,
  },
  {
    userId: "51660025",
    percentage: 0.16,
  },
];

function pickOption(options) {
  const totalPercentage = options.reduce(
    (acc, option) => acc + option.percentage,
    0
  );

  const randomNum = Math.random() * totalPercentage;

  let cumulativePercentage = 0;
  for (const option of options) {
    cumulativePercentage += option.percentage;
    if (randomNum <= cumulativePercentage) {
      return option;
    }
  }
}

async function getAllOwners(client) {
  let ownerList = [];
  let pagingToken = undefined;

  while (true) {
    const ownersResponse = await client.crm.owners.ownersApi.getPage(
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

const OBJECT_TYPE_ID = "0-1";
const SET_OWNER_PROPERTY = "sdr_owner";

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.codigoPersonalizadoDeRoundRobinRampers,
  });

  try {
    const randomUser = pickOption(USER_LIST);

    const ownerList = await getAllOwners(hubspotClient);

    console.log("ownerList: ", ownerList);

    const selectedOwner = ownerList.find(
      (owner) => owner.userId == randomUser.userId
    );

    console.log("owner found: ", selectedOwner);

    if (!selectedOwner) {
      console.error(
        `Error: userId not found in owner list: ${randomUser.userId}`
      );
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

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
