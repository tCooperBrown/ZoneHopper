const mongoose = require(".");

const venueSchema = new mongoose.Schema({
  assignedStation: { type: String },
  challenge: { type: Boolean },
  longitude: { type: Number },
  latitude: { type: Number },
  displayName: { type: String },
  rating: { type: Number },
  googleMapsUri: { type: String },
  websiteUri: { type: String },
  userRatingCount: { type: Number },
  editorialSummary: { type: String },
  photos: { type: Array },
  formattedAddress: { type: String },
});

const Venue = mongoose.model("Venue", venueSchema);

module.exports = Venue;
