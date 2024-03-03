// const { Express } = require("express");
const { Router } = require("express");
const stationRouter = require("./station-router");
const venueRouter = require("./venue-router");
const venuePoolRouter = require("./venue-pool-router");
const discoveryRouter = require("./discovery-router");

// router.get("/placePhoto/:id", controller.queryPhotoCache);

const rootRouter = Router();
rootRouter.all("*", (_, res) => {
  return res.status(404).send("Route does not exist");
});

const setRouting = (app) => {
  app.use("/tube-stations", stationRouter);
  app.use("/validate-coordinates", venueRouter);
  app.use("/venue-pool", venuePoolRouter);
  app.use("/discover", discoveryRouter);
  app.use(rootRouter);
};
module.exports = setRouting;
