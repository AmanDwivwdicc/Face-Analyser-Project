import * as faceapi from "@vladmandic/face-api";


export async function detectEmotion(video){


const result =
await faceapi
.detectSingleFace(
video,
new faceapi.TinyFaceDetectorOptions({
    inputSize: 416,
    scoreThreshold: 0.45
})
)
.withFaceExpressions();



if(!result)
return null;



const expressions=result.expressions;



const happy = expressions.happy;
const sad = expressions.sad;
const angry = expressions.angry;
const neutral = expressions.neutral;



let emotion="neutral";



// HAPPY (reduce sensitivity)
if(
happy > 0.55 &&
happy > neutral + 0.15 &&
happy > sad + 0.20
){

emotion="happy";

}



// ANGRY

else if(

angry > 0.20 &&
angry > neutral - 0.10

){

emotion="angry";

}



// SAD

else if(

sad > 0.20 &&
sad > neutral - 0.05 &&
sad > happy

){

emotion="sad";

}



// otherwise neutral

else{

emotion="neutral";

}




return {

emotion,

confidence: expressions[emotion]

};


}