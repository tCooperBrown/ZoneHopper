const Photo = require("../model/photo");
const geolib = require("geolib");
const Station = require("../model/station");
const { Query } = require("mongoose");
const Venue = require("../model/venue");
require("dotenv").config();

async function queryPhotoCache(req, res) {
  const placeId = req.params.id;

  async function handleGooglePhotoCacheMiss(placeId) {
    // COMPLETE CODE USING GOOGLE PLACES API. Then send res image to client prior to caching in MongoDB server-side.
  }

  try {
    let photo = await Photo.findOne({ placeId });
    if (photo) {
      res.contentType("image/jpeg");
      res.send(photo.photoData);
    } else {
      handleGooglePhotoCacheMiss();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
}

async function getOrderedStationsByLine(line) {
  // The reason why this function only supports lines with a single branch is because the lineSequence array structure has multiple elements. I will have to modify this function later to accomodate. For now: use Bakerloo, and Victoria.
  let stations = await fetch(
    `https://api.tfl.gov.uk/Line/${line}/Route/Sequence/inbound`,
  );
  stations = await stations.json();

  let res = {};
  res.lineSequenceCoords = [...JSON.parse(stations.lineStrings[0])][0];

  res.unorderedStationObjects = [...stations.stations];

  let indicesMap = new Map();

  for (let i = 0; i < res.lineSequenceCoords.length; i++) {
    for (let j = 0; j < res.unorderedStationObjects.length; j++) {
      if (
        geolib.isPointWithinRadius(
          {
            longitude: res.unorderedStationObjects[j].lon,
            latitude: res.unorderedStationObjects[j].lat,
          },
          {
            longitude: res.lineSequenceCoords[i][0],
            latitude: res.lineSequenceCoords[i][1],
          },
          150,
        )
      ) {
        indicesMap.set(res.unorderedStationObjects[j].name, i);
        // Set name definition to index of hit in the sequenced coords array.
      }
    }
  }

  res.orderedStationObjects = [...res.unorderedStationObjects].sort(
    (objA, objB) => {
      const indexA = indicesMap.get(objA.name);
      const indexB = indicesMap.get(objB.name);
      return indexA - indexB;
    },
  );

  return res.orderedStationObjects;
}

async function cacheStationsIfNotRecentlyAvailable() {
  // Will need to return to this function to incorporate purge & refresh every 30 days

  if ((await Station.countDocuments({})) === 0) {
    const bakerlooStations = await getOrderedStationsByLine("bakerloo");
    bakerlooStations.forEach((stationObj, index) => {
      Station.create({
        line: "bakerloo",
        lon: stationObj.lon,
        lat: stationObj.lat,
        name: stationObj.name,
        inboundOrder: index,
      });
    });
    console.log("Done creating docs for Bakerloo");

    const victoriaStations = await getOrderedStationsByLine("victoria");
    victoriaStations.forEach((stationObj, index) => {
      Station.create({
        line: "victoria",
        lon: stationObj.lon,
        lat: stationObj.lat,
        name: stationObj.name,
        inboundOrder: index,
      });
    });
    console.log("Done creating docs for Victoria");
  }
  // RETURN TO THIS: LOGIC FOR PURGE & REFRESH AFTER 30 DAYS. HOWEVER, WILL LIKELY JUST DO A DAY-OF-MONTH OR SIMILAR.
  // else {
  //   console.log(
  //     await Station.findOne(
  //       {},
  //       {},
  //       { sort: { created_at: 1 } },
  //       function (err, post) {
  //         // console.log(post);
  //         // RETURN TO THIS: LOGIC FOR PURGE & REFRESH AFTER 30 DAYS. HOWEVER, WILL LIKELY JUST DO A DAY-OF-MONTH OR SIMILAR.
  //       },
  //     ),
  //   );
  // }
}

cacheStationsIfNotRecentlyAvailable();

async function retrieveCachedStations(req, res) {
  try {
    // Note: currently defaulting to Bakerloo. Can change later...
    const tflLine = req.query.tflLine;
    const direction = req.query.direction;

    const stations = await Station.find({ line: tflLine }).sort({
      inboundOrder: direction,
    });
    res.send(stations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

// ========> the full object version
// getOrderedStationsByLine("victoria").then((res) => console.log(res));

// ========> the short name version with long & lat
// getOrderedStationsByLine("bakerloo").then((stationObjects) =>
//   stationObjects.forEach((stationObjects) => {
//     console.log({
//       name: stationObjects.name,
//       lon: stationObjects.lon,
//       lat: stationObjects.lat,
//     });
//   }),
// );

async function validateCoordSubmission(req, res) {
  try {
    let venueCoords = { lon: req.body.venueLon, lat: req.body.venueLat };
    if (
      geolib.isPointWithinRadius(
        {
          longitude: req.body.lon,
          latitude: req.body.lat,
        },
        {
          longitude: venueCoords.lon,
          latitude: venueCoords.lat,
        },
        500,
      )
    ) {
      try {
        res.send({ success: true });
        console.log("success & venueCoords: ", venueCoords);
      } catch (error) {
        console.error(error);
        res.status(400).send({ success: false });
      }
    } else {
      try {
        res.send({ success: false });
        console.log("fail & venueCoords: ", venueCoords);
      } catch (error) {
        console.error(error);
        res.status(400).send({ success: false });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ succes: false });
  }
}

// Currently does not make a new venue each week. As this stays the same for a while - I will mock one and build out other functionality.
async function generateWeeklyVenue() {
  Venue.create({
    lon: -0.115554,
    lat: 51.502233,
    name: "BrewDog",
    challenge: true,
  });
}

// generateWeeklyVenue();

// ---------------------------------- Google Places initial test -----------------------------
async function getNearbyVenues(req, res) {
  const { stationLat, stationLon, stationName } = req.query;
  const apiKey = process.env.API_KEY;

  // if (!location) {
  //   return res.status(400).send("Missing required parameter: location");
  // }

  // const URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&types=${types}&keyword=${keyword}&key=${apiKey}`;
  const URL = `https://places.googleapis.com/v1/places:searchNearby`;
  // `${apiKey}`;

  const preExistingVenues = await Venue.find({ assignedStation: stationName });

  // IGNORE ----------- TESTING PURPOSES --------------------
  // console.log("preExistingVenues", preExistingVenues);
  // console.log("length: ", preExistingVenues.length);
  // console.log("bool test: exp false", preExistingVenues.length === 0);
  // console.log("bool test: exp true", !(preExistingVenues.length === 0));
  // --------------------------------------------------------

  if (preExistingVenues.length > 0) {
    console.log("Serving you some cached suitable venues...");
    res.send(preExistingVenues);
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
              radius: 700,
            },
          },
          languageCode: "en",
          includedTypes: ["bar", "cafe", "tourist_attraction"],
          maxResultCount: 1,
          rankPreference: "POPULARITY",
        }),
      });

      parsedResponse = await response.json();

      parsedResponse.places.forEach((placeObj, index) => {
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

      res.send(parsedResponse);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching places data");
    }
  }
}

// IGNORE BELOW FOR NOW
// async function checkForSuitableVenues() {
//   console.log((await Venue.find({ assignedStation: "Paddington" })).length);
// }

// checkForSuitableVenues();

module.exports = {
  queryPhotoCache,
  getOrderedStationsByLine,
  retrieveCachedStations,
  validateCoordSubmission,
  getNearbyVenues,
};

// 1. Check venues collection for any docs against "assignedStation".
// 2. If no docs, then run getNearbyVenues providing "assignedStations".
