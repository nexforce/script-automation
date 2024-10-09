const axios = require('axios').default;
const hubspot = require('@hubspot/api-client');

exports.main = async (event) => {
  const client = new hubspot.Client({
    accessToken: process.env.APP_TOKEN,
  });

  let contactProperties;
  try {
    const contactResponse = await client.crm.contacts.basicApi.getById(
      event.object.objectId,
      [
        'cpf_',
        'firstname',
        'lastname',
        'address',
        'bairro',
        'estado',
        'zip',
        'codigo_do_municipio',
        'municipio',
        'phone',
        'email',
        'complemento',
        'codigo_vendedor',
        'hs_object_id',
      ]
    );

    contactProperties = contactResponse.properties;
  } catch (error) {
    console.error(
      `Erro ao buscar as propriedades do contato na HubSpot: ${JSON.stringify(
        error
      )}`
    );
    throw error;
  }

  const protheusToken = event.inputFields['protheus_token'];

  try {
    const protheusResponse = await axios.post(
      `${process.env.PROTHEUS_URI}/rest/SalesForce/Cliente`,
      {
        cgc: contactProperties.cpf_,
        nome: `${contactProperties.firstname} ${contactProperties.lastname}`,
        end: contactProperties.address,
        bairro: contactProperties.bairro,
        est: contactProperties.estado,
        cep: contactProperties.zip,
        cod_mun: contactProperties.codigo_do_municipio,
        mun: contactProperties.municipio,
        tel: contactProperties.phone,
        email: contactProperties.email,
        complem: contactProperties.complemento,
        vend: contactProperties.codigo_vendedor,
        codzho: contactProperties.hs_object_id,
        tipo: 'F',
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
