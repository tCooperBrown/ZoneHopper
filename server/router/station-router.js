const { Router } = require("express");
const { Request, Response } = require("express");
const controller = require("../controller/controller");

const stationRouter = Router();

stationRouter.get("/", controller.retrieveCachedStations);

module.exports = stationRouter;
