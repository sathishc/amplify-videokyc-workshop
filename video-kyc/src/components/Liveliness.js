import React,{ useState, useEffect } from "react";
import Webcam from "react-webcam";
import Button from 'react-bootstrap/Button'
import gest_data from './gestures.json'
import Card from "react-bootstrap/Card"
import ProgressBar from "react-bootstrap/ProgressBar"
import _ from 'lodash'

import Amplify, { Auth, Storage, Logger } from 'aws-amplify'
import AWS from 'aws-sdk'

const logger = new Logger('kyc','INFO');
AWS.config.update({region:'ap-south-1'});


const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };






  export default ({setTabStatus,faceDetails,updateFaceDetails}) => {
    const [gesture, setGesture] = useState(null);
    const [showSpinner,setShowSpinner] = useState(false);
    const [alertMessage, setAlertMessage] = useState("You will be asked to do a series of random gestures which will enable us to detect a live feed.  ");
    const [showProgress, setShowProgress] = useState(false);
    const [showWebcam, setShowWebcam] = useState(false);
    const [progressValue, setProgressValue] = useState(5);

    useEffect(() => {
    
        Storage.configure({ level: 'private' });
        Auth.currentCredentials().then(function(creds){
            logger.info(creds)
            AWS.config.update(creds);   
        })
      
    },[])

    useEffect(() => {
            
      if(gesture !== null)  {
        const description = getGestureDescription(gesture)  
        setAlertMessage(description + ". Click button to continue =>  ")
      }
  
    },[gesture])

    const getGestureDescription = (gesture) => {
        return _.find(gest_data, function(gest){
            return gest.name === gesture;
        }).description
    }
    

    const proceedToNext = () => {
      setTabStatus("UploadDocs");
    }

    const updateGestureState = () => {
        
        // update current gesture state to true

        // update next gesture
        if( gesture === "smile") {
            setProgressValue(30)
            setGesture("eyesClose")
        } else if (gesture === "eyesClose") {
            setProgressValue(70)
            setGesture("mouthOpen")
        } else {
            setProgressValue(100)
            setShowWebcam(false);
        }
    }

    const validateGesture = (gesture, data) => {
        logger.info("Validating gesture",data);
        if(data.length == 0){
            // more than one face
            return {result:false, message:"Could not recognize a face. Try again "}
        }

        if(data.length > 1){
            // more than one face
            return {result:false, message:"More than one face. Try again "}
        }
        logger.info(data.FaceDetails[0])

        if(gesture === "smile"){
            
            if(data.FaceDetails[0].Smile.Value == true){
                return {result:true, message:"Thank you"}
            } else {
                return {result:false, message:"Failed to validate smile. Try again "}
            }
            
        } else if(gesture === "eyesClose") {
            if(data.FaceDetails[0].EyesOpen.Value == false){
                return {result:true, message:"Thank you"}
            } else {
                return {result:false, message:"Failed to validate closed eyes. Try again "}
            }
        } else if(gesture === "mouthOpen") {
            if(data.FaceDetails[0].MouthOpen.Value == true){
                return {result:true, message:"You can successfully completed Liveness checks !! "}
            } else {
                return {result:false, message:"Failed to validate open mouth. Try again "}
            }
        }

        return {result:false, message:"Unkown gesture type specified"}
    }


    const requestGesture = () => {
      
      
        setShowSpinner(true);
      
        const imageBase64String = webcamRef.current.getScreenshot({width: 800, height: 450}); 
        const base64Image = imageBase64String.split(';base64,').pop();  
        const binaryImg = new Buffer(base64Image, 'base64');    

        let rekognition = new AWS.Rekognition();
        let params = {
        Attributes: [ "ALL" ],
            Image: {
                Bytes:binaryImg
            }
        };
        console.log("Calling rekognition")
        rekognition.detectFaces(params, function(err, data) {
            if (err) 
                console.log(err, err.stack); // an error occurred
            else { 
               let validationResult = validateGesture(gesture, data) 
               if(validationResult.result){
                    if(gesture === 'smile'){
                        Storage.put('gesture1.jpeg', binaryImg)
                            .then (result => {
                                console.log(result)
                                setAlertMessage(validationResult.message)
                                setShowSpinner(false);
                                updateGestureState();
                            }) 
                            .catch(err => {
                                console.log(err)
                                setAlertMessage("Error processing smile")
                                setShowSpinner(false);
                                setGesture("smile")
                            });
                    } else {
                        // update gesture state
                        setAlertMessage(validationResult.message)
                        setShowSpinner(false);
                        updateGestureState();
                    }
               } else {
                 // unable to validate gesture - set Error Message
                 setAlertMessage(validationResult.message)
                 setShowSpinner(false);
               }     
            }     
        })
    };

    function start_test(evt){
      setShowProgress(true);
      setShowWebcam(true);
      setGesture("smile")
    }

    const webcamRef = React.useRef(null);
   
   
    return (
      <>
        <Card>
            <Card.Header>
                {alertMessage} 
                {!showProgress && <Button variant="primary" onClick={start_test}>Start</Button>}
                {showProgress && progressValue < 100 && <Button variant="primary" onClick={requestGesture}>Validate</Button>}
                {progressValue == 100 && <Button variant="primary" onClick={proceedToNext}>Continue</Button>}
            </Card.Header>
            
            <Card.Body>
                {showSpinner && <div className="spinner" ></div>}
                {showWebcam && <div className="video-padding">
                        <Webcam
                            audio={false}
                            height={450}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={800}
                            videoConst
                            raints={videoConstraints}
                        />
                        
                    </div>
                }
                
                {showProgress &&  <div className="live-progressbar"><ProgressBar now={progressValue} label={`${progressValue}%`} /></div> }

            </Card.Body>
        </Card>
      </>
    );
  };

  