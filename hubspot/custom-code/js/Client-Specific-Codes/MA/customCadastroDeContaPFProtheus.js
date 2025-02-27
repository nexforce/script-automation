const axios = require("axios").default;

axios.defaults.baseURL = process.env.PROTHEUS_URI;

const axios = require("axios").default;

axios.defaults.baseURL = process.env.PROTHEUS_URI;

exports.main = async (event, callback) => {
  try {
    const protheusToken = event.inputFields["protheusToken"];

    const body = {
      cgc: event.inputFields.contact_cpf,
      nome: `${event.inputFields.contact_firstName} ${event.inputFields.contact_lastName}`,
      nreduz: `${event.inputFields.contact_firstName}`,
      end: event.inputFields.contact_address,
      bairro: event.inputFields.contact_bairro,
      est: event.inputFields.contact_estado,
      cep: event.inputFields.contact_zip,
      cod_mun: event.inputFields.contact_codigoDoMunicipio,
      mun: event.inputFields.contact_municipio,
      tel: event.inputFields.contact_phone,
      email: event.inputFields.contact_email,
      complem: event.inputFields.contact_complemento || "",
      codzho: event.object.objectId,
      ps_id_origem: event.object.objectId,
      pessoa: "F",
      tipo: "F",
      pais: "105",
      conta: "11201001",
      codpais: "01058",
      inscr: "ISENTO",
      a1_naturez: "111101",
      a1_tpj: "4",
    };

    console.log("Body: ", body);
    // stop;

    const protheusResponse = await axios.post("/SalesForce/Cliente", body, {
      headers: {
        Authorization: `Bearer ${protheusToken}`,
      },
    });

    if (!protheusResponse.data.meta.sucess) {
      const protheusErrors = protheusResponse.data.meta.errors;
      console.error(`Erro ao criar cliente no Protheus: ${protheusErrors}`);

      throw {
        message: protheusErrors,
      };
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
          msblql: properties.msblql,
          id: properties.id,
        },
      });
    }
  } catch (error) {
    let errorMessage;
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
        const typeOfErrorMessage =
          typeof error.response.data.meta.errors[0].message;

        errorMessage =
          typeOfErrorMessage === "string"
            ? error.response.data.meta.errors[0].message ||
              "Erro desconhecido no Protheus."
            : error.response.data.meta.errors[0].message ||
              "Erro desconhecido no Protheus.";

        console.error(errorMessage);
      } else {
        console.error("Erro na chamada axios: ", JSON.stringify(error.message));
        errorMessage = error.message;
      }
    }
    console.error(
      `Erro ao criar cliente no Protheus: ${JSON.stringify(error.message)}`
    );

    await callback({
      outputFields: {
        errorMessage,
      },
    });
  }
};
