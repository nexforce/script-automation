const dotenv = require("dotenv");

// Utiliza o arquivo .env para obter o accessToken (Importante: nunca mandar o accessToken para o repositório!)
dotenv.config();

// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
function getRandomNumber(interval) {
  return Math.floor(Math.random() * interval) + 1;
}

exports.main = async (event, callback) => {
  return await callback({
    outputFields: {
      delay: getRandomNumber(15),
      interval: getRandomNumber(105),
    },
  });
};

// [FINAL]

exports.main(
  {
    inputFields: {},
    object: {},
  },
  console.log
);
