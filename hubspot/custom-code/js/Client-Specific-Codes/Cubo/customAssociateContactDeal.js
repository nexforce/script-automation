const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const axios = require("axios");
const token = process.env.CONTACT_DEAL_ASSOCIATION;
const baseUrl = "https://api.hubapi.com";

async function searchContactBy(email) {
  try {
    const url = `${baseUrl}/crm/v3/objects/contacts/search`;

    const data = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "email",
              operator: "EQ",
              value: email,
            },
          ],
        },
      ],
      properties: ["email", "firstname", "phone"],
    };

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios({ url, method: "POST", data, headers });

    return response.data;
  } catch (error) {
    console.log("Error searching contact:", error.message);
    throw error;
  }
}

async function associateContactDealBy(contactId, dealId) {
  try {
    const url = `${baseUrl}/crm/v3/objects/contacts/${contactId}/associations/deals/${dealId}/4`;

    const headers = {
      Authorization: `Bearer ${token}`,
      ["Content-Type"]: "application/json",
    };

    const response = await axios({ url, method: "PUT", headers });

    return response.data;
  } catch (error) {
    console.log("Error associationg contact deal:", error.message);
    throw error;
  }
}

async function createContactWithAssociation(data, dealId) {
  try {
    const url = `${baseUrl}/crm/v3/objects/contacts`;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const payload = {
      properties: {
        email: data.email,
        firstname: data.firstname,
        phone: data.phone,
      },
      associations: [
        {
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 4,
            },
          ],
          to: {
            id: dealId,
          },
        },
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
    console.log("Error creating contact with deal association:", error.message);
    throw error;
  }
}

exports.main = async (event, callback) => {
  try {
    const searchResult = await searchContactBy(
      event.inputFields.email_empresa_terceirizada
    );

    console.log("searchResult", searchResult);
    if (searchResult.total == 0) {
      console.log("Nenhum contato encontrado.");

      if (
        !event.inputFields.telefone_empresa_terceirizada ||
        !event.inputFields.nome_do_representante_da_empresa_terceirizada
      ) {
        return await callback({
          outputFields: {
            hs_execution_state: "FAIL_CONTINUE",
            information: "Faltam propriedades para criação de um novo contato.",
          },
        });
      }

      const dataToCreateContact = {
        email: event.inputFields.email_empresa_terceirizada,
        firstname:
          event.inputFields.nome_do_representante_da_empresa_terceirizada,
        phone: event.inputFields.telefone_empresa_terceirizada,
      };

      const newContact = await createContactWithAssociation(
        dataToCreateContact,
        event.object.objectId
      );

      return await callback({
        outputFields: {
          hs_execution_state: "SUCCESS",
          information: "Contato criado e associado ao deal.",
          contact: newContact.properties.email,
          deal: event.object.objectId,
        },
      });
    }

    await associateContactDealBy(
      searchResult.results[0].id,
      event.object.objectId
    );

    return await callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        information: "Contato existente associado ao deal.",
        contact: event.inputFields.email_empresa_terceirizada,
        deal: event.object.objectId,
      },
    });
  } catch (err) {
    await callback({
      outputFields: { hs_execution_state: "FAIL_CONTINUE" },
    });
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
    inputFields: {
      email_empresa_terceirizada: "lf.nxtest1@mail.com",
      telefone_empresa_terceirizada: "+5534999999988",
      nome_do_representante_da_empresa_terceirizada: "Luiz Nx Test 1",
    },
    object: { objectId: 19824320859 },
  },
  console.log
);
