// I'm going to get the stationLon, stationLat from the backend rather than doing it here.

export async function getDiscoveryVenues(activeLine, activeLineStations) {
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
  let randomStationIndex = Math.floor(
    Math.random() * activeLineStations.length,
  );
  let randomLineIndex = Math.floor(Math.random() * linesArray.length);

  // const discoveryLine = linesArray[randomLineIndex];
  // const activeLineStations = useStationsStore((state) => state.stations);
  // const activeLine = useLineStore((state) => state.line);
  // console.log(activeLine);
  // let res = await fetch(
  //   `${BASE_URL}/venue-pool?stationLon=${stationLon}&stationLat=${stationLat}&stationName=${stationName}`,
  // );
}
