const mongoose = require("mongoose");

// MongoDB connection string
const connectionString = "mongodb://localhost:27017/zonehopper";

mongoose
  .connect(connectionString)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB: ", err));

module.exports = mongoose;
