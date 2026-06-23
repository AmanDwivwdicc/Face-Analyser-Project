export function getMoodSummary(summary){


const sorted =
Object.entries(summary)
.sort((a,b)=>b[1]-a[1]);


const highestEmotion = sorted[0][0];

const highestValue = sorted[0][1];


const secondValue = sorted[1][1];



// clear dominant emotion

if(highestValue - secondValue >= 20){

return highestEmotion;

}



// close competition

return "mixed";


}