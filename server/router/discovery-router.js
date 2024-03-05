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
    let user = await User.find({ activeLine: req.query.activeLine });

    const timeStamp = Date.now();

    if (user.length === 0) {
      // SCENARIO 1A (SEE OBSIDIAN)

      const randomStation = await selectRandomStation(req.query.activeLine);
      // res.send(user);
      console.log(randomStation);
      console.log(randomStation.name);
      console.log(randomStation.lat);
      console.log(randomStation.lon);

      const nearbyVenues = await findNearbyVenues({
        stationName: randomStation.name,
        stationLat: randomStation.lat,
        stationLon: randomStation.lon,
      });

      user = await User.create({
        lastDiscoveryUpdate: timeStamp,
        currentDiscoveryStation: randomStation,
        currentDiscoveryVenues: nearbyVenues,
        visitedStations: [],
        visitedVenues: [],
        activeLine: req.query.activeLine,
      });

      res.json({
        lastDiscoveryUpdate: timeStamp,
        currentDiscoveryStation: randomStation,
        currentDiscoveryVenues: nearbyVenues,
        visitedStations: [],
        activeLine: req.query.activeLine,
      });
    } else if (user.length > 0) {
      user = user[0];

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
        user.lastDiscoveryUpdate = timeStamp;
        user.currentDiscoveryVenues = nearbyVenues;
        await user.save();

        res.json({
          lastDiscoveryUpdate: timeStamp,
          currentDiscoveryStation: randomStation,
          currentDiscoveryVenues: nearbyVenues,
          visitedStations: user.visitedStations,
          message: "new venues attached",
        });
      } else {
        res.json({
          lastDiscoveryUpdate: timeStamp,
          currentDiscoveryStation: user.currentDiscoveryStation,
          currentDiscoveryVenues: user.currentDiscoveryVenues,
          visitedStations: user.visitedStations,
          message: "Suggestion remains the same this week",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/////////////////
//   try {
//     let user = await User.find({});
//     user = user[0];
//     console.log(user.lastDiscoveryUpdate);
//     const needsUpdate = challengeAgeCheck(user.lastDiscoveryUpdate);

//     if (needsUpdate) {
//       const randomStation = await selectRandomStation(user.activeLine);
//       // console.log("randomStation", randomStation);

//       const nearbyVenues = await findNearbyVenues({
//         stationName: randomStation.name,
//         stationLat: randomStation.lat,
//         stationLon: randomStation.lon,
//       });

//       user.currentDiscoveryStation = randomStation;
//       user.lastDiscoveryUpdate = Date.now();
//       user.currentDiscoveryVenues = nearbyVenues;
//       await user.save();

//       res.json({
//         currentDiscoveryStation: randomStation,
//         currentDiscoveryVenues: nearbyVenues,
//         message: "new venues attached",
//       });
//     } else {
//       res.json({
//         currentDiscoveryStation: user.currentDiscoveryStation,
//         currentDiscoveryVenues: user.currentDiscoveryVenues,
//         message: "Suggestion remains the same this week",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// I know I am duplicating the code here from the controller.
// I'm keeping similar duplicate logic for testing purposes.
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
      // for (let placeObj of parsedResponse)

      await parsedResponse.forEach((placeObj, index) => {
        Venue.create({
          assignedStation: stationName,
          challenge: false,
          longitude: placeObj.location.longitude,
          latitude: placeObj.location.latitude,
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

      let newVenues = await Venue.find({
        assignedStation: stationName,
      });
      return newVenues;
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

// Abandoned code for injectingPhotoUri's. It does work for generating all PhotoUri's from the input object however I'm having trouble manipulating the object and then feeding it into Mongoose. My code reuses outputs from existing collections/documents when creating new inputs - which probably isn't ideal. This means we have "_id" & "__v" properties embedded many layers deep into a document containing nested objects/arrays. I'm pretty sure this is a big part of my issue preventing me from storing these "new" collection documents but not certain. Need to also actually verify that I have manipulated the object in this function.
// async function injectPhotoUris(inputObject) {
//   let injectable = inputObject;
//   console.log("injectable: ", injectable);
//   for (let venue of injectable.currentDiscoveryVenues) {
//     for (let photo of venue.photos) {
//       let photoUri = await fetch(
//         `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=400&maxWidthPx=400&key=${process.env.API_KEY}&skipHttpRedirect=true`,
//       );
//       photoUri = await photoUri.json();
//       // console.log(photoUri);
//       photo.photoUri = photoUri;
//     }
//   }

//   // This step is essential. Mongoose will refuse to create the new document because it thinks it messed up and is about to mutate an existing doc.
//   delete injectable._id;
//   delete injectable.__v;
//   console.log(injectable);
//   return injectable;
// }

module.exports = discoveryRouter;
