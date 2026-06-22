import Webcam from "react-webcam";


function WebcamFeed({webcamRef}){


return(

<Webcam

ref={webcamRef}

audio={false}

mirrored={true}

width={640}

height={480}

style={{
borderRadius:"10px"
}}

/>

)

}


export default WebcamFeed;