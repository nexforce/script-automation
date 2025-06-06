const dotenv = require("dotenv");

// Uses the .env file to get the accessToken (Important: never commit the accessToken to the repository!)
dotenv.config();

// When sending to the custom code workflow, copy from this line to the comment [FINAL]
const distributorsData = {
  "02341467000120": {
    distributorName: "AMAZONAS",
    concessionaireCode: 2,
  },
  86439510000185: {
    distributorName: "ANITA GARIBALDI",
    concessionaireCode: 75,
  },
  30460297000139: {
    distributorName: "CASTRO",
    concessionaireCode: 103,
  },
  "05965546000109": {
    distributorName: "CEA",
    concessionaireCode: 7,
  },
  "07522669000192": {
    distributorName: "CEB",
    concessionaireCode: 9,
  },
  60196987000193: {
    distributorName: "CEDRAP",
    concessionaireCode: 89,
  },
  "08467115000100": {
    distributorName: "CEEE",
    concessionaireCode: 10,
  },
  86444163000189: {
    distributorName: "CEGERO",
    concessionaireCode: 104,
  },
  "08336783000190": {
    distributorName: "CELESC",
    concessionaireCode: 11,
  },
  87776043000141: {
    distributorName: "CELETRO",
    concessionaireCode: 105,
  },
  10835932000108: {
    distributorName: "CELPE",
    concessionaireCode: 14,
  },
  "06981180000116": {
    distributorName: "CEMIG",
    concessionaireCode: 18,
  },
  "06981176000158": {
    distributorName: "CEMIG",
    concessionaireCode: 18,
  },
  45955360000185: {
    distributorName: "CEMIG SIM",
    concessionaireCode: null,
  },
  52777034000190: {
    distributorName: "CEMIRIM",
    concessionaireCode: 106,
  },
  78274610000170: {
    distributorName: "CEPRAG",
    concessionaireCode: 90,
  },
  "09364804000144": {
    distributorName: "CERACA",
    concessionaireCode: 68,
  },
  28610236000169: {
    distributorName: "CERAL",
    concessionaireCode: 107,
  },
  10532365000110: {
    distributorName: "CERAL",
    concessionaireCode: 77,
  },
  86433042000131: {
    distributorName: "CERBRANORTE",
    concessionaireCode: 67,
  },
  76879295000180: {
    distributorName: "CERCAR",
    concessionaireCode: null,
  },
  27707397000102: {
    distributorName: "CERCI",
    concessionaireCode: 108,
  },
  31465487000101: {
    distributorName: "CERES",
    concessionaireCode: 80,
  },
  97505838000179: {
    distributorName: "CERFOX",
    concessionaireCode: 109,
  },
  "01229747000189": {
    distributorName: "CERGAPA",
    concessionaireCode: 91,
  },
  86449170000173: {
    distributorName: "CERGRAL",
    concessionaireCode: 70,
  },
  "03747565000125": {
    distributorName: "CERGRAND",
    concessionaireCode: null,
  },
  87656989000174: {
    distributorName: "CERILUZ",
    concessionaireCode: 92,
  },
  50235449000107: {
    distributorName: "CERIM",
    concessionaireCode: 87,
  },
  49606312000132: {
    distributorName: "CERIPA",
    concessionaireCode: 86,
  },
  86533346000170: {
    distributorName: "CERMOFUL",
    concessionaireCode: 94,
  },
  53176038000186: {
    distributorName: "CERNHE",
    concessionaireCode: 79,
  },
  76202779000190: {
    distributorName: "CERPA",
    concessionaireCode: null,
  },
  85318640000105: {
    distributorName: "CERPALO",
    concessionaireCode: 69,
  },
  44560381000139: {
    distributorName: "CERPRO",
    concessionaireCode: 83,
  },
  46598678000119: {
    distributorName: "CERRP",
    concessionaireCode: 78,
  },
  86512670000102: {
    distributorName: "CERSUL",
    concessionaireCode: 72,
  },
  97839922000129: {
    distributorName: "CERTAJA",
    concessionaireCode: 76,
  },
  "09257558000121": {
    distributorName: "CERTEL",
    concessionaireCode: 95,
  },
  98042963000152: {
    distributorName: "CERTHIL",
    concessionaireCode: 111,
  },
  76583962000182: {
    distributorName: "CERTREL",
    concessionaireCode: 96,
  },
  55188502000180: {
    distributorName: "CERVAM",
    concessionaireCode: 112,
  },
  "01377555000110": {
    distributorName: "CHESP",
    concessionaireCode: 23,
  },
  75805895000130: {
    distributorName: "COCEL",
    concessionaireCode: 27,
  },
  15139629000194: {
    distributorName: "COELBA",
    concessionaireCode: 28,
  },
  "03487121000106": {
    distributorName: "COESO",
    concessionaireCode: null,
  },
  83646653000170: {
    distributorName: "COOPERA",
    concessionaireCode: 73,
  },
  83647990000181: {
    distributorName: "COOPERALIANÇA",
    concessionaireCode: 30,
  },
  86532348000145: {
    distributorName: "COOPERCOCAL",
    concessionaireCode: 97,
  },
  95824322000161: {
    distributorName: "COOPERLUZ",
    concessionaireCode: 24,
  },
  88022918000182: {
    distributorName: "COOPERNORTE",
    concessionaireCode: 114,
  },
  87462750000163: {
    distributorName: "COOPERSUL",
    concessionaireCode: 115,
  },
  78829843000192: {
    distributorName: "COOPERZEM",
    concessionaireCode: 116,
  },
  86448057000173: {
    distributorName: "COORSEL",
    concessionaireCode: 66,
  },
  "04368898000106": {
    distributorName: "COPEL",
    concessionaireCode: 31,
  },
  90660754000160: {
    distributorName: "COPREL",
    concessionaireCode: 99,
  },
  "08324196000181": {
    distributorName: "COSERN",
    concessionaireCode: 32,
  },
  33050196000188: {
    distributorName: "CPFL PAULISTA",
    concessionaireCode: 35,
  },
  "04172213000151": {
    distributorName: "CPFL PIRATININGA",
    concessionaireCode: 36,
  },
  53859112000169: {
    distributorName: "CPFL SANTA CRUZ",
    concessionaireCode: 24,
  },
  61116265000306: {
    distributorName: "CPFL SANTA CRUZ",
    concessionaireCode: 24,
  },
  53859112004407: {
    distributorName: "CPFL SANTA CRUZ",
    concessionaireCode: 24,
  },
  53859112004660: {
    distributorName: "CPFL SANTA CRUZ",
    concessionaireCode: 24,
  },
  91950261000128: {
    distributorName: "CRELUZ",
    concessionaireCode: 100,
  },
  89435598000155: {
    distributorName: "CRERAL",
    concessionaireCode: 101,
  },
  95289500000100: {
    distributorName: "DEMEI",
    concessionaireCode: 38,
  },
  23664303000104: {
    distributorName: "DME",
    concessionaireCode: 39,
  },
  28152650000171: {
    distributorName: "EDP ES",
    concessionaireCode: 54,
  },
  "02302100000106": {
    distributorName: "EDP SP",
    concessionaireCode: 4,
  },
  86531175000140: {
    distributorName: "EFLUL",
    concessionaireCode: 44,
  },
  "02328280000278": {
    distributorName: "ELEKTRO",
    concessionaireCode: 45,
  },
  "02328280000197": {
    distributorName: "ELEKTRO",
    concessionaireCode: 45,
  },
  88446034000155: {
    distributorName: "ELETROCAR",
    concessionaireCode: 47,
  },
  "07047251000170": {
    distributorName: "ENEL CE",
    concessionaireCode: 29,
  },
  "01543032000104": {
    distributorName: "ENEL GO",
    concessionaireCode: 12,
  },
  33050071000158: {
    distributorName: "ENEL RJ",
    concessionaireCode: 3,
  },
  61695227000193: {
    distributorName: "ENEL SP",
    concessionaireCode: 48,
  },
  "04065033000170": {
    distributorName: "ENERGISA AC",
    concessionaireCode: 46,
  },
  "08826596000195": {
    distributorName: "ENERGISA BORBOREMA",
    concessionaireCode: 53,
  },
  19527639000158: {
    distributorName: "ENERGISA MG",
    concessionaireCode: 50,
  },
  19527639007837: {
    distributorName: "ENERGISA MINAS RIO",
    concessionaireCode: 50,
  },
  15413826000150: {
    distributorName: "ENERGISA MS",
    concessionaireCode: 51,
  },
  "03467321000199": {
    distributorName: "ENERGISA MT",
    concessionaireCode: 17,
  },
  33249046000106: {
    distributorName: "ENERGISA NOVA FRIBURGO",
    concessionaireCode: 50,
  },
  "09095183000140": {
    distributorName: "ENERGISA PB",
    concessionaireCode: 53,
  },
  "05914650000166": {
    distributorName: "ENERGISA RO",
    concessionaireCode: 20,
  },
  13017462000163: {
    distributorName: "ENERGISA SE",
    concessionaireCode: 55,
  },
  "07282377000120": {
    distributorName: "ENERGISA SUL SUDESTE",
    concessionaireCode: 6,
  },
  "07282377008104": {
    distributorName: "ENERGISA SUL SUDESTE",
    concessionaireCode: 6,
  },
  "07282377007051": {
    distributorName: "ENERGISA SUL SUDESTE",
    concessionaireCode: 6,
  },
  25086034000171: {
    distributorName: "ENERGISA TO",
    concessionaireCode: 15,
  },
  12272084000100: {
    distributorName: "EQUATORIAL AL",
    concessionaireCode: 8,
  },
  "06272793000184": {
    distributorName: "EQUATORIAL MA",
    concessionaireCode: 16,
  },
  "04895728000180": {
    distributorName: "EQUATORIAL PA",
    concessionaireCode: 13,
  },
  "06840748000189": {
    distributorName: "EQUATORIAL PI",
    concessionaireCode: 19,
  },
  91982348000187: {
    distributorName: "HIDROPAN",
    concessionaireCode: 57,
  },
  83855973000130: {
    distributorName: "IGUAÇU",
    concessionaireCode: 58,
  },
  86301124000122: {
    distributorName: "JOÃO CESA",
    concessionaireCode: 43,
  },
  60444437000146: {
    distributorName: "LIGHT",
    concessionaireCode: 59,
  },
  97081434000103: {
    distributorName: "MISSÕES",
    concessionaireCode: 93,
  },
  97578090000134: {
    distributorName: "MUX",
    concessionaireCode: 60,
  },
  89889604000144: {
    distributorName: "NOVA PALMA",
    concessionaireCode: null,
  },
  79850574000109: {
    distributorName: "PACTO",
    concessionaireCode: 56,
  },
  "02016440000162": {
    distributorName: "RGE SUL",
    concessionaireCode: 1,
  },
  "02016439000138": {
    distributorName: "RGE SUL",
    concessionaireCode: 1,
  },
  "02341470000144": {
    distributorName: "RORAIMA",
    concessionaireCode: 5,
  },
  27485069000109: {
    distributorName: "SANTA MARIA",
    concessionaireCode: 49,
  },
  13255658000196: {
    distributorName: "SULGIPE",
    concessionaireCode: 62,
  },
  11615872000180: {
    distributorName: "CERSAD",
    concessionaireCode: 110,
  },
};

exports.main = async (event, callback) => {
  try {
    const { cnpj_da_distribuidora } = event.inputFields;

    if (!cnpj_da_distribuidora) {
      throw new Error("CNPJ not provided.");
    }

    const distributor =
      distributorsData[cnpj_da_distribuidora.replace(/\D/g, "")];

    if (!distributor) {
      throw new Error("Distributor not found for the provided CNPJ.");
    }

    return await callback({
      outputFields: {
        distributorName: distributor.distributorName,
        concessionaireCode: distributor.concessionaireCode,
      },
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};
// [FINAL];

exports.main(
  {
    inputFields: {
      cnpj_da_distribuidora: "5/277.7034.0001-90",
    },
    object: { objectId: "" },
  },
  console.log
);
