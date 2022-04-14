
const MD5 = require("MD5");
const { buildSetup, startCreating } = require("../hackslips/src/main");

exports.handler = async function (event, context) {
  let date = new Date();
  let DNA = '';
  Object.entries(event.queryStringParameters).forEach(([key, value]) => DNA += value)
  let filename = MD5(DNA);
  buildSetup();
  await startCreating(req.query, filename);
  res.send(filename);
};
