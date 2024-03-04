const { Router } = require("express");
const { Request, Response } = require("express");
const controller = require("../controller/controller");
const User = require("../model/user");
const Station = require("../model/station");
const Venue = require("../model/venue");

const discoveryRouter = Router();

// Remember -- Need to add logic for storing preferred line in the DB User collection.

// This is now working. Now need to sort out the frontend to tell the backend of any activeLine changes, etc.
discoveryRouter.get("/", async (req, res) => {
  try {
    let user = await User.find({});
    user = user[0];
    console.log(user.lastDiscoveryUpdate);
    const needsUpdate = challengeAgeCheck(user.lastDiscoveryUpdate);

    if (needsUpdate) {
      const randomStation = await selectRandomStation(user.activeLine);
      // console.log("randomStation", randomStation);

      const nearbyVenues = await findNearbyVenues({
        stationName: randomStation.name,
        stationLat: randomStation.lat,
        stationLon: randomStation.lon,
      });

      user.currentDiscoveryStation = randomStation;
      user.lastDiscoveryUpdate = Date.now();
      user.currentDiscoveryVenues = nearbyVenues;
      await user.save();

      res.json({
        currentDiscoveryStation: randomStation,
        currentDiscoveryVenues: nearbyVenues,
        message: "new venues attached",
      });
    } else {
      res.json({
        currentDiscoveryStation: user.currentDiscoveryStation,
        currentDiscoveryVenues: user.currentDiscoveryVenues,
        message: "Suggestion remains the same this week",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// I know I am duplicating the code here from the controller.
// I want to have ability to call the logic from both the endpoint request and internally.
async function findNearbyVenues(requestObj) {
  const { stationName, stationLat, stationLon } = requestObj;
  const apiKey = process.env.API_KEY;
  const URL = `https://places.googleapis.com/v1/places:searchNearby`;
  const preExistingVenues = await Venue.find({ assignedStation: stationName });

  if (preExistingVenues.length > 0) {
    console.log("Serving you some cached suitable venues...");
    return preExistingVenues;
  } else {
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.displayName,places.rating,places.location,places.googleMapsUri,places.websiteUri,places.userRatingCount,places.editorialSummary,places.photos,places.formattedAddress",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationRestriction: {
            circle: {
              center: {
                latitude: stationLat,
                longitude: stationLon,
              },
              radius: 1000,
            },
          },
          languageCode: "en",
          includedTypes: ["bar", "cafe", "tourist_attraction"],
          maxResultCount: 5,
          rankPreference: "POPULARITY",
        }),
      });

      parsedResponse = await response.json();

      // Some places don't have editorialSummaries so filter them out to avoid DB validation errors.
      parsedResponse = await parsedResponse.places.filter(
        (placeObj) => placeObj.editorialSummary,
      );
      // console.log(parsedResponse);

      // NOTE: Do not worry if you get a console error due to missing fields. Error is caught and next place will be processed for caching.
      parsedResponse.forEach((placeObj, index) => {
        Venue.create({
          assignedStation: stationName,
          challenge: false,
          longitude: stationLon,
          latitude: stationLat,
          displayName: placeObj.displayName.text,
          rating: placeObj.rating,
          googleMapsUri: placeObj.googleMapsUri,
          websiteUri: placeObj.websiteUri,
          userRatingCount: placeObj.userRatingCount,
          editorialSummary: placeObj.editorialSummary.text,
          photos: placeObj.photos,
          formattedAddress: placeObj.formattedAddress,
        }).catch((err) => console.error(err));
      });
      return parsedResponse;
    } catch (error) {
      console.error(error);
    }
  }
}

// This should be working.
function challengeAgeCheck(lastUpdate) {
  const oneWeek = 6.048e8;
  return Date.now() - new Date(lastUpdate) >= oneWeek;
}

// This helper function is now working.
async function selectRandomStation(activeLine) {
  // Get the cached list of stations.
  const stationsArray = await Station.find({ line: activeLine });

  const randomIndex = Math.floor(Math.random() * stationsArray.length);

  // return random station from current user-preferred line
  return stationsArray[randomIndex];
}

module.exports = discoveryRouter;
