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
      throw `Condição de pagamento não mapeada: ${condPag}`;
  }
}

function mapTpFrete(tpFrete) {
  switch (tpFrete) {
    case "CIF":
      return "C";
    case "FOB":
      return "F";
    default:
      throw `Tipo de frete não mapeado: ${tpFrete}`;
  }
}

exports.main = async (event) => {
  const protheusToken = event.inputFields["protheus_token"];

  try {
    const protheusResponse = await axios.post(
      `${process.env.PROTHEUS_URI}/rest/SalesForce/Pedido`,
      {
        filial: event.inputFields.deal_c5_filial,
        pedcli: event.inputFields.deal_c5_pedcli,
        tipocli: event.inputFields.deal_c5_tipocli,
        tipo: event.inputFields.deal_c5_tipo,
        condpag: mapCondPag(event.inputFields.deal_c5_condpag),
        forpg: event.inputFields.deal_c5_forpg,
        obsexpe: event.inputFields.deal_c5_obsexpe,
        obsnfse: event.inputFields.deal_c5_obsnfse,
        vend1: event.inputFields.deal_c5_vend1,
        tpfrete: mapTpFrete(event.inputFields.deal_c5_tpfrete),
        frete: event.inputFields.deal_c5_frete,
        ztplibe: event.inputFields.deal_c5_ztplibe,
        codzho: event.object.objectId,
        oper: event.inputFields.deal_c6_oper,
        entreg: event.inputFields.deal_c6_entreg,
        licita: event.inputFields.deal_licitacao,
        itens: JSON.parse(event.inputFields.lineItems).map((lineItem) => ({
          item: "01", // TODO
          produto: lineItem.properties.hs_sku,
          qtdven: lineItem.properties.quantity,
          tes: "50E", // TODO
          entreg: event.inputFields.deal_c6_entreg,
          prunit: Number.parseFloat(lineItem.properties.amount),
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${protheusToken}`,
        },
      }
    );

    if (!protheusResponse.data.meta.sucess) {
      throw `Erro ao criar pedido no Protheus: ${protheusResponse.data.meta.errors}`;
    }
  } catch (error) {
    console.error(`Erro ao criar pedido no Protheus: ${JSON.stringify(error)}`);
    throw error;
  }
};
