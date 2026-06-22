import * as faceapi from "@vladmandic/face-api";


export async function loadModels(){

const MODEL_URL="/models";


await faceapi.tf.setBackend("webgl");

await faceapi.tf.ready();


await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);


console.log(
"Backend:",
faceapi.tf.getBackend()
);

console.log("Models loaded");

}