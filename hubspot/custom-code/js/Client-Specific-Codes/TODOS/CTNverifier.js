const axios = require('axios');

exports.main = async (event, callback) => {
  const {hubspot_owner_id, dealname} = event.inputFields; //-> VAI RECEBER DO WORKFLOW, NOME DO CAMPO COM NOME INTERNO ERRADO? INTERNAL_NAME = hubspot_owner_id 
 //TODO: buscar na api de search deals que possuem o husbpot_owner_id = hubspot_owner_id e franquiactn = conhecida
  const {objectId} = event.object //deal a ser atualizado, que entrou no workflow
  // procurar na api de search como fazer as pesquisas
  console.log('hubspot_owner_id', hubspot_owner_id);
  console.log('dealId',  dealname);

  const hubspotApiKey = process.env.NX_OPERATIONS; // precisa ser criada -> só tem a NX_DEV
  if (!hubspotApiKey) {
    callback({
      errorMessage: 'Chave de API não configurada. Verifique as variáveis de ambiente.',
    });
    return;
  }

  const config = {
    headers: {
      Authorization: `Bearer ${hubspotApiKey}`,
    },
  };

  try {

    // 2. Buscar negócios relacionados ao id do proprietário -- modificar para pegar franquia ctn conhecida
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
                value: '89742134' // internal name do dropdown select, properties -> deal -> pipeline -> internalname
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
      callback({
        outputFields: {
          message: 'Nenhum negócio encontrado para este proprietário.',
        },
      });
      return;
    }

    const franquiaCTNs = deals
      .map((deal) => deal.properties?.franquiactn)
      .filter((ctn) => ctn);

    const franquiaCTNClinica = franquiaCTNs.join(', ');

    console.log('Franquia CTN Clínica encontrada:', franquiaCTNClinica);
    // 3. Atualizar o negócio inscrito
    const dealUpdateUrl = `https://api.hubapi.com/crm/v3/objects/deals/${objectId}`;
    const updateBody = {
      properties: {
        franquiactn: franquiaCTNClinica || 'Nenhuma Franquia CTN encontrada',
      },
    };

    console.log('Atualizando o negócio com ID:', objectId);
    await axios.patch(dealUpdateUrl, updateBody, config);
    console.log('Negócio atualizado com sucesso.');

    // 4. Retornar os dados
    callback({
      outputFields: {
        franquiaCTNClinica: franquiaCTNClinica || 'Nenhuma Franquia CTN encontrada',
        updateMessage: `Negócio com ID ${objectId} atualizado com sucesso.`,
      },
    });
  } catch (error) {
    console.error('Erro durante a execução:', error.response?.data || error.message);
    callback({
      errorMessage: `Erro ao processar a solicitação: ${error.response?.data?.message || error.message}`,
    });
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