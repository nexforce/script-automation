const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");
const axios = require("axios");

const CAMPAIGN_CUSTOM_OBJECT_ID = "2-17677686";
const CAMPAIGN_PROPERTY_ID = "agente_captacao";

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.roundRobinAcessToken,
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

  try {
    const associatedCampaignIdList = await getAssociatedRecordIds(
      "contacts",
      CAMPAIGN_CUSTOM_OBJECT_ID,
      event.object.objectId
    );

    if (!associatedCampaignIdList.length) {
      console.log("Error: no campaign associated with contact");
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    if (associatedCampaignIdList.length > 1) {
      console.log("Error: multiple campaign IDs associated with contact");
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    const [associatedCampaignId] = associatedCampaignIdList;

    const campaignData = await hubspotClient.crm.objects.basicApi.getById(
      CAMPAIGN_CUSTOM_OBJECT_ID,
      associatedCampaignId,
      [
        CAMPAIGN_PROPERTY_ID,
        "beneficios",
        "taxa_de_btc",
        "faixa_de_corretagem",
        "camp_parceiro",
        "nome_da_campanha",
        "account_manager",
        "criado_pela_area",
        "prioridade",
        "classificacao_da_campanha",
        "celula_de_atendimento",
        "camp_lider",
        "cargo_b2c",
        "celula_de_atendimento_b2b",
      ]
    );

    // Definindo campaignProperties
    const campaignProperties = Object.keys(campaignData.properties);

    // Adiciona as propriedades da campanha às propriedades a serem atualizadas no contato
    const contactPropertiesToSet = {};

    if (campaignProperties.includes("beneficios")) {
      contactPropertiesToSet["beneficios_de_captura"] =
        campaignData.properties["beneficios"];
    }

    if (campaignProperties.includes("taxa_de_btc")) {
      contactPropertiesToSet["taxa_btc_de_captura"] =
        campaignData.properties["taxa_de_btc"];
    }

    if (campaignProperties.includes("faixa_de_corretagem")) {
      contactPropertiesToSet["tabela_corretagem_de_captura"] =
        campaignData.properties["faixa_de_corretagem"];
    }

    if (campaignProperties.includes("camp_parceiro")) {
      contactPropertiesToSet["parceiro_de_captura"] =
        campaignData.properties["camp_parceiro"];
    }

    if (campaignProperties.includes("nome_da_campanha")) {
      contactPropertiesToSet["campanha_de_conversao"] =
        campaignData.properties["nome_da_campanha"];
    }

    if (campaignProperties.includes("account_manager")) {
      contactPropertiesToSet["campanha_de_captura__account_manager"] =
        campaignData.properties["account_manager"];
    }

    if (campaignProperties.includes("criado_pela_area")) {
      contactPropertiesToSet["criado_pela_area"] =
        campaignData.properties["criado_pela_area"];
    }

    if (campaignProperties.includes("prioridade")) {
      contactPropertiesToSet["prioridade_do_lead"] =
        campaignData.properties["prioridade"];
    }

    // Verifica a classificação da campanha
    const classificacaoDaCampanha =
      campaignData.properties["classificacao_da_campanha"];

    // Segmenta a execução com base na classificação da campanha
    if (classificacaoDaCampanha === "Comercial") {
      // Executa as ações específicas para a classificação COMERCIAL
      console.log(
        "Classificação da campanha é COMERCIAL. Executando ações específicas..."
      );

      // Adiciona propriedades na lógica de cópia para a classificação COMERCIAL
      if (campaignProperties.includes("celula_de_atendimento")) {
        contactPropertiesToSet["celulas_de_atendimento_de_captura"] =
          campaignData.properties["celula_de_atendimento"];
      }

      if (campaignProperties.includes("camp_lider")) {
        contactPropertiesToSet["lider_campanha"] =
          campaignData.properties["camp_lider"];
      }

      const agenteCaptacaoProp = campaignData.properties[CAMPAIGN_PROPERTY_ID];

      const captureAgentsList = agenteCaptacaoProp.split(";");

      // Filtra apenas os agentes de captação que estão selecionados na campanha
      const selectedCaptureAgents = captureAgentsList.filter((agent) =>
        agenteCaptacaoProp.includes(agent)
      );

      if (selectedCaptureAgents.length === 0) {
        console.log(
          `Erro: Nenhum agente de captação selecionado para a campanha.`
        );
        return callback({
          outputFields: { hs_execution_state: "FAIL_CONTINUE" },
        });
      }

      // Seleciona aleatoriamente um agente de captação da lista filtrada
      const randomAgentEmail =
        selectedCaptureAgents[
          Math.floor(Math.random() * selectedCaptureAgents.length)
        ];

      // Consulta a lista de proprietários (owners) da conta HubSpot
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

      // Encontra o proprietário correspondente na lista de owners
      const selectedOwner = ownersList.find(
        (owner) => owner.email === randomAgentEmail
      );

      if (selectedOwner) {
        const ownerUpdateResponse =
          await hubspotClient.crm.contacts.basicApi.update(
            event.object.objectId,
            {
              properties: { hubspot_owner_id: selectedOwner.id },
            }
          );
        console.log(ownerUpdateResponse);
      } else {
        console.log(
          `Erro: O agente ${randomAgentEmail} não foi encontrado na lista de proprietários.`
        );
        return callback({
          outputFields: { hs_execution_state: "FAIL_CONTINUE" },
        });
      }
    } else if (classificacaoDaCampanha === "B2B") {
      // Executa as ações específicas para a classificação B2B
      console.log(
        "Classificação da campanha é B2B. Executando ações específicas..."
      );

      // Adiciona propriedades na lógica de cópia para a classificação B2B
      if (campaignProperties.includes("celula_de_atendimento_b2b")) {
        // Seleciona aleatoriamente um valor dentre aqueles que estão selecionados na campanha para a propriedade "celula_proprietaria" do contato
        const celulaB2BProp =
          campaignData.properties["celula_de_atendimento_b2b"];
        const options = celulaB2BProp.split(";");
        const selectedOption =
          options[Math.floor(Math.random() * options.length)];

        contactPropertiesToSet["celula_proprietaria"] = selectedOption;
      }
    } else if (classificacaoDaCampanha === "B2C") {
      // Executa as ações específicas para a classificação B2C
      console.log(
        "Classificação da campanha é B2C. Executando ações específicas..."
      );

      // Adiciona propriedades na lógica de cópia para a classificação B2C
      if (campaignProperties.includes("celula_de_atendimento")) {
        // Seleciona aleatoriamente um valor dentre aqueles que estão selecionados na campanha para a propriedade "celula_proprietaria" do contato
        const celulaDeAtendimentoProp =
          campaignData.properties["celula_de_atendimento"];
        const options = celulaDeAtendimentoProp.split(";");
        const selectedOption =
          options[Math.floor(Math.random() * options.length)];

        contactPropertiesToSet["celula_proprietaria"] = selectedOption;
      }

      if (campaignProperties.includes("cargo_b2c")) {
        contactPropertiesToSet["cargo_b2c"] =
          campaignData.properties["cargo_b2c"];
      }
    } else {
      // Caso a classificação não seja nenhuma das esperadas, retorna um erro
      console.log(
        `Erro: Classificação da campanha não reconhecida: ${classificacaoDaCampanha}`
      );
      return callback({
        outputFields: { hs_execution_state: "FAIL_CONTINUE" },
      });
    }

    // Atualiza o contato com as propriedades da campanha, se houver alguma para ser copiada
    if (Object.keys(contactPropertiesToSet).length > 0) {
      const contactUpdateResponse =
        await hubspotClient.crm.contacts.basicApi.update(
          event.object.objectId,
          {
            properties: contactPropertiesToSet,
          }
        );
      console.log(contactUpdateResponse);
    }

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
