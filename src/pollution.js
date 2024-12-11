import * as THREE from "three";

let token = `${import.meta.env.VITE_TOKEN}`;
let long1 = "-90.0";
let lat1 = "-180.0";
let long2 = "90.0";
let lat2 = "180.0";

export function fetchPollutionData() {
  return fetch(
    `https://api.waqi.info/v2/map/bounds?latlng=${long1},${lat1},${long2},${lat2}&networks=all&token=${token}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => data.data)
    .catch((error) => {
      console.error("Error fetching pollution data:", error);
      return null;
    });
}

export function createPollutionMap(data, width, height) {
  const canvas = document.createElement("canvas");
  document.body.append(canvas);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "green";
  ctx.fillRect(0, 0, width, height);

  data.forEach((point) => {
    const x = Math.floor(((point.lon + 180) / 360) * width);
    const y = Math.floor(((90 - point.lat) / 180) * height);

    const normalizedAQI = Math.min(point.aqi / 300, 1.0);

    let color;

    if (normalizedAQI <= 0.1) {
      color = `rgba(13, 140, 118, ${normalizedAQI})`;
    } else if (normalizedAQI <= 0.3) {
      color = `rgba(255, 222, 51, ${normalizedAQI})`;
    } else if (normalizedAQI <= 0.6) {
      color = `rgba(133, 23, 57, ${normalizedAQI})`;
    } else {
      color = `rgba(112, 15, 155, ${normalizedAQI})`;
    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  return new THREE.CanvasTexture(canvas);
}
