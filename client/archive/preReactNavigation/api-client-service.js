const BASE_URL = "http://localhost:3000";

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
