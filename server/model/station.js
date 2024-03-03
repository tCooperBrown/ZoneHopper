const mongoose = require(".");

const stationSchema = new mongoose.Schema({
  line: { type: String },
  lon: { type: Number },
  lat: { type: Number },
  name: { type: String },
  inboundOrder: { type: Number },
});

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;
