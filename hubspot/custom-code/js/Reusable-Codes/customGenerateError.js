const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]

exports.main = async (event, callback) => {
  const { errorMessage } = event.inputFields;
  if (errorMessage) {
    throw new Error(errorMessage);
  }

  return;
};

// [FINAL];

exports.main(
  {
    inputFields: {
      errorMessage: "Teste",
    },
    object: { objectId: "" },
  },
  console.log
);
