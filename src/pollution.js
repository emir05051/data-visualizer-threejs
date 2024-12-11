import getDistance from "geolib/es/getPreciseDistance";

let pollutionData = [];

let token = `${env.TOKEN}`;
let long1 = "-90.0";
let lat1 = "-180.0";
let long2 = "90.0";
let lat2 = "180.0";
fetch(
  `https://api.waqi.info/v2/map/bounds?latlng=${long1},${lat1},${long2},${lat2}&networks=all&token=${token}`
).then((res) => {
  res.text().then((e) => {
    pollutionData = JSON.parse(e).data;
    let lonStep = 30;
    let latStep = 60;
    console.log(pollutionData);

    // for (let i = -90; i < 90; i += latStep) {
    //   for (let j = -180; j < 180; j += lonStep) {
    //     let tmp = { lat: i, lon: j, aqi: interpolatePollution(i, j) };
    //     pollutionData.push(tmp);
    //   }
    // }
    interpolatePollution(-30, -60);
    console.log("fINISHED");

    // createPollutionMap(pollutionData, 512, 512);
  });
});

function createPollutionMap(data, width, height) {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  console.log(data);

  // Fill with default color (e.g., black for zero pollution)
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  // Map pollution data to canvas
  data.forEach((point) => {
    const x = Math.floor(((point.lon + 180) / 360) * width); // Map longitude to X
    const y = Math.floor(((90 - point.lat) / 180) * height); // Map latitude to Y
    const intensity = Math.min(255, Math.max(0, parseInt(point.aqi) * 2.55)); // Map pollution to 0-255

    ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`; // Grayscale
    ctx.fillRect(x, y, 5, 5); // Draw a small square for each point
  });

  //   let disMap = new THREE.CanvasTexture(canvas);
  //   const groundMaterial = new THREE.MeshStandardMaterial({
  //     displacementMap: disMap,
  //     displacementScale: 10.0, // Adjust for your terrain
  //   });

  return canvas;
}
function interpolatePollution(lat, lon) {
  let totalPollution = 0;
  let totalWeight = 0;
  debugger;
  let counter = 0;

  pollutionData.forEach((point) => {
    if (counter === 10) return;
    if (point.aqi === "-") return;

    const distance = getDistance(
      { latitude: lat, longitude: lon },
      { latitude: point.lat, longitude: point.lon }
    );
    const weight = 1 / distance + 1;
    totalPollution += parseInt(point.aqi) * weight;

    if (isNaN(totalPollution)) {
      console.log(lat, lon);

      console.log(point);
    }

    totalWeight += weight;
  });

  return totalWeight > 0 ? totalPollution / totalWeight : 0;
}
