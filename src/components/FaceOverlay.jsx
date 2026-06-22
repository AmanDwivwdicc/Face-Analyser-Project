import {useEffect,useRef} from "react";
import * as faceapi from "@vladmandic/face-api";


function FaceOverlay({webcamRef}){

const lastDetection = useRef(null);

const canvasRef = useRef();


useEffect(()=>{


const interval=setInterval(async()=>{


if(
webcamRef.current &&
webcamRef.current.video.readyState===4
){


const video =
webcamRef.current.video;


const detections =
await faceapi
.detectAllFaces(
video,
new faceapi.TinyFaceDetectorOptions({

inputSize: 512,

scoreThreshold: 0.3

})
)
.withFaceExpressions();



const canvas =
canvasRef.current;


faceapi.matchDimensions(
canvas,
video
);



let resized;


if(detections.length > 0){

lastDetection.current = detections;

resized =
faceapi.resizeResults(
detections,
video
);

}

else if(lastDetection.current){

resized =
faceapi.resizeResults(
lastDetection.current,
video
);

}

else{

return;

}



canvas
.getContext("2d")
.clearRect(
0,
0,
canvas.width,
canvas.height
);



faceapi.draw.drawDetections(
canvas,
resized
);



resized.forEach(data=>{


const box = data.detection.box;


// enlarge rectangle
const enlargedBox = {

x: box.x - 40,

y: box.y - 60,

width: box.width + 80,

height: box.height + 100

};



const emotion =
Object.keys(data.expressions)
.reduce(
(a,b)=>
data.expressions[a] >
data.expressions[b]
?a:b
);



faceapi.draw.drawDetections(
canvas,
[
{
...data,
detection:{
box: enlargedBox
}
}
]
);



const ctx = canvas.getContext("2d");

ctx.font = "24px Arial";

ctx.fillStyle = "white";

ctx.fillText(
emotion.toUpperCase(),
enlargedBox.x,
enlargedBox.y - 10
);



});


}


},700);



return()=>clearInterval(interval);


},[]);



return(

<canvas

ref={canvasRef}

style={{

position:"absolute",

top:0,

left:0,

width:"640px",

height:"480px"

}}

/>

)

}


export default FaceOverlay;