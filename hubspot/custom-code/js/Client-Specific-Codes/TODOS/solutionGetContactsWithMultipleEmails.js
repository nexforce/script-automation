const dotenv = require("dotenv");
const axios = require("axios");
const logger = require("../../../../winston-logger/winston.config");

dotenv.config();

const token = process.env.NX_OPERATIONS;
const baseUrl = "https://api.hubapi.com/crm/v3/objects";

async function searchContactsWithAdditionalEmails(
  limit = 200,
  after = 0,
  id = 0
) {
  try {
    const url = `${baseUrl}/contacts/search`;

    const body = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "hs_additional_emails",
              operator: "HAS_PROPERTY",
            },
            {
              propertyName: "hs_object_id",
              operator: "GT",
              value: id || 0,
            },
          ],
        },
      ],
      properties: ["hs_additional_emails", "email"],
      sorts: [
        {
          propertyName: "id",
          direction: "ASCENDING",
        },
      ],
      limit,
      after,
    };

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({ method: "POST", url, data: body, headers });

    return response.data;
  } catch (error) {
    console.error(error.message);

    const errorMessage =
      error.response?.data?.message || "Unknown error searching contacts.";

    throw new Error(errorMessage);
  }
}

async function updateBatchContactsBy(ids) {
  try {
    const url = `${baseUrl}/contacts/batch/update`;

    const body = {
      inputs: ids.map((id) => {
        return {
          id,
          properties: {
            has_multiple_additional_emails: true,
          },
        };
      }),
    };

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({ method: "POST", url, data: body, headers });

    return response.data;
  } catch (error) {
    console.error(error.message);

    const errorMessage =
      error.response?.data?.message || "Unknown error updating contacts.";

    throw new Error(errorMessage);
  }
}

function logUpdatedContacts(updatedContacts) {
  logger.log({
    level: "info",
    message: {
      date: new Date(),
      updatedContacts: updatedContacts.results.map((contact) => {
        return {
          createdate: contact.properties.createdate,
          has_multiple_additional_emails:
            contact.properties.has_multiple_additional_emails,
          hs_object_id: contact.properties.hs_object_id,
        };
      }),
    },
  });
}

function waitFor(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

exports.main = async () => {
  try {
    const limit = 200;
    const batchSize = 100;
    let after = null;
    let startId = null;

    let filteredContacts = [];
    let totalContacts = 0;
    let numberOfReadContacts = 0;
    let numberOfUpdatedContacts = 0;

    do {
      const contacts = await searchContactsWithAdditionalEmails(
        limit,
        after,
        startId
      );

      if (totalContacts === 0) {
        totalContacts = contacts.total;
        console.log("Número total de contatos:", totalContacts);
      }

      numberOfReadContacts += contacts.results.length;

      const filteredResults = contacts.results.filter((contact) =>
        contact.properties.hs_additional_emails.includes(";")
      );

      filteredContacts.push(...filteredResults);
      console.log(
        "Número de contatos filtrados nesta chamada:",
        filteredResults.length
      );

      if (contacts.paging?.next?.after >= 10000) {
        console.log(`Atingiu ${contacts.paging?.next?.after} resultados...`);
        after = null;
        startId = contacts.results[contacts.results.length - 1].id;
      } else {
        after = contacts.paging?.next?.after;
      }

      console.log(
        "Número total de contatos filtrados até o momento:",
        filteredContacts.length
      );

      if (filteredContacts.length >= batchSize) {
        while (filteredContacts.length >= batchSize) {
          const contactsToUpdate = filteredContacts.splice(0, batchSize);

          let contactIds = contactsToUpdate.map((contact) => contact.id);
          console.log("Atualizando contatos...", contactIds);
          const updatedContacts = await updateBatchContactsBy(contactIds);
          logUpdatedContacts(updatedContacts);

          numberOfUpdatedContacts += updatedContacts.results.length;
        }

        if (filteredContacts.length > 0) {
          const contactIds = filteredContacts.map((contact) => contact.id);
          console.log(
            "Atualizando contatos restantes fora do batch...",
            contactIds
          );
          const updatedContacts = await updateBatchContactsBy(contactIds);
          logUpdatedContacts(updatedContacts);

          numberOfUpdatedContacts += updatedContacts.results.length;
        }

        filteredContacts = [];
      }

      await waitFor(0.2);
      console.log("Continuando looping...");
    } while (numberOfReadContacts < totalContacts);

    if (filteredContacts.length > 0) {
      const contactIds = filteredContacts.map((contact) => contact.id);

      console.log("Atualizando contatos após looping...", contactIds);
      const updatedContacts = await updateBatchContactsBy(contactIds);
      logUpdatedContacts(updatedContacts);

      numberOfUpdatedContacts += updatedContacts.results.length;
    }

    console.log("AÇÃO FINALIZADA, contatos lidos: ", numberOfReadContacts);
    console.log(
      "AÇÃO FINALIZADA, contatos atualizados: ",
      numberOfUpdatedContacts
    );
  } catch (err) {
    console.error(err);

    throw err;
  }
};

exports.main(
  {
    inputFields: {},
    object: {},
  },
  console.log
);
