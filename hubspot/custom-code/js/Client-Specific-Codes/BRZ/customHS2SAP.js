const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]

const axios = require("axios");
const secret = process.env.SAP_C4C_CONTACTS;
const baseUrlHs = "https://api.hubapi.com/crm/v3/";
const baseUrlSap = "https://my353906.crm.ondemand.com/sap/c4c/odata/";

async function getContactBy(id) {
  try {
    const url = `${baseUrlHs}objects/contacts/search`;
    const headers = { authorization: `Bearer ${secret}` };
    const data = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "hs_object_id",
              operator: "EQ",
              value: id,
            },
          ],
        },
      ],
      properties: [
        "firstname",
        "lastname",
        "email",
        "phone",
        "interesse",
        "empreendimento",
        "renda",
        "sdr",
        "hubspot_owner_id",
        "valor_fgts",
        "valor_de_entrada",
        "origem",
      ],
    };

    const contact = await axios({ url, method: "POST", headers, data });

    return contact.data;
  } catch (err) {
    console.error("Erro ao obter contato no Hubspot.");
    throw err;
  }
}

async function getOwnerBy(id) {
  try {
    const url = `${baseUrlHs}owners/${id}`;
    const headers = { authorization: `Bearer ${secret}` };

    const owner = await axios({ url, method: "GET", headers });

    return owner.data;
  } catch (err) {
    console.error("Erro ao obter contato no Hubspot.");
    throw err;
  }
}

async function getOwnerOnSapBy(email) {
  try {
    const username = process.env.USERNAME_SAP;
    const password = process.env.PASSWORD_SAP;

    const base64Credentials = Buffer.from(`${username}:${password}`).toString(
      "base64"
    );

    const url = `${baseUrlSap}v1/employeeanduser/EmployeeCollection?$format=json&$search=${email}`;
    const headers = {
      authorization: `Basic ${base64Credentials}`,
      ["Content-Type"]: "application/json",
    };

    const employee = await axios({ url, method: "GET", headers });

    return employee.data;
  } catch (err) {
    console.error("Erro ao buscar employee no SAP.");
    throw err;
  }
}

async function createLeadOnSap(data) {
  try {
    const username = process.env.USERNAME_SAP;
    const password = process.env.PASSWORD_SAP;

    const base64Credentials = Buffer.from(`${username}:${password}`).toString(
      "base64"
    );

    const url = `${baseUrlSap}v1/lead/LeadCollection`;
    const headers = { authorization: `Basic ${base64Credentials}` };

    const lead = await axios({ url, method: "POST", headers, data });

    return lead.data;
  } catch (err) {
    console.error("Erro ao criar lead no SAP.");
    throw err;
  }
}

exports.main = async (event, callback) => {
  const hs_object_id = event.object.objectId;
  const cityMapper = {
    ["Franca"]: "16200",
    ["Duque de Caxias"]: "1702",
    ["Congonhal"]: "17900",
    ["Itaboraí"]: "1900",
    ["Hortolândia"]: "19071",
    ["Itaguaí"]: "2007",
    ["Divinópolis"]: "22306",
    ["Extrema"]: "25101",
    ["Apaixonados"]: "26",
    ["Leme"]: "26704",
    ["Limeira"]: "26902",
    ["Mogi Guaçu"]: "30706",
    ["Mogi Mirim"]: "30805",
    ["Araraquara"]: "3208",
    ["Araras"]: "3307",
    ["Petrópolis"]: "3906",
    ["Ribeirão Preto"]: "43402",
    ["Santa Bárbara D Oeste"]: "45803",
    ["Patos de Minas"]: "48004",
    ["Poços de Caldas"]: "51800",
    ["São Pedro da Aldeia"]: "5208",
    ["Sumaré"]: "52403",
    ["Pouso Alegre"]: "52501",
    ["Tatuí"]: "54003",
    ["Barretos"]: "5500",
    ["Teresópolis"]: "5802",
    ["Varginha"]: "70701",
    ["Outra cidade"]: "707121",
    ["Lavras"]: "707131",
    ["Nova Serrana"]: "707141",
  };

  try {
    const response = await getContactBy(hs_object_id);
    const contact = response.results[0].properties;
    if (!contact.hubspot_owner_id) {
      return await callback({
        outputFields: {
          hs_execution_state: "FAIL_CONTINUE",
          lead: `Lead não possui owner: ${contact.firstname}`,
        },
      });
    }
    const ownerOnHs = await getOwnerBy(Number(contact.hubspot_owner_id));
    const ownerOnSap = await getOwnerOnSapBy(ownerOnHs.email);

    const leatToSap = {
      Name: `${contact.firstname} ${contact.lastname}`,
      IndividualCustomerGivenName: contact.firstname,
      IndividualCustomerFamilyName: contact.lastname,
      IndividualCustomerEMail: contact.email,
      OwnerPartyID: ownerOnSap.d.results[0].BusinessPartnerID.toString(),
      IndividualCustomerMobile: contact.phone.split("+55").join("+55 "),
      IndividualCustomerAddressCity: contact.interesse,
      Estande_KUT: cityMapper[contact.interesse],
      CreditoFGTS_KUT: contact.valor_fgts,
      Creditorecursosproprios_KUT: contact.valor_de_entrada,
      Midia_KUT: contact.origem,
      Rendamensal_KUT: contact.renda,
      Roletadedistribuicao_KUT: true,
      SDR_KUT: contact.sdr,
    };
    console.log("leatToSap", leatToSap);

    await createLeadOnSap(leatToSap);

    return await callback({
      outputFields: {
        hs_execution_state: "SUCCESS",
        lead: `Lead created: ${leatToSap.Name}`,
      },
    });
  } catch (error) {
    console.log(error);
    callback({
      outputFields: {
        hs_execution_state: "FAIL_CONTINUE",
        lead: null,
      },
    });
    if (
      axios.isAxiosError(error) &&
      JSON.stringify(error).includes("cloudflare")
    )
      error.response.status = 500;

    throw error;
  }
};

// [FINAL]

exports.main(
  {
    inputFields: {},
    object: { objectId: 21636795956 },
  },
  console.log
);
