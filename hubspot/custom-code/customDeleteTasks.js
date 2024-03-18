const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");
const secret = process.env.HS_APP;

async function getAssociations(objectType, objectId, toObjectType) {
  try {
    const url = `https://api.hubapi.com/crm/v4/objects/${objectType}/${objectId}/associations/${toObjectType}?limit=500`;
    const headers = { authorization: `Bearer ${secret}` };

    const associations = await axios({ url, method: "get", headers });

    return associations;
  } catch (err) {
    console.log(err);
  }
}

async function getTask(taskId) {
  try {
    const url = `https://api.hubapi.com/crm/v3/objects/tasks/${taskId}?properties=hs_object_source&properties=hs_task_status&archived=false`;
    const headers = { authorization: `Bearer ${secret}` };

    const task = await axios({ url, method: "get", headers });

    return task;
  } catch (err) {
    console.log(err);
  }
}

async function deleteTask(taskToDelete) {
  try {
    const url = `https://api.hubapi.com/crm/v3/objects/tasks/${taskToDelete}`;
    const headers = { authorization: `Bearer ${secret}` };

    const taskDeleted = await axios({ url, method: "delete", headers });

    return taskDeleted.data;
  } catch (err) {
    console.log(err);
  }
}

exports.main = async (event, callback) => {
  const { objectId } = event.inputFields;

  const associations = await getAssociations("leads", objectId, "task");
  const {
    data: { results },
  } = associations;

  for (const result of results) {
    const taskId = result.toObjectId;
    const task = await getTask(taskId);

    const objectSource = task.data.properties.hs_object_source;
    const taskStatus = task.data.properties.hs_task_status;

    if (
      objectSource === "AUTOMATION_PLATFORM" &&
      taskStatus === "NOT_STARTED"
    ) {
      console.log("TASK PARA DELETAR", task.data);
      await deleteTask(taskId);
    }
  }

  callback({
    outputFields: { objectId },
  });
};

// [FINAL]

exports.main(
  {
    inputFields: {},
    object: { objectId: 666244651 },
  },
  console.log
);
