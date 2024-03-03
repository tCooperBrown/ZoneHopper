const mongoose = require("mongoose");

// Modify to include name in future. Not needed for now.
const userSchema = new mongoose.Schema({
  lastDiscoveryUpdate: { type: Date },
  currentDiscoveryStation: { type: Object },
  currentDiscoveryVenues: { type: Object },
  visitedStations: { type: Array },
  activeLine: { type: String },
});

const User = mongoose.model("User", userSchema);

////////////////// Ignore - just using this to create a dummy doc when needed ////////////
async function testfunc() {
  await User.create({
    lastDiscoveryUpdate: 1708291899 * 1000,
    currentDiscoveryStation: { empty: true },
    currentDiscoveryVenues: { empty: true },
    visitedStations: ["default"],
    activeLine: "bakerloo",
  });
}

// testfunc();

module.exports = User;
