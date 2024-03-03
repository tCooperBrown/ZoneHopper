// Working .then() version of fetchStationsByLine():

// fetch("https://api.tfl.gov.uk/Line/jubilee/StopPoints")
//   .then((response) => {
//     return response.json();
//   })
//   .then((data) => data.filter((station) => station.commonName))
//   .then((station) => {
//     station.forEach((element) => {
//       console.log(element.commonName);
//     });
//   });

// Working async function for client API:

// async function fetchStationsByLine(line) {
//   let stations = await fetch(`https://api.tfl.gov.uk/Line/${line}/StopPoints`);
//   stations = await stations.json();
//   stations = stations.filter((stationList) => stationList.commonName);
//   stations.forEach((station) => console.log(station.commonName));
// }

// fetchStationsByLine("central");

// Fetching the list of stations for a line in perfect sequential order:

async function fetchOrderedStationsByLine(line) {
  let stations = await fetch(
    `https://api.tfl.gov.uk/Line/${line}/Route/Sequence/inbound`,
  );
  stations = await stations.json();

  let res = {};
  res.orderedLineCoords = [...JSON.parse(stations.lineStrings)[0]];
  console.log("old ordered coords", res.orderedLineCoords);
  res.orderedLineCoords.forEach((coordPair) => {
    coordPair[0] = parseFloat(coordPair[0]).toFixed(3);
    coordPair[1] = parseFloat(coordPair[1]).toFixed(3);
  });
  console.log("toFixed(4) ordered coords", res.orderedLineCoords);

  res.unorderedLineStringNames = [...stations.stations]; // These station objects are still unordered and have excess data (more than lat, long, name)
  const indicesMap = new Map(); // I'm going to store the coords & correct indices in a map for sorting function.
  res.orderedLineCoords.forEach((coords, index) => {
    indicesMap.set(coords.toString(), index);
  });

  // console.log("indicesMap", indicesMap);

  const orderedLineStringNames = [...res.unorderedLineStringNames].sort(
    (objA, objB) => {
      const keyA = [
        parseFloat(objA.lon).toFixed(3),
        parseFloat(objA.lat).toFixed(3),
      ].toString(); // It may seem weird that I give lon before lat - but this is how TFL chose to give the API responses. Usure of reason for now.
      const keyB = [
        parseFloat(objB.lon).toFixed(3),
        parseFloat(objB.lat).toFixed(3),
      ].toString();
      return indicesMap.get(keyA) - indicesMap.get(keyB);
    },
  );

  res.orderedLineStringNames = orderedLineStringNames;

  console.log("indicesMap: ", indicesMap);
  res.orderedLineStringNames.forEach((stationObj) => {
    console.log(
      indicesMap.get(
        [
          parseFloat(stationObj.lon).toFixed(3),
          parseFloat(stationObj.lat).toFixed(3),
        ].toString(),
      ),
    );
  });
  console.log([-(0.122666).toFixed(3), (51.507058).toFixed(3)].toString());
  console.log(
    indicesMap.get([-(0.122666).toFixed(3), (51.507058).toFixed(3)].toString()),
  );

  console.log("res.orderedLineStringNames: ", res.orderedLineStringNames);
  console.log("ordered line coords: ", res.orderedLineCoords);

  console.log("coords array length: ", res.orderedLineCoords.length);
  console.log("statiion names length: ", res.orderedLineStringNames.length);
}

fetchOrderedStationsByLine("bakerloo");

// https://api.digital.tfl.gov.uk/Line/jubilee/Route/Sequence/inbound?serviceTypes=Regular&excludeCrowding=false
