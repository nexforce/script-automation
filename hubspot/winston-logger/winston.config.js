const winston = require("winston");

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: "nx-hubspot-service-log" },
  transports: [
    new winston.transports.File({ filename: "operation.log" }),
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
  ],
});

module.exports = logger;
