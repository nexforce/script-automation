const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]

const axios = require("axios").default;

function mapCondPag(condPag) {
  switch (condPag.toUpperCase()) {
    case "A VISTA":
      return "001";
    case "07 DIAS":
      return "002";
    case "10 DIAS":
      return "003";
    case "15 DIAS":
      return "004";
    case "21 DIAS":
      return "005";
    case "28 DIAS":
      return "006";
    case "30 DIAS":
      return "007";
    case "35 DIAS":
      return "008";
    case "45 DIAS":
      return "009";
    case "60 DIAS":
      return "010";
    case "90 DIAS":
      return "011";
    case "VF - 15 / 1 X 30D":
      return "016";
    case "VF - 15 / 2 X 30D":
      return "018";
    case "VF - 15 / 3 X 30D":
      return "019";
    case "COMPRAS 15/30/90/120":
      return "020";
    case "COMPRAS 21/35/42D":
      return "021";
    case "COMPRAS - 21/42 DIAS":
      return "022";
    case "COMPRAS - 28/35 DIAS":
      return "023";
    case "COMPRAS - 28/35/42 D":
      return "024";
    case "COMPRAS - 28/42 DIAS":
      return "025";
    case "COMPRAS - 28/42/56 D":
      return "026";
    case "COMPRAS - 28/56 DIAS":
      return "027";
    case "COMPRAS - 30/45 DIAS":
      return "029";
    case "30/45/60 DIAS":
      return "030";
    case "30/45/60/75 D":
      return "031";
    case "30/60 DIAS":
      return "032";
    case "30/60/90 DIAS":
      return "033";
    case "4 X 30 DIAS":
      return "034";
    case "5 X 30 DIAS":
      return "035";
    case "6 X 30 DIAS":
      return "036";
    case "ANTECIPADO":
      return "039";
    case "COMPRAS - ENTR + 30D":
      return "042";
    case "COMPRAS - 60 DIAS":
      return "043";
    case "COMPRAS - 45/60 DIAS":
      return "046";
    case "7 X 30 DIAS":
      return "047";
    case "ANA NERY 45/60/90":
      return "048";
    case "10 X 30 DIAS":
      return "051";
    case "COMPRAS - ENTR+28/56":
      return "052";
    case "ENTR + 5X 30D":
      return "055";
    case "ENTR + 4 X 28D":
      return "056";
    case "ENTR + 6 X 30D":
      return "057";
    case "ENTR 10 + 3X30D":
      return "058";
    case "60, 90, 120 DIAS":
      return "086";
    case "60/90 DIAS":
      return "099";
    case "COMPRAS - 05 DIAS":
      return "101";
    case "COMPRAS - 20/40 DIAS":
      return "105";
    case "12 X 30/30DIAS":
      return "112";
    case "COMPRAS ENTR+30/60/90":
      return "113";
    case "COMPRAS - ENTR + 45D":
      return "114";
    case "45/60/75 D":
      return "121";
    case "8X 30DIAS":
      return "135";
    case "ENTR 10 + 30/60D":
      return "145";
    case "120 DIAS":
      return "158";
    case "9X 30 DIAS":
      return "166";
    case "SEM PAGAMENTO":
      return "200";
    case "OPME - 10º DIA ÚTIL":
      return "201";
    case "55 DIAS":
      return "204";
    case "CARTÃO DE CRÉDITO":
      return "209";
    case "150 DIAS":
      return "210";
    case "30% ENTR + 90 DIAS":
      return "215";
    case "COMPRAS - 15/45 DIAS":
      return "221";
    case "VF - 15 / 4 X 30D":
      return "223";
    case "VF - 15 / 5 X 30D":
      return "224";
    case "VF - 15 / 6 X 30D":
      return "225";
    case "VF - 15 / 7 X 30D":
      return "226";
    case "VF - 15 / 8 X 30D":
      return "227";
    case "VF - 15 / 9 X 30D":
      return "228";
    case "VF - 15 / 10 X 30D":
      return "229";
    case "VF - 15 / 11 X 30D":
      return "230";
    case "VF - 15 / 12 X 30D":
      return "231";
    case "VIVEO":
      return "232";
    case "MA PAY 30/60/90 DIAS":
      return "233";
    case "MA PAY 28 DIAS":
      return "234";
    case "MA PAY 30 DIAS":
      return "235";
    case "MA PAY 35 DIAS":
      return "236";
    case "MA PAY 45 DIAS":
      return "237";
    case "MA PAY 55 DIAS":
      return "238";
    case "MA PAY 60 DIAS":
      return "239";
    case "MA PAY 30/60 DIAS":
      return "240";
    case "MA PAY 30/45/60 DIAS":
      return "241";
    case "MA PAY 4 X 30 DIAS":
      return "242";
    case "MA PAY 5 X 30 DIAS":
      return "243";
    case "MA PAY 6 X 30 DIAS":
      return "244";
    case "ENTR 50% SALDO 20D":
      return "248";
    case "21X 28 DIAS":
      return "249";
    case "COMPRAS 30% ENT+120D":
      return "250";
    case "60/75/90 DIAS":
      return "251";
    default:
      throw new Error(`Condição de pagamento não mapeada: ${condPag}`);
  }
}

function mapTpFrete(tpFrete) {
  switch (tpFrete) {
    case "CIF":
      return "C";
    case "FOB":
      return "F";
    default:
      throw new Error(`Tipo de frete não mapeado: ${tpFrete}`);
  }
}

function paymentTypeMapper(paymentType) {
  const paymentMapper = {
    Boleto: "BO",
    "Carteira à vista": "R$",
    "Cartão de Crédito": "CC",
    Cheque: "CH",
    "Depósito em CC": "DC",
    "Pague Seguro": "PS",
  };

  return paymentMapper[paymentType];
}

function operationMapper(operationType) {
  const operationMapperObj = {
    "Venda Representada": "R",
    "Cobrança de Locação": "22",
    "Remessa para Locação": "18",
    "Remessa de mercadoria para exposição ou feira": "10",
    "Remessa bonificação, doação ou brinde": "08",
    "Venda de Mercadoria": "01",
    "Remessa em Comodato": "06",
    "Remessa em Mostruário": "11",
    "Remessa para Demonstração": "05",
    "Remessa de Amostra Grátis": "09",
    "Venda E-Commerce": "29",
  };

  return operationMapperObj[operationType];
}

function storageMapper(oper) {
  const storageTypesMapper = {
    "05": "03",
    "06": "03",
    10: "03",
    11: "03",
    29: "05",
  };

  return storageTypesMapper[oper] || "01";
}

async function sendDealToProtheus(body, protheusToken) {
  try {
    const response = await axios.post(
      `${process.env.PROTHEUS_URI}/SalesForce/Pedido`,
      body,
      {
        headers: {
          Authorization: `Bearer ${protheusToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      if (error.code === "ETIMEDOUT") {
        const err = {
          message: `IP não liberado no Protheus: ${JSON.stringify(
            (await axios.get("https://myip.wtf/json")).data
          )}`,
        };

        throw err;
      } else if (error.response?.status == 500) {
        error.response.status = 400;
        error.status = 400;
        const errorMessage =
          error.response.data.meta.errors[0].message[0] ||
          "Erro desconhecido no Protheus.";

        console.error(errorMessage);

        throw new Error(errorMessage);
      } else {
        console.error("Erro na chamada axios: ", JSON.stringify(error.message));
        throw error;
      }
    }

    console.error(
      `Erro ao criar pedido no Protheus: ${JSON.stringify(error.message)}`
    );

    throw error;
  }
}

exports.main = async (event, callback) => {
  try {
    const { protheusToken } = event.inputFields;
    const date = new Date(+event.inputFields.c6_entreg)
      .toISOString()
      .replaceAll("-", "");
    const indexOfT = date.indexOf("T");
    const dateFormatted = date.slice(0, indexOfT);

    const body = {
      filial: event.inputFields.c5_filial,
      pedcli: event.inputFields.c5_pedcli,
      tipo: event.inputFields.c5_tipo,
      condpag: mapCondPag(event.inputFields.c5_condpag),
      forpg: paymentTypeMapper(event.inputFields.c5_forpg),
      obsexpe: event.inputFields.c5_obsexpe,
      obsnfse: event.inputFields.c5_obsnfse,
      vend1: event.inputFields.c5_vend1,
      tpfrete: mapTpFrete(event.inputFields.c5_tpfrete),
      frete: Number.parseFloat(event.inputFields.c5_frete),
      ztplibe: event.inputFields.c5_ztplibe === "Não" ? "2" : "1",
      codzho: String(event.object.objectId),
      ps_id_origem: String(event.object.objectId),
      // licita: event.inputFields.licitacao, -> validar valores (1=PUBLICO;2=PRIVADO;3=BIONEXO;4=OUTROS)
      c5_lojacli: event.inputFields.c5_lojacli,
      c5_cliente: event.inputFields.c5_cliente,
      c5_zidcont: event.inputFields.id_contrato || "",
      itens: JSON.parse(event.inputFields.lineItems).map((lineItem) => ({
        produto: lineItem.properties.hs_sku,
        qtdven: +lineItem.properties.quantity,
        oper: operationMapper(event.inputFields.c6_oper),
        c6_local: storageMapper(operationMapper(event.inputFields.c6_oper)),
        entreg: dateFormatted,
        prunit: Number.parseFloat(lineItem.properties.price),
        prcven: lineItem.properties.hs_discount_percentage
          ? Number.parseFloat(lineItem.properties.price) *
            (1 -
              Number.parseFloat(lineItem.properties.hs_discount_percentage) /
                100)
          : Number.parseFloat(lineItem.properties.price),
      })),
    };

    //console.log(body);
    //stop;

    const protheusResponse = await sendDealToProtheus(body, protheusToken);
    console.log("protheusResponse", protheusResponse);

    const properties = protheusResponse.data.objects[0];
    return await callback({
      outputFields: {
        c5_num: properties.num,
      },
    });
  } catch (err) {
    console.error(err);
    console.error("err", err.message);
    return await callback({
      outputFields: {
        errorMessage: err.message,
      },
    });
  }
};

// [FINAL];

exports.main(
  {
    inputFields: {
      protheusToken: "teste",
      c6_entreg: "1711929600000",
      c5_filial: "FILIAL001",
      c5_pedcli: "123456",
      c5_tipo: "VENDA",
      c5_condpag: "07 dias",
      c5_forpg: "Boleto",
      c5_obsexpe: "Observação de expedição",
      c5_obsnfse: "Observação de NFSe",
      c5_vend1: "Vendedor001",
      c5_tpfrete: "CIF",
      c5_frete: "100.50",
      c5_ztplibe: "Sim",
      c5_lojacli: "001",
      c5_cliente: "CLIENTE001",
      id_contrato: "CONTRATO123",
      c6_oper: "OPER001",
      lineItems:
        '[{"properties": {"hs_sku": "PROD001", "quantity": "10", "price": "50.00", "hs_discount_percentage": "10"}}]',
    },
    object: { objectId: "" },
  },
  console.log
);
