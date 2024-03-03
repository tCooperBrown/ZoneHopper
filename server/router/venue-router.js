const { Router } = require("express");
const { Request, Response } = require("express");
const controller = require("../controller/controller");

const venueRouter = Router();

venueRouter.post("/", controller.validateCoordSubmission);

module.exports = venueRouter;
