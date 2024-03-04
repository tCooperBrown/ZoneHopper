const BASE_URL = "http://10.10.22.220:3000"; // You cannot use localhost for testing purposes. Instead use your server's subnet address. Ignore: http://10.10.22.21:3000, http://192.168.1.201:3000
const tflBASE_URL = "https://api.tfl.gov.uk";

export async function fetchOrderedArrayOfStations(line) {
  let stations = await fetch(
    `${BASE_URL}/tube-stations?orderBy=inboundOrder&tflLine=${line}&direction=asc`,
  );
  return stations;
}

export async function informPreferredLine(line) {
  await fetch(`${BASE_URL}/user/update-line`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      activeLine: line,
    }),
  });
}

// Ignore below - old -----------------------------------------------------------------/

// export async function fetchStationsByLine(line) {
//   let stations = await fetch(`https://api.tfl.gov.uk/Line/${line}/StopPoints`);
//   stations = await stations.json();
//   stations = stations.filter((stationList) => stationList.commonName);
//   stations.forEach((station) => console.log(station.commonName));
// }

// Get all Lines that serve mode "tube"
export async function getAllTubeLines() {
  let lines = await fetch(`${tflBASE_URL}/Line/Mode/tube`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  lines = await lines.json();
  lines = lines.map((lineObj) => lineObj.id);
  return lines; // Returns array of all tube lines names (String) in alphabetical order
}

export async function validateCheckIn(coordData) {
  let res = await fetch(`${BASE_URL}/validate-coordinates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lat: coordData.lat,
      lon: coordData.lon,
      venueLon: coordData.venueLon,
      venueLat: coordData.venueLat,
    }),
  });

  let parsedRes = await res.json();
  return parsedRes.success;
}

// I'm going to get the stationLon, stationLat from the backend rather than doing it here.
export async function getDiscoveryVenues(activeLine) {
  // This first API call just triggers a refresh of the discovery venues if needed.
  let res = await fetch(`${BASE_URL}/discover?activeLine=${activeLine}`);

  res = await res.json();
  console.log(res);
  // console.log(res.currentDiscoveryStation.lat);
  // console.log(res.currentDiscoveryStation.lon);
  // console.log("API SERVICE", res);

  // console.log("111111111111111111111111111111111111111111111111111111");
  return res;
  // This next API call queries the venue data.

  ////////////////////
  // let randomStationIndex = Math.floor(
  //   Math.random() * activeLineStations.length,
  // );
  // console.log("random station: ", activeLineStations[randomStationIndex]);
  // console.log(activeLineStations);
  // const discoveryLine = linesArray[randomLineIndex];
  // const activeLineStations = useStationsStore((state) => state.stations);
  // const activeLine = useLineStore((state) => state.line);
  // console.log(activeLine);
  // let res = await fetch(
  //   `${BASE_URL}/venue-pool?stationLon=${stationLon}&stationLat=${stationLat}&stationName=${stationName}`,
  // );
}

// getDiscoveryVenues();
////////////DUMP - DISREGARD //////////////////////////////

// I build the linesArray w/ the TFL API in the settings modal but short for time so it's static here.
// const linesArray = [
//   "bakerloo",
//   // "central",
//   // "circle",
//   // "district",
//   // "hammersmith-city",
//   // "jubilee",
//   // "metropolitan",
//   // "northern",
//   // "picadilly",
//   // "victoria",
//   // "waterloo-city",
// ];
// let randomLineIndex = Math.floor(Math.random() * linesArray.length);
// Ignore above. New plan: discoveryLine always takes prefferedLine.
