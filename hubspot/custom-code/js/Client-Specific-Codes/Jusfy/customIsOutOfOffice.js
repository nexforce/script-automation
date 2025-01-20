const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]

exports.main = async (event, callback) => {
  try {
    const blockedDays = [0, 6];

    const weekDay = new Date().getDay();
    const hours = new Date().getHours();

    const isOutOfOffice =
      blockedDays.some((day) => day == weekDay) || hours >= 18 || hours < 9;

    return await callback({
      outputFields: {
        isOutOfOffice,
      },
    });
  } catch (err) {
    await callback({
      outputFields: { hs_execution_state: "FAIL_CONTINUE" },
    });
    console.error(err);
    // Force retry if error is on cloudflare's side. (https://developers.hubspot.com/docs/api/error-handling#custom-code-workflow-actions)
    if (axios.isAxiosError(err) && JSON.stringify(err).includes("cloudflare"))
      err.response.status = 500;
    // We will automatically retry when the code fails because of a rate limiting error from the HubSpot API.
    throw err;
  }
};

// [FINAL]

exports.main(
  {
    inputFields: {},
    object: {
      objectId: "",
    },
  },
  console.log
);
