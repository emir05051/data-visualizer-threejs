export const floodFragmentShader = `
varying float vHeight;

uniform vec3 waterColor;  
uniform vec3 landColorLow; 
uniform vec3 landColorHigh;
uniform float waterLevel; 

void main() {
    vec3 color;
    if(vHeight <= 0.0) {
        color = waterColor;
    } 
        
    else if(vHeight <= waterLevel) {
        color = vec3(121.0 / 255.0, 182.0 / 255.0, 230.0 / 201.0);
        color = mix(waterColor, color, 0.1);
    }
    else {
        float landHeight = (vHeight - waterLevel) / (1.0 - waterLevel);
        float smoothHeight = smoothstep(0.0, 1.0, landHeight); 
        color = mix(landColorLow, landColorHigh, smoothHeight);
    }
    gl_FragColor = vec4(color, 1.0);
}
`;

export const floodVertexShader = `
varying float vHeight;

uniform sampler2D displacementMap;
uniform float displacementScale;

void main() {
    vec4 displacementData = texture2D(displacementMap, uv);
    vHeight = sqrt(displacementData.r) * 1.5; // Use the red channel for height

    vec3 displacedPosition = position + normal * displacementScale  * vHeight;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
`;

export const pollutionFragmentShader = `
uniform sampler2D pollutionMap;
varying vec2 vUv;

void main() {
    vec4 pollutionColor = texture2D(pollutionMap, vUv);


    gl_FragColor = pollutionColor;
}
`;
export const pollutionVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    vec3 displacedPosition = position + normal + 1.0; // Offset slightly to avoid z-fighting
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
`;
