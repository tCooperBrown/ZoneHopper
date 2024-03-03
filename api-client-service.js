const BASE_URL = "http://192.168.1.201:3000"; // You cannot use localhost for testing purposes. Instead use your server's subnet address. Ignore: http://10.10.22.21:3000, http://192.168.1.201:3000
const tflBASE_URL = "https://api.tfl.gov.uk";

export async function fetchOrderedArrayOfStations(line) {
  let stations = await fetch(
    `${BASE_URL}/tube-stations?orderBy=inboundOrder&tflLine=${line}&direction=asc`,
  );
  return stations;
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
  let res = await fetch(`${tflBASE_URL}/validate-coordinates`, {
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
