const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require('fs')
const resolvePath = require('path').resolve
const path = require('path')
const routes = require("./routes");

const app = express(),
  PORT = process.env.PORT || 5000;

app.use(cors());
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);

app.use('/cubz', express.static(path.join(__dirname, './build/gifs')))

app.listen(PORT, (err) => {
  if (err) return console.log(`failed to start server on port ${PORT}`);
  console.log(`server starting on port ${PORT}`);
});
