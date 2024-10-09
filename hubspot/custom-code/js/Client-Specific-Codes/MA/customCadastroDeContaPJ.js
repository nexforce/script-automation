const axios = require('axios').default;
const hubspot = require('@hubspot/api-client');

exports.main = async (event) => {
  const client = new hubspot.Client({
    accessToken: process.env.APP_TOKEN,
  });
  const protheusToken = event.inputFields['protheus_token'];

  let companyProperties;
  try {
    const companyResponse = await client.crm.companies.basicApi.getById(
      event.object.objectId,
      [
        'cnpj_',
        'razao_social',
        'nome_fantasia',
        'address',
        'bairro',
        'estado',
        'zip',
        'codigo_do_municipio',
        'municipio',
        'phone',
        'inscricao_estadual',
        'e_mail',
        'complemento',
        'codigo_vendedor',
        'hs_object_id',
      ]
    );

    companyProperties = companyResponse.properties;
  } catch (error) {
    console.error(
      `Erro ao buscar as propriedades da empresa na HubSpot: ${JSON.stringify(
        error
      )}`
    );
    throw error;
  }

  try {
    const protheusResponse = await axios.post(
      `${process.env.PROTHEUS_URI}/rest/SalesForce/Cliente`,
      {
        cgc: companyProperties.cnpj_,
        nome: companyProperties.razao_social,
        nreduz: companyProperties.nome_fantasia,
        end: companyProperties.address,
        bairro: companyProperties.bairro,
        est: companyProperties.estado,
        cep: companyProperties.zip,
        cod_mun: companyProperties.codigo_do_municipio,
        mun: companyProperties.municipio,
        tel: companyProperties.phone,
        incr: companyProperties.inscricao_estadual,
        email: companyProperties.e_mail,
        complem: companyProperties.complemento,
        vend: companyProperties.codigo_vendedor,
        codzho: companyProperties.hs_object_id,
        tipo: 'L',
        pais: '105',
        conta: '11201001',
        codpais: '01058',
      },
      {
        headers: {
          Authorization: `Bearer ${protheusToken}`,
        },
      }
    );

    if (!protheusResponse.data.meta.sucess) {
      throw `Erro ao criar cliente no Protheus: ${protheusResponse.data.meta.errors}`;
    }
  } catch (error) {
    console.error(
      `Erro ao criar cliente no Protheus: ${JSON.stringify(error)}`
    );
    throw error;
  }
};
