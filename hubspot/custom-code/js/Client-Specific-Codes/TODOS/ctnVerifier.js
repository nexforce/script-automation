const axios = require('axios');

exports.main = async (event, callback) => {
  const {hubspot_owner_id, dealname} = event.inputFields;
  const {objectId} = event.object;
  console.log('hubspot_owner_id', hubspot_owner_id);
  console.log('dealId',  dealname);

  const hubspotApiKey = process.env.NX_OPERATIONS;
  if (!hubspotApiKey) {
    throw new Error('Chave de API não configurada. Verifique as variáveis de ambiente.');
  }

  const config = {
    headers: {
      Authorization: `Bearer ${hubspotApiKey}`,
    },
  };

  try {
    
    const dealsSearchUrl = `https://api.hubapi.com/crm/v3/objects/deals/search`;
    const searchBody = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'hubspot_owner_id',
              operator: 'EQ',
              value: hubspot_owner_id,
            },
            {
                propertyName: 'franquiactn',
                operator: 'HAS_PROPERTY',
            },
            {
                propertyName: 'pipeline',
                operator: 'EQ',
                value: '89742134'
            }
          ],
        },
      ],
      properties: ['franquiactn'],
    };

    const dealsResponse = await axios.post(dealsSearchUrl, searchBody, config);
    const deals = dealsResponse.data.results;

    console.log('Negócios encontrados:', deals);
    if (!deals || deals.length === 0) {
      throw new Error('Nenhum negócio encontrado para este proprietário.');
    }

    const franquiaCTNs = deals
      .map((deal) => deal.properties?.franquiactn)
      .filter((ctn) => ctn);

    const franquiaCTNClinica = franquiaCTNs.join(', ');

    console.log('Franquia CTN Clínica encontrada:', franquiaCTNClinica);
    const dealUpdateUrl = `https://api.hubapi.com/crm/v3/objects/deals/${objectId}`;
    const updateBody = {
      properties: {
        franquiactn: franquiaCTNClinica || 'Nenhuma Franquia CTN encontrada',
      },
    };

    console.log('Atualizando o negócio com ID:', objectId);
    await axios.patch(dealUpdateUrl, updateBody, config);
    console.log('Negócio atualizado com sucesso.');

    callback({
      outputFields: {
        franquiaCTNClinica: franquiaCTNClinica || 'Nenhuma Franquia CTN encontrada',
        updateMessage: `Negócio com ID ${objectId} atualizado com sucesso.`,
      },
    });
  } catch (error) {
    console.error('Erro durante a execução:', error.response?.data || error.message);
    throw Error(`Erro ao processar a solicitação: ${error.response?.data?.message || error.message}`);
  }
};

// [FINAL]
exports.main(
  {
    inputFields: {
      hubspot_owner_id: "1234567890",
      dealname: "1234567890"
    },
    object: { objectId: 13555162237 },
  },
  console.log
);