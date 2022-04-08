const MD5 = require("MD5");
const { buildSetup, startCreating } = require("../src/main");

exports.getNewCub = async (req, res) => {
  let date = new Date();
  let DNA = '';
  Object.entries(req.query).forEach(([key, value]) => DNA += value)
  let filename = MD5(DNA);
  buildSetup();
  await startCreating(req.query, filename);
  res.send(filename);
};
