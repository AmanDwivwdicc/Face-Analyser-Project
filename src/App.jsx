import FaceOverlay from "./components/FaceOverlay";

import {useEffect,useRef,useState} from "react";

import WebcamFeed from "./components/WebcamFeed";

import {loadModels} from "./utils/loadModels";

import {detectEmotion} from "./utils/detectEmotion";

import {generatePDF} from "./utils/generatePDF";


function App(){


const webcamRef=useRef(null);


const [modelsLoaded,setModelsLoaded]=useState(false);

const [emotion,setEmotion]=useState(null);

const emotionHistory = useRef([]);

const sessionEmotions = useRef([]);

const [recording,setRecording]=useState(false);

const [summary,setSummary]=useState(null);

const [status,setStatus]=useState("");

const [overallMood,setOverallMood]=useState(null);

const emojiMap = {

happy:"😄",

sad:"😞",

angry:"😡",

neutral:"😐"

};

const generateSummary=()=>{


if(sessionEmotions.current.length===0){

setStatus(
"⚠️ First record the video"
);

return;

}



const data=sessionEmotions.current;


const count={};


data.forEach(e=>{

count[e]=(count[e]||0)+1;

});


const total=data.length;


const result={};



Object.keys(count)
.forEach(e=>{

result[e]=Math.round(
(count[e]/total)*100
);

});


setSummary(result);

const dominantEmotion =
Object.keys(result)
.reduce((a,b)=>
result[a] > result[b] ? a:b
);


setOverallMood(dominantEmotion);


setStatus(
"✅ Report generated"
);


}

useEffect(()=>{


const start = async()=>{

await loadModels();

setModelsLoaded(true);

}


start();


},[]);



useEffect(()=>{


if(!modelsLoaded)
return;



const interval=setInterval(async()=>{


if(
webcamRef.current &&
webcamRef.current.video.readyState===4
){


const result =
await detectEmotion(
webcamRef.current.video
);


if(result){

emotionHistory.current.push(result.emotion);


if(emotionHistory.current.length > 8){

emotionHistory.current.shift();

}

if(result){

sessionEmotions.current.push(result.emotion);

}


const mostCommon =
emotionHistory.current
.sort(
(a,b)=>
emotionHistory.current.filter(x=>x===a).length -
emotionHistory.current.filter(x=>x===b).length
)
.pop();


setEmotion({
emotion: mostCommon
});


}


}


},1000);



return()=>clearInterval(interval);


},[modelsLoaded]);





return(

<div
style={{

minHeight:"100vh",

width:"100vw",

display:"flex",

flexDirection:"column",

alignItems:"center",

justifyContent:"center",

padding:"20px",

background:"#f5f5f5",

overflow:"hidden"

}}
>


<h1>
Face Expression Analyzer
</h1>



<div
style={{

position:"relative",

width:"640px"

}}
>

<WebcamFeed
webcamRef={webcamRef}
/>



</div>




<div
style={{

marginTop:"20px",

padding:"12px 30px",

borderRadius:"30px",

background:"#ffffff",

boxShadow:"0 5px 20px rgba(0,0,0,0.15)",

fontSize:"28px",

fontWeight:"700"

}}
>

{

emotion?.emotion

?

`${emojiMap[emotion.emotion]} ${emotion.emotion}`

:

"🔍 Detecting..."

}

</div>



<div
style={{

display:"flex",

gap:"20px",

marginTop:"15px"

}}
>


<button

disabled={recording}

onClick={()=>{

sessionEmotions.current=[];

setRecording(true);

setStatus("🔴 Recording started");

}}

style={{

padding:"12px 25px",

borderRadius:"25px",

border:"none",

cursor: recording ? "not-allowed" : "pointer",

opacity: recording ? 0.5 : 1

}}

>

🔴 Start Recording

</button>



<button

onClick={()=>{

setRecording(false);

setStatus("⏹ Recording stopped");

}}

>

⏹ Stop Recording

</button>



<button

style={{
padding:"12px 25px",
borderRadius:"25px",
border:"none",
cursor:"pointer",
fontSize:"16px",
background:"#457b9d",
color:"white"
}}

onClick={generateSummary}

>

📊 Generate Report

</button>



</div>



{

status &&

<div

style={{

position:"fixed",

top:"90px",

left:"50%",

transform:"translateX(-50%)",

background:"white",

padding:"12px 25px",

borderRadius:"30px",

boxShadow:"0 5px 20px rgba(0,0,0,0.2)",

zIndex:9999,

fontWeight:"600"

}}

>

{status}

</div>

}



{

summary &&

<div

style={{

position:"fixed",

top:"120px",

right:"40px",

background:"white",

padding:"25px",

borderRadius:"20px",

width:"300px",

boxShadow:"0 10px 30px rgba(0,0,0,0.2)",

zIndex:999

}}

>


<h2>
📊 Session Report
</h2>

{

overallMood &&

<h3>

Overall Mood:

{" "}

{emojiMap[overallMood]}

{" "}

{overallMood}

</h3>

}

{
overallMood==="happy" &&
<p>
You seemed positive and cheerful during this session 😄
</p>
}


{
overallMood==="sad" &&
<p>
You appeared a little low or relaxed during this session 😞
</p>
}


{
overallMood==="angry" &&
<p>
You showed signs of frustration or intensity 😡
</p>
}


{
overallMood==="neutral" &&
<p>
Your expression was mostly calm and neutral 😐
</p>
}

{
overallMood==="mixed" &&

<p>

🙂 Your expressions varied during this session.

You showed a combination of different emotions.

</p>

}


{

Object.entries(summary)
.map(([emotion,value])=>(

<p
key={emotion}
style={{

fontSize:"20px"

}}
>

{emojiMap[emotion]} {emotion} : {value}%

</p>

))

}


<button

onClick={()=>setSummary(null)}

style={{

marginTop:"15px",

padding:"10px 20px",

borderRadius:"20px",

border:"none",

cursor:"pointer"

}}

>

Close

</button>

<button

onClick={()=>generatePDF(summary,overallMood)}

style={{

marginTop:"20px",

padding:"12px 25px",

borderRadius:"25px",

border:"none",

cursor:"pointer"

}}

>

📄 Download PDF Report

</button>


</div>

}



</div>


)


}


export default App;