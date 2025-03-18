const axios = require("axios").default;

axios.defaults.baseURL = process.env.PROTHEUS_URI;

exports.main = async (event, callback) => {
  try {
    const { protheusToken } = event.inputFields;
    const body = {
      cgc: event.inputFields.company_cnpj,
      nome: event.inputFields.company_razaoSocial,
      nreduz:
        event.inputFields.company_nomeFantasia.length > 30
          ? event.inputFields.company_nomeFantasia.slice(0, 30)
          : event.inputFields.company_nomeFantasia,
      end: event.inputFields.company_address,
      bairro: event.inputFields.company_bairro,
      est: event.inputFields.company_estado,
      cep: event.inputFields.company_zip,
      cod_mun: event.inputFields.company_codigoDoMunicipio,
      mun: event.inputFields.company_municipio,
      tel: event.inputFields.company_phone,
      inscr: event.inputFields.company_inscricaoEstadual,
      email: event.inputFields.company_email,
      complem: event.inputFields.company_complemento || "",
      codzho: event.object.objectId,
      ps_id_origem: event.object.objectId,
      pessoa: "J",
      tipo: "F",
      pais: "105",
      conta: "11201001",
      codpais: "01058",
    };

    console.log(body);
    //stop;

    const protheusResponse = await axios.post("/SalesForce/Cliente", body, {
      headers: {
        Authorization: `Bearer ${protheusToken}`,
      },
    });
    console.log("RESPOSTA DO PROTHEUS: ", protheusResponse);

    if (!protheusResponse.data.meta.sucess) {
      throw new Error(
        `Erro ao criar cliente no Protheus: ${protheusResponse.data.meta.errors}`
      );
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
          risco: properties.risco,
          msblql: properties.msblql,
          id: properties.id,
        },
      });
    }
  } catch (error) {
    let errorMessage;
    console.error("ERRO DO catch");
    if (error instanceof axios.AxiosError) {
      if (error.code === "ETIMEDOUT") {
        const err = {
          message: `IP não liberado no Protheus: ${JSON.stringify(
            (await axios.get("https://myip.wtf/json")).data
          )}`,
        };

        console.error(err.message);

        errorMessage = error.message;
      } else if (error.response?.status == 500) {
        error.response.status = 400;
        error.status = 400;
        console.error("ERRO:", error.response.data);
        const typeOfErrorMessage =
          typeof error.response.data?.meta?.errors[0].message;

        errorMessage =
          typeOfErrorMessage === "string"
            ? error.response.data.meta.errors[0].message ||
              "Erro desconhecido no Protheus."
            : error.response.data?.meta?.errors[0].message ||
              "Erro desconhecido no Protheus.";

        console.error(errorMessage);

        throw new Error(errorMessage);
      } else {
        console.error("Erro na chamada axios: ", JSON.stringify(error.message));
        errorMessage = error.message;
      }
    } else {
      console.error(
        `Erro ao criar cliente no Protheus: ${JSON.stringify(error.message)}`
      );
      errorMessage = `Erro ao criar cliente no Protheus: ${JSON.stringify(
        error.message
      )}`;
    }

    await callback({
      outputFields: {
        errorMessage,
      },
    });
  }
};
