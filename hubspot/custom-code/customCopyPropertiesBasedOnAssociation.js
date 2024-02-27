const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const axios = require("axios");

const DESTINATION_OBJECT_TYPE_ID = "0-3"; // ID do objeto que roda no Workflow
const ORIGIN_OBJECT_TYPE_ID = "0-1"; // ID do objeto associado (se for o mesmo ID do DESTINATION_OBJECT_TYPE_ID, pega do próprio)
const PROPERTY_NAME = "franquiactn";
const PROPERTIES_TO_COPY = ["hubspot_owner_id", "assessorvisualizar"];

const normalizeStr = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.codigoPersonalizadoCopiaFranquia,
  });

  async function getAssociatedRecordIds(fromObject, toObject, fromObjectId) {
    const BatchInputPublicObjectId = { inputs: [{ id: fromObjectId }] };

    const associatedRecordsResponse =
      await hubspotClient.crm.associations.batchApi.read(
        fromObject,
        toObject,
        BatchInputPublicObjectId
      );

    const associatedRecordsArray =
      (((associatedRecordsResponse || {}).results || [])[0] || {}).to ?? [];

    return associatedRecordsArray.map((t) => t.id);
  }

  async function getAllOwners() {
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

    return ownersList;
  }

  const recordId = event.object.objectId;

  let franquiaCTN;

  try {
    if (DESTINATION_OBJECT_TYPE_ID != ORIGIN_OBJECT_TYPE_ID) {
      const associatedDestinationRecords = await getAssociatedRecordIds(
        DESTINATION_OBJECT_TYPE_ID,
        ORIGIN_OBJECT_TYPE_ID,
        recordId
      );

      if (!associatedDestinationRecords.length) {
        console.log(`Error: no ${toObject} associated with ${fromObject}`);
        return callback({
          outputFields: {
            hs_execution_state: "FAIL_CONTINUE",
          },
        });
      }

      if (associatedDestinationRecords.length > 1) {
        console.log(
          `Error: multiple ${DESTINATION_OBJECT_TYPE_ID} associated with ${ORIGIN_OBJECT_TYPE_ID}`
        );
        return callback({
          outputFields: { hs_execution_state: "FAIL_CONTINUE" },
        });
      }

      const [originRecordId] = associatedDestinationRecords;

      const originResponse = await hubspotClient.crm.objects.basicApi.getById(
        ORIGIN_OBJECT_TYPE_ID,
        originRecordId,
        [PROPERTY_NAME]
      );

      franquiaCTN = originResponse.properties[PROPERTY_NAME];
    } else {
      const destinationResponse =
        await hubspotClient.crm.objects.basicApi.getById(
          ORIGIN_OBJECT_TYPE_ID,
          recordId,
          [PROPERTY_NAME]
        );

      franquiaCTN = destinationResponse.properties[PROPERTY_NAME];
    }

    if (!franquiaCTN) {
      console.log("Error: franquiaCTN value is not set");
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    const franquiaPropertyResponse =
      await hubspotClient.crm.properties.coreApi.getByName(
        ORIGIN_OBJECT_TYPE_ID,
        PROPERTY_NAME
      );

    const selectedPropertyOption = franquiaPropertyResponse.options.find(
      (o) => o.value === franquiaCTN
    );

    if (!selectedPropertyOption) {
      console.log(
        `Error: selectedPropertyOption not found with value ${franquiaCTN}`
      );
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    const ownerList = await getAllOwners();

    const propertyLabel = normalizeStr(selectedPropertyOption.label);

    const matchedOwner = ownerList.find(
      (o) =>
        normalizeStr(`${o.firstName ?? ""} ${o.lastName ?? ""}`) ===
        propertyLabel
    );

    if (!matchedOwner) {
      console.log(`Error: no owner found with label ${propertyLabel}`);
      throw new Error("No owner found");
    }

    console.log(matchedOwner);

    const properties = {};

    for (const propertyToCopy of PROPERTIES_TO_COPY) {
      const propertyToCopyResponse =
        await hubspotClient.crm.properties.coreApi.getByName(
          DESTINATION_OBJECT_TYPE_ID,
          propertyToCopy
        );

      const ownerReference = propertyToCopyResponse.referencedObjectType;

      if (ownerReference !== "OWNER") {
        console.log(`Error: property ${propertyToCopy} is not of type owner`);
        return callback({
          outputFields: { hs_execution_state: "FAIL_CONTINUE" },
        });
      }

      properties[propertyToCopy] = matchedOwner.id;
    }

    const destinationUpdateResponse =
      await hubspotClient.crm.objects.basicApi.update(
        DESTINATION_OBJECT_TYPE_ID,
        recordId,
        { properties }
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
    inputFields: { franquiactn: "308" },
    object: { objectId: 15652959342 },
  },
  console.log
);
