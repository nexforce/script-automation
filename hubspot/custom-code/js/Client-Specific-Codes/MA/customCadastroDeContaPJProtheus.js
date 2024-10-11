const axios = require("axios").default;

axios.defaults.baseURL = process.env.PROTHEUS_URI;

exports.main = async (event, callback) => {
  try {
    const { protheusToken } = event.inputFields;

    const protheusResponse = await axios.post(
      "/SalesForce/Cliente",
      {
        cgc: event.inputFields.company_cnpj,
        nome: event.inputFields.company_razaoSocial,
        nreduz: event.inputFields.company_nomeFantasia,
        end: event.inputFields.company_address,
        bairro: event.inputFields.company_bairro,
        est: event.inputFields.company_estado,
        cep: event.inputFields.company_zip,
        cod_mun: event.inputFields.company_codigoDoMunicipio,
        mun: event.inputFields.company_municipio,
        tel: event.inputFields.company_phone,
        inscr: event.inputFields.company_inscricaoEstadual,
        email: event.inputFields.company_email,
        complem: event.inputFields.company_complemento,
        codzho: event.object.objectId,
        pessoa: "J",
        tipo: "F",
        pais: "105",
        conta: "11201001",
        codpais: "01058",
      },
      {
        headers: {
          Authorization: `Bearer ${protheusToken}`,
        },
      }
    );

    if (!protheusResponse.data.meta.sucess) {
      throw `Erro ao criar cliente no Protheus: ${protheusResponse.data.meta.errors}`;
    } else {
      console.log(
        `Código executado com sucesso! Resposta Protheus: ${JSON.stringify(
          protheusResponse.data
        )}`
      );
      const properties = protheusResponse.data.objects[0];

      return await callback({
        outputFields: {
          cod: properties.cod,
          loja: properties.loja,
        },
      });
    }
  } catch (error) {
    console.error(
      `Erro ao criar cliente no Protheus: ${JSON.stringify(error)}`
    );
    throw error.message;
  }
};
