const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");
const baseUrl = "https://api.hubapi.com/";
const token = process.env.CHATBOT_SGA_TOKEN;

async function getUsersTeams() {
  try {
    const url = `${baseUrl}settings/v3/users/teams`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({
      url,
      method: "GET",
      headers,
    });

    return response.data;
  } catch (error) {
    console.log("Error getting users teams.");
    throw error;
  }
}

async function searchUsersBy(internalIds) {
  try {
    const url = `${baseUrl}crm/v3/objects/users/search`;

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const payload = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "hs_internal_user_id",
              operator: "IN",
              values: internalIds,
            },
            {
              propertyName: "hs_availability_status",
              operator: "EQ",
              value: "available",
            },
          ],
        },
      ],
      properties: [
        "hs_internal_user_id",
        "hs_given_name",
        "hs_availability_status",
        "hs_email",
        "hubspot_owner_id",
      ],
    };

    const response = await axios({
      url,
      method: "POST",
      data: payload,
      headers,
    });

    return response.data;
  } catch (error) {
    console.log("Error searching user.");
    throw error;
  }
}

async function getThreadsAfter(date) {
  try {
    const url = `${baseUrl}conversations/v3/conversations/threads?inboxId=593982391&sort=latestMessageTimestamp&latestMessageTimestampAfter=${date}&limit=100`;

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await axios({
      url,
      method: "GET",
      headers,
    });

    return response.data;
  } catch (error) {
    console.log("Error getting threads.");
    throw error;
  }
}

function selectAgent(agentsWithCapacity) {
  if (agentsWithCapacity.length === 0) return null;

  const maxCapacity = Math.max(
    ...agentsWithCapacity.map((agent) => agent.capacity)
  );

  const agentsWithMaxCapacity = agentsWithCapacity.filter(
    (agent) => agent.capacity === maxCapacity
  );

  const randomIndex = Math.floor(Math.random() * agentsWithMaxCapacity.length);

  return agentsWithMaxCapacity[randomIndex];
}

exports.main = async (event, callback) => {
  const { areaAtentimento } = event.inputFields;

  const teamMapper = {
    Mobilidade: "2.1.1.1.1. Produtos - Mobilidade - Active",
    "Demais ramos": "2.1.1.1.2.1. Produtos - Demais ramos - Active",
    Pessoas: "3.1.1.1.1. Pessoas - Active - Chatbot",
    Consórcio: "4.1.1.1. Consórcio - Active - Chatbot",
    Sinistros: "5.1.1.1.1. Chama Seguralta - Active - Chatbot",
    "T.I.": "1.1.1.1. Tecnologia - Active - Chatbot",
    "Comissões e repasses": "6.1.1. Comissão - Active - Chatbot",
    Jurídico: "8.1. Jurídico - Active - Chatbot",
    Financeiro: "10.1.1. Financeiro - Active - Chatbot",
    "Co-corretagem": "7.1.1. Co-corretagem - Active - Chatbot",
    "Parcelas de clientes": "5.1.1.1.1. Chama Seguralta - Active - Chatbot",
    "Pendências de proposta": "5.1.1.1.1. Chama Seguralta - Active - Chatbot",
    "Recusas de propostas": "5.1.1.1.1. Chama Seguralta - Active - Chatbot",
    "Qualidade de dados": "2.1.1.1.3.1 - Qualidade de Dados - Active",
  };

  try {
    const teams = await getUsersTeams();

    let { userIds } = teams.results.find(
      (team) => team.name == teamMapper[areaAtentimento]
    );

    const users = await searchUsersBy(userIds);

    if (users.results.length == 0) {
      console.log("No available agents...");
      return await callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          agentSelected: false,
          agent: null,
          message: "No available agents...",
        },
      });
    }

    const now = new Date();
    const tirtyMinutesAgo = new Date(now.getTime() - 1800000);
    const formattedTirtyMinutesAgo = tirtyMinutesAgo.toISOString();
    const threads = await getThreadsAfter(formattedTirtyMinutesAgo);

    let agentsCapacity = [];

    for (const agent of users.results) {
      const agentEmail = agent.properties.hs_email;

      const concurrentChats = threads.results.filter((thread) => {
        if (thread.assignedTo) {
          return thread.assignedTo == agentEmail && thread.status == "OPEN";
        }
      });
      const concurrentChatsNumber = concurrentChats.length;

      agentsCapacity.push({
        agentEmail,
        capacity: 4 - concurrentChatsNumber,
      });
    }

    console.log("available agents", agentsCapacity);
    const agentsWithCapacity = agentsCapacity.filter(
      (agent) => agent.capacity > 0
    );

    console.log("agents with capacity", agentsWithCapacity);
    if (agentsWithCapacity.length == 0) {
      console.log("Agents with full capacity...");
      return await callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          agentSelected: false,
          agent: null,
          message: "Agents with full capacity...",
        },
      });
    }

    const agent = selectAgent(agentsWithCapacity);

    return await callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        agentSelected: true,
        agent: agent.agentEmail,
        message: "Agent selected successfully.",
      },
    });
  } catch (err) {
    await callback({
      outputFields: { hs_execution_state: "FAIL_CONTINUE" },
    });
    console.error("ERRO:", err.message);
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
      areaAtentimento: "Parcelas de clientes",
    },
    object: { objectId: "" },
  },
  console.log
);
