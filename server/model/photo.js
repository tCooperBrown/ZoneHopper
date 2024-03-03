const mongoose = require(".");

// I want to request Google Places API [Place Photos] only server-side.
// I will then cache these photos in a MongoDB collection for a 30-day period (in line with Google ToS).
// Clients will check their own cache for required images. In event of cache-miss, client will query the server for the photo. A further cache-miss from the server will trigger the server to make a fresh API call and return the image to the client.
const photoSchema = new mongoose.Schema({
  placeId: { type: String, required: true, unique: true },
});

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;
