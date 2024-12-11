// function generateBuilding(coordinates, height = 1) {
//   //each geojson "object" has multiple arrays of coordinates.
//   //the first array is the main (outer) building shape
//   //the second & third & .. are the "holes" in the building
//   let buildingShape, buildingGeometry; //main building
//   // let buildingHoles = []; //holes to punch out shape

//   coordinates.forEach((points, index) => {
//     //for each building do:
//     if (index == 0) {
//       //create main building shape
//       buildingShape = generateShape(points);
//     } else {
//       //create shape of holes in building
//       buildingShape.holes.push(generateShape(points));
//       // buildingHoles.push(generateShape(points));
//     }
//   });

//   buildingGeometry = generateGeometry(buildingShape, height);
//   return buildingGeometry;
// }
// function generateShape(polygon) {
//   let shape = new THREE.Shape(); //only a single polygon?

//   polygon.forEach((coordinates, index) => {
//     let coords = normalizeCoordinates(coordinates, $.config.citycenter);
//     if (index == 0) {
//       shape.moveTo(coords[0], coords[1]);
//     } else {
//       shape.lineTo(coords[0], coords[1]);
//     }

//     // console.log(coordinates);
//     // shape.moveTo(coordinates[0], coordinates[1]);
//   });

//   return shape;
// }
