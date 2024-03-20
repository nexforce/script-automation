// Ao mandar pro custom code do fluxo, copiar a partir desta linha até o comentário [FINAL]
exports.main = async (event, callback) => {
  if (!event.inputFields["cnpj"]) {
    console.log("Error: CNPJ field was empty");
    return callback({
      outputFields: { hs_execution_state: "FAIL_CONTINUE", formattedCnpj: "" },
    });
  }

  const formattedCnpj = event.inputFields["cnpj"]
    .toString()
    .replace(/[^\d]/g, "");

  return callback({
    outputFields: { hs_execution_state: "SUCCESS", formattedCnpj },
  });
};
// [FINAL]

exports.main(
  {
    inputFields: { cnpj: "12.3-d5" },
    object: {},
  },
  console.log
);
