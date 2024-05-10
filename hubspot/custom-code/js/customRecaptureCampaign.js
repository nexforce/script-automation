const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
const hubspot = require("@hubspot/api-client");

exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.CodigoPersonalizadoCampanhadeRecaptura,
  });

  async function getAssociatedCampaigns(contactId) {
    const BatchInputPublicObjectId = { inputs: [{ id: contactId }] };
    const associatedRecordsResponse =
      await hubspotClient.crm.associations.batchApi.read(
        "contacts",
        "2-17677686", // ID do objeto de campanha customizado
        BatchInputPublicObjectId
      );

    const associatedCampaigns =
      (((associatedRecordsResponse || {}).results || [])[0] || {}).to ?? [];

    const campaignDetails = [];
    for (const campaign of associatedCampaigns) {
      const campaignId = campaign.id;
      const campaignData = await hubspotClient.crm.objects.basicApi.getById(
        "2-17677686", // ID do objeto de campanha customizado
        campaignId,
        ["nome_da_campanha", "camp_parceiro"]
      );

      const campaignName = campaignData.properties["nome_da_campanha"];
      const parceiro = campaignData.properties["camp_parceiro"];
      campaignDetails.push(`[${campaignName} // ${parceiro}]`);
    }

    return campaignDetails;
  }

  try {
    // Obtendo o ID do contato
    const contactId = event.object.objectId;

    // Ação 1: Atualizando a propriedade "campanhas_lista" do contato com os nomes das campanhas e parceiros
    const associatedCampaigns = await getAssociatedCampaigns(contactId);
    const contactUpdateResponse =
      await hubspotClient.crm.contacts.basicApi.update(contactId, {
        properties: {
          campanhas_lista: associatedCampaigns.join(", "),
        },
      });

    console.log("Contact updated:", contactUpdateResponse);

    // Ação 2: Recuperação da propriedade "campanhas_lista_antiga" do contato
    const contactData = await hubspotClient.crm.contacts.basicApi.getById(
      contactId,
      ["campanhas_lista_antiga"]
    );
    let oldCampaignList = contactData.properties["campanhas_lista_antiga"];

    // Parse oldCampaignList to array
    oldCampaignList = oldCampaignList
      ? oldCampaignList.match(/\[(.*?)\]/g) || []
      : [];

    console.log("Old campaign list:", oldCampaignList);

    // Ação 3: Realizando comparação entre os valores de campanhas_lista e campanhas_lista_antiga
    const oldCampaignMap = oldCampaignList.reduce((map, item) => {
      const [campaignName, campaignPartner] = item.slice(1, -1).split(" // ");
      map.set(`${campaignName.trim()} // ${campaignPartner.trim()}`, true);
      return map;
    }, new Map());

    const differentCampaign = [];
    for (const campaign of associatedCampaigns) {
      const [campaignName, campaignPartner] = campaign
        .slice(1, -1)
        .split(" // ");
      const key = `${campaignName.trim()} // ${campaignPartner.trim()}`;
      if (!oldCampaignMap.has(key)) {
        differentCampaign.push(campaign);
      }
    }

    console.log("Different campaign:", differentCampaign);

    // Ação 4: Copiando o termo diferente para as propriedades "ultima_campanha_de_reconversao" e "parceiro_de_recaptura" do contato
    if (differentCampaign.length > 0) {
      const [lastCampaignName, lastCampaignPartner] = differentCampaign[0]
        .slice(1, -1)
        .split(" // ");

      console.log("Last campaign name:", lastCampaignName);
      console.log("Last campaign partner:", lastCampaignPartner);

      await hubspotClient.crm.contacts.basicApi.update(contactId, {
        properties: {
          ultima_campanha_de_reconversao: lastCampaignName,
          parceiro_de_recaptura: lastCampaignPartner,
        },
      });
      console.log(
        "Last conversion campaign and partner updated:",
        lastCampaignName,
        lastCampaignPartner
      );
    } else {
      console.log("No difference found in campaigns.");
    }

    return callback({
      outputFields: { hs_execution_state: "SUCCESS" },
    });
  } catch (err) {
    console.error(err);
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
