const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

const hubspot = require("@hubspot/api-client");

const INTERNAL_DOMAIN = "";

const func = async () => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.accessToken,
  });

  try {
    const allEmailsList =
      await hubspotClient.crm.objects.emails.searchApi.doSearch({
        properties: ["hs_email_headers"],
      });

    console.log("Number total:", allEmailsList.results.length, allEmailsList.results);

    const internalEmailsList = allEmailsList.results.filter((e) => {
      const headers = JSON.parse(e.properties.hs_email_headers);
      return [...headers.to, ...headers.cc].some((e) =>
        e.email.endsWith(INTERNAL_DOMAIN)
      );
    });

    console.log(
      `Number of matched internal (${INTERNAL_DOMAIN}):`,
      internalEmailsList.length
    );

    console.log(`Example:`, internalEmailsList[0]);

    // await hubspotClient.crm.objects.emails.basicApi.archive(internalEmailsList[0].id);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

func(
  {
    inputFields: { franquiactn: "308" },
    object: { objectId: 15652959342 },
  },
  console.log
);