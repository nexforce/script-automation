const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");
const baseUrl = "https://api.hubapi.com";
const token = process.env.LEAD_FIX_APP_TOKEN;

async function searchContactsBy(dates, limit, after) {
  try {
    const url = `${baseUrl}/crm/v3/objects/contacts/search`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const body = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "createdate",
              operator: "BETWEEN",
              highValue: dates[1],
              value: dates[0],
            },
            {
              propertyName: "hs_lead_status",
              operator: "HAS_PROPERTY",
            },
          ],
        },
      ],
      properties: ["email", "hs_object_id", "hs_lead_status"],
      sorts: [
        {
          propertyName: "createdate",
          direction: "ASCENDING",
        },
      ],
      limit,
      after,
    };

    const response = await axios({ url, method: "POST", data: body, headers });

    return response.data;
  } catch (error) {
    console.log("Error getting contacts.");
    throw error;
  }
}

async function getContactLeadsAssociation(ids) {
  try {
    const url = `${baseUrl}/crm/v4/associations/contact/2-29537118/batch/read`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const body = {
      inputs: [...ids],
    };

    const response = await axios({ url, method: "POST", data: body, headers });

    return response.data;
  } catch (error) {
    console.log("Error getting contacts leads associations.");
    throw error;
  }
}

async function getLeadsAssociationsFor(object, ids) {
  try {
    const url = `${baseUrl}/crm/v4/associations/2-29537118/${object}/batch/read`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const body = {
      inputs: [...ids],
    };

    const response = await axios({ url, method: "POST", data: body, headers });

    return response.data;
  } catch (error) {
    console.log(`Error getting leads and ${object} associations.`);
    throw error;
  }
}

function extractIds(data) {
  for (obj of data) {
    const key = Object.keys(obj)[0];

    obj[key] = obj[key].map((object) => object.toObjectId);
  }
  return data;
}

function formatToHubspot(idsToAssociate, type) {
  const payload = idsToAssociate.map((ids) => {
    const key = Object.keys(ids)[0];

    return ids[key].map((id) => {
      return {
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: type,
          },
        ],
        from: {
          id: key,
        },
        to: {
          id,
        },
      };
    });
  });

  return { inputs: payload.flat() };
}

function chunkArray(array, chunkSize) {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }
  return results;
}

async function associateContactWith(object, payload) {
  try {
    const url = `${baseUrl}/crm/v4/associations/contact/${object}/batch/create`;
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await axios({
      url,
      method: "POST",
      data: payload,
      headers,
    });

    return response.data;
  } catch (error) {
    console.log(`Error associating contact and ${object}.`);
    throw error;
  }
}

exports.main = async (event, callback) => {
  try {
    let total = 100;
    let n = 0;
    let after = 0;

    const engagements = [
      { activitie: "call", id: 193 },
      { activitie: "email", id: 197 },
      { activitie: "meeting", id: 199 },
    ];

    // todo -> substituir por n < total
    while (n < total) {
      // todo -> substituir limit por 100
      const contacts = await searchContactsBy(
        ["2024-07-23", "2024-08-30"],
        100,
        after
      );

      total = contacts.total;

      let idsToAssociate = contacts.results.map((contact) => {
        return { [contact.id]: [] };
      });

      const contactIdsToGetAssociations = idsToAssociate.map((objectIds) => {
        return { id: Object.keys(objectIds)[0] };
      });

      const contactsWithLeadsAssociation = await getContactLeadsAssociation(
        contactIdsToGetAssociations
      );

      const leadsIds = contactsWithLeadsAssociation.results.map(
        (contactLead) => {
          return contactLead.to[0].toObjectId;
        }
      );

      const leadsIdsToGetAssociations = leadsIds.map((objectIds) => {
        return { id: objectIds };
      });

      for (engagement of engagements) {
        idsToAssociate = contacts.results.map((contact) => {
          return { [contact.id]: [] };
        });

        const leadsAssociationsByActivity = await getLeadsAssociationsFor(
          engagement.activitie,
          leadsIdsToGetAssociations
        );

        if (leadsAssociationsByActivity.results.length > 0) {
          contactsWithLeadsAssociation.results.forEach((association) => {
            const contactId = association.from.id;
            const leadData = association.to;

            idsToAssociate.forEach((contact) => {
              if (contact[contactId] !== undefined) {
                const activity = leadsAssociationsByActivity.results.find(
                  (leadWithCall) =>
                    leadWithCall.from.id == leadData[0].toObjectId
                );

                if (activity) {
                  contact[contactId] = activity.to;
                }
              }
            });
          });

          idsToAssociate = idsToAssociate.filter((obj) => {
            const key = Object.keys(obj)[0];
            return obj[key.toString()].length !== 0;
          });

          console.log(
            `Ids de contatos na associação de ${engagement.activitie}s`,
            idsToAssociate
          );

          const activityId = extractIds(idsToAssociate);

          const payload = formatToHubspot(activityId, engagement.id);

          if (payload.inputs.length > 100) {
            console.log("Dividindo payload...");
            const chunks = chunkArray(payload.inputs, 100);

            for (const chunk of chunks) {
              console.log("CHUNK AQUI", { inputs: chunk });
              const response = await associateContactWith(
                engagement.activitie,
                { inputs: chunk }
              );

              console.log("Response for association: ", response);
            }
          } else {
            console.log("Payload adequado...");
            const response = await associateContactWith(
              engagement.activitie,
              payload
            );

            console.log("Response for association: ", JSON.stringify(response));
          }
        }
      }

      // todo -> substituir por n += contacts.results.length;
      n += contacts.results.length;

      after = contacts.paging ? contacts.paging.next.after : null;

      if (!after) {
        break;
      }
    }

    return await callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        success: true,
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
    inputFields: {},
    object: { objectId: 2754704043 },
  },
  console.log
);
