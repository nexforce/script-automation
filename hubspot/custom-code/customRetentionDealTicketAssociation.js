const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const axios = require("axios");

// Detalhe: Parece que os valores da Sandbox são iguais aos em produção
const allowedTicketPipelines = [
  '22353318', // 04. PS - Onboarding & Ongoing - Canais
  '21659021', // 03. CS - Onboarding & Ongoing - Coach & Consultor
  '15984190', // 01. CS - Onboarding - CSI
  '31361192', // 07. CS - Onboarding & Ongoing - Enterprise
  '16281478', // 01.01. CS - Ongoing - Gestão Pro / Performance + Engagement
  '21696403', // 01.02. CS - Ongoing Assessment / Recruiter
  '21827360', // 02. CS - Onboarding & Ongoing - Tech Touch
];

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.accessToken,
  });

  async function getAssociatedRecordIds(fromObject, toObject, fromObjectId) {
    const BatchInputPublicObjectId = { inputs: [{ id: fromObjectId }] };
  
    const associatedRecordsResponse =
      await hubspotClient.crm.associations.batchApi.read(
        fromObject,
        toObject,
        BatchInputPublicObjectId
      );
  
    const associatedRecordsArray = (
      ((associatedRecordsResponse || {}).results || [])[0] || {}
    ).to;
  
    if (!associatedRecordsArray)
      // Erro ao buscar records associados
      return callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          error: JSON.stringify({ associatedRecordsResponse }),
        },
      });
  
    const associatedRecordIds = associatedRecordsArray.map((t) => t.id);

    return associatedRecordIds;
  }

  try {
    const contactId = event.object.objectId;

    const associatedCompanyIds = await getAssociatedRecordIds("contacts", "companies", contactId);
    const associatedDealIds = await getAssociatedRecordIds("contacts", "deals", contactId);

    console.log(associatedCompanyIds);
    console.log(associatedDealIds);

    for (const companyId of associatedCompanyIds) {
      const associatedTicketIds = await getAssociatedRecordIds("companies", "tickets", companyId);

      const associatedTicketsDataResponse = await Promise.all(
        associatedTicketIds.map((id) =>
          hubspotClient.crm.tickets.basicApi.getById(id)
        )
      );

      console.log(associatedTicketsDataResponse);

      if (!associatedTicketsDataResponse.every(r => !!(((r || {}).properties || {}).hs_pipeline)))
        // Não foi possível obter algum dos dados dos tickets
        return callback({
          outputFields: { hs_execution_state: "FAIL_CONTINUE" },
          error: JSON.stringify({ associatedTicketsDataResponse }),
        });

      const ticketPipelineDataResponses = await Promise.all(
        allowedTicketPipelines.map((id) =>
          hubspotClient.crm.pipelines.pipelinesApi.getById("ticket", id)
        )
      );

      const filteredTickets = associatedTicketsDataResponse.filter((r) =>
        ticketPipelineDataResponses.some(
          (p) =>
            p.id === r.properties.hs_pipeline &&
            p.stages.find((s) => s.id === r.properties.hs_pipeline_stage).metadata
              .ticketState === "OPEN"
        )
      );

      console.log(filteredTickets)

      for (const { id: ticketId } of filteredTickets) {
        for (const dealId of associatedDealIds) {
          const batchInputPublicDealTicketAssociation = {
            inputs: [
              {
                _from: { id: dealId },
                to: { id: ticketId },
                type: "deal_to_ticket",
              },
            ],
          };

          const dealTicketAssociationResponse =
            await hubspotClient.crm.associations.batchApi.create(
              "deals",
              "tickets",
              batchInputPublicDealTicketAssociation
            );

          const associationStatus = (dealTicketAssociationResponse || {}).status;

          if (associationStatus !== "COMPLETE")
            // Erro ao criar associação
            return callback({
              outputFields: {
                hs_execution_state: "FAIL_CONTINUE",
                error: JSON.stringify({ dealTicketAssociationResponse }),
              },
            });
        }
      }

      return callback({
        outputFields: { hs_execution_state: "SUCCESS" },
      });
    }
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
  { inputFields: {}, object: { objectId: 71851 } },
  console.log
);
