const axios = require("axios").default;

axios.defaults.baseURL = process.env.PROTHEUS_URI;

exports.main = async (_, callback) => {
  try {
    const response = await axios.post("/api/oauth2/v1/token", undefined, {
      params: {
        grant_type: "password",
        username: process.env.PROTHEUS_USER,
        password: process.env.PROTHEUS_PASSWORD,
      },
    });

    return await callback({
      outputFields: {
        protheusToken: JSON.stringify(response.data),
      },
    });
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      if (error.code === "ETIMEDOUT") {
        console.error(
          `IP não liberado no Protheus: ${JSON.stringify(
            (await axios.get("https://myip.wtf/json")).data
          )}`
        );
        throw {};
      }
    } else {
      throw error;
    }
  }
};
