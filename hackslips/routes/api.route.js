const { apiController } = require("../controllers");
const Router = require("express").Router;
const router = new Router();

router.get("/evolve", apiController.getNewCub);

module.exports = router;
