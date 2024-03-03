const { Router } = require("express");
const { Request, Response } = require("express");
const controller = require("../controller/controller");

const venuePoolRouter = Router();

venuePoolRouter.get("/", controller.getNearbyVenues);

module.exports = venuePoolRouter;
