+++
title = "Setting up the Front End"
chapter = false
weight = 20
+++

We will now create a front end for the liveness feature to capture the portrait of the user. For ths we add a new Liveliness component to our recat app which includes a webcan integration. We will use the react-webcam component for this purpose. The liveness checks uses AWS Rekognition detect faces functionality to check of facial gestures like smile, open mouth and closed eyes. We use the Rekognition sdk in Amplify by enabling the Predictions feature with appropriate inputs.

1. **➡️ Run** `npm install --save 'react-webcam'` to add the webcam component.

2. **➡️ Run** `npm install --save 'lodash'` as we use this library for data structures

3. **➡️ Create a new file `src/components/gestures.json` with** <span class="clipBtn clipboard" data-clipboard-target="#idf77ec89eb8e98c6d9706c221315a4a5b9ec0d618videokycsrccomponentsgesturesjson"><strong>this content</strong></span> (click the gray button to copy to clipboard). 
{{< expand "Click to view diff" >}} {{< safehtml >}}
<div id="diff-idf77ec89eb8e98c6d9706c221315a4a5b9ec0d618videokycsrccomponentsgesturesjson"></div> <script type="text/template" data-diff-for="diff-idf77ec89eb8e98c6d9706c221315a4a5b9ec0d618videokycsrccomponentsgesturesjson">commit f77ec89eb8e98c6d9706c221315a4a5b9ec0d618
Author: Sathish <sat.hariharan@gmail.com>
Date:   Sat Aug 8 23:57:49 2020 +0530

    add gestures.json

diff --git a/video-kyc/src/components/gestures.json b/video-kyc/src/components/gestures.json
new file mode 100644
index 0000000..e7198c3
--- /dev/null
+++ b/video-kyc/src/components/gestures.json
@@ -0,0 +1,14 @@
+[
+    {
+        "name":"smile",
+        "description":"Please smile !!!"
+    },
+    {
+        "name":"eyesClose",
+        "description":"Please close your eyes"
+    },
+    {
+        "name":"mouthOpen",
+        "description":"Please open your mouth :)"
+    }
+]
\ No newline at end of file
</script>
{{< /safehtml >}} {{< /expand >}}
{{< safehtml >}}
<textarea id="idf77ec89eb8e98c6d9706c221315a4a5b9ec0d618videokycsrccomponentsgesturesjson" style="position: relative; left: -1000px; width: 1px; height: 1px;">[
    {
        "name":"smile",
        "description":"Please smile !!!"
    },
    {
        "name":"eyesClose",
        "description":"Please close your eyes"
    },
    {
        "name":"mouthOpen",
        "description":"Please open your mouth :)"
    }
]
</textarea>
{{< /safehtml >}}

4. **➡️ Create a new component `src/components/Liveliness.js` with** <span class="clipBtn clipboard" data-clipboard-target="#id1aab29be0c79aba0649fa6428507589920f1c943videokycsrccomponentsLivelinessjs"><strong>this content</strong></span> (click the gray button to copy to clipboard). 
{{< expand "Click to view diff" >}} {{< safehtml >}}
<div id="diff-id1aab29be0c79aba0649fa6428507589920f1c943videokycsrccomponentsLivelinessjs"></div> <script type="text/template" data-diff-for="diff-id1aab29be0c79aba0649fa6428507589920f1c943videokycsrccomponentsLivelinessjs">commit 1aab29be0c79aba0649fa6428507589920f1c943
Author: Sathish <sat.hariharan@gmail.com>
Date:   Mon Aug 10 17:58:34 2020 +0530

    add Liveliness component

diff --git a/video-kyc/src/components/Liveliness.js b/video-kyc/src/components/Liveliness.js
index 9b2a3ed..3ce67d3 100644
--- a/video-kyc/src/components/Liveliness.js
+++ b/video-kyc/src/components/Liveliness.js
@@ -5,6 +5,7 @@ import gest_data from './gestures.json'
 import Card from "react-bootstrap/Card"
 import ProgressBar from "react-bootstrap/ProgressBar"
 import _ from 'lodash'
+import Jimp from 'jimp'
 
 import { Auth, Storage, Logger } from 'aws-amplify'
 import AWS from 'aws-sdk'
@@ -20,7 +21,7 @@ const videoConstraints = {
     facingMode: "user"
   };
 
-  export default ({setTabStatus,faceDetails,updateFaceDetails}) => {
+  export default ({setTabStatus, setLiveTestDetails}) => {
     const [gesture, setGesture] = useState(null);
     const [showSpinner,setShowSpinner] = useState(false);
     const [alertMessage, setAlertMessage] = useState("You will be asked to do a series of random gestures which will enable us to detect a live feed.  ");
@@ -28,6 +29,11 @@ const videoConstraints = {
     const [showWebcam, setShowWebcam] = useState(false);
     const [progressValue, setProgressValue] = useState(5);
 
+    // identification state from liveness test
+    const [liveGender, setLiveGender] = useState("");
+    const [ageRange, setAgeRange] = useState("");    
+    const [liveImage, setLiveImage] = useState(null);
+
     useEffect(() => {
         Storage.configure({ level: 'private' });
         Auth.currentCredentials().then(function(creds){
@@ -50,6 +56,11 @@ const videoConstraints = {
     }
     
     const proceedToNext = () => {
+        setLiveTestDetails({
+           liveGender:liveGender,
+           ageRange:ageRange,
+           liveImage:liveImage 
+        })  
       setTabStatus("UploadDocs");
     }
 
@@ -108,57 +119,76 @@ const videoConstraints = {
     }
 
 
-    const requestGesture = () => {
+    const requestGesture = async () => {
       
       
         setShowSpinner(true);
       
         const imageBase64String = webcamRef.current.getScreenshot({width: 800, height: 450}); 
         const base64Image = imageBase64String.split(';base64,').pop();  
-        const binaryImg = new Buffer(base64Image, 'base64');    
+        const imageBuffer = new Buffer(base64Image, 'base64');    
 
         let rekognition = new AWS.Rekognition();
         let params = {
         Attributes: [ "ALL" ],
             Image: {
-                Bytes:binaryImg
+                Bytes:imageBuffer
             }
         };
-        console.log("Calling rekognition")
-        rekognition.detectFaces(params, function(err, data) {
-            if (err) 
-                console.log(err, err.stack); // an error occurred
-            else { 
-               let validationResult = validateGesture(gesture, data) 
-               if(validationResult.result){
-                    if(gesture === 'smile'){
-                        Storage.put('gesture1.jpeg', binaryImg)
-                            .then (result => {
-                                console.log(result)
-                                setAlertMessage(validationResult.message)
-                                setShowSpinner(false);
-                                updateGestureState();
-                            }) 
-                            .catch(err => {
-                                console.log(err)
-                                setAlertMessage("Error processing smile")
-                                setShowSpinner(false);
-                                setGesture("smile")
-                            });
-                    } else {
-                        // update gesture state
-                        setAlertMessage(validationResult.message)
-                        setShowSpinner(false);
-                        updateGestureState();
-                    }
-               } else {
-                 // unable to validate gesture - set Error Message
-                 setAlertMessage(validationResult.message)
-                 setShowSpinner(false);
-               }     
+        
+        let faceDetectResponse = await rekognition.detectFaces(params).promise()
+
+        if (faceDetectResponse.$response.error) {
+            setShowSpinner(false);
+            setAlertMessage(faceDetectResponse.$response.error.message)
+            return new Promise((resolve, reject) => {
+                throw new Error(faceDetectResponse.$response.error.message);
+            }) 
+        }
+        else { 
+            let validationResult = validateGesture(gesture, faceDetectResponse) 
+            if(validationResult.result){
+                if(gesture === 'smile'){
+
+                    // set the gender
+                    setLiveGender(faceDetectResponse.FaceDetails[0].Gender.Value)
+                    setAgeRange(faceDetectResponse.FaceDetails[0].AgeRange.Value)
+
+                    // get the bounding box
+                    let imageBounds = faceDetectResponse.FaceDetails[0].BoundingBox
+                    logger.info(imageBounds)
+                    // crop the face and store the image
+                    Jimp.read(imageBuffer, (err, image) => {
+                        if (err) throw err;
+                        else {
+                        
+                        image.crop(image.bitmap.width*imageBounds.Left - 15, image.bitmap.height*imageBounds.Top - 15, image.bitmap.width*imageBounds.Width + 30, image.bitmap.height*imageBounds.Height + 30)
+                            .getBuffer(Jimp.MIME_JPEG, function (err, docImage) {
+                            
+                                Storage.put('liveImage.jpeg', docImage)
+                            }).getBase64(Jimp.MIME_JPEG, function (err, base64Image) {
+                                setLiveImage(base64Image)
+                            })
+                        }
+                    })
+
+                    // update gesture state
+                    setAlertMessage(validationResult.message)
+                    setShowSpinner(false);
+                    updateGestureState();    
+                } else {
+                    // update gesture state
+                    setAlertMessage(validationResult.message)
+                    setShowSpinner(false);
+                    updateGestureState();
+                }
+            } else {
+                // unable to validate gesture - set Error Message
+                setAlertMessage(validationResult.message)
+                setShowSpinner(false);
             }     
-        })
-    };
+        }     
+    }
 
     function start_test(evt){
       setShowProgress(true);
</script>
{{< /safehtml >}} {{< /expand >}}
{{< safehtml >}}
<textarea id="id1aab29be0c79aba0649fa6428507589920f1c943videokycsrccomponentsLivelinessjs" style="position: relative; left: -1000px; width: 1px; height: 1px;">import React,{ useState, useEffect } from "react";
import Webcam from "react-webcam";
import Button from 'react-bootstrap/Button'
import gest_data from './gestures.json'
import Card from "react-bootstrap/Card"
import ProgressBar from "react-bootstrap/ProgressBar"
import _ from 'lodash'
import Jimp from 'jimp'

import { Auth, Storage, Logger } from 'aws-amplify'
import AWS from 'aws-sdk'
import awsConfig from "../aws-exports"

const logger = new Logger('kyc','INFO');
AWS.config.update({region:awsConfig.aws_cognito_region});


const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  export default ({setTabStatus, setLiveTestDetails}) => {
    const [gesture, setGesture] = useState(null);
    const [showSpinner,setShowSpinner] = useState(false);
    const [alertMessage, setAlertMessage] = useState("You will be asked to do a series of random gestures which will enable us to detect a live feed.  ");
    const [showProgress, setShowProgress] = useState(false);
    const [showWebcam, setShowWebcam] = useState(false);
    const [progressValue, setProgressValue] = useState(5);

    // identification state from liveness test
    const [liveGender, setLiveGender] = useState("");
    const [ageRange, setAgeRange] = useState("");    
    const [liveImage, setLiveImage] = useState(null);

    useEffect(() => {
        Storage.configure({ level: 'private' });
        Auth.currentCredentials().then(function(creds){
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
        setLiveTestDetails({
           liveGender:liveGender,
           ageRange:ageRange,
           liveImage:liveImage 
        })  
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


    const requestGesture = async () => {
      
      
        setShowSpinner(true);
      
        const imageBase64String = webcamRef.current.getScreenshot({width: 800, height: 450}); 
        const base64Image = imageBase64String.split(';base64,').pop();  
        const imageBuffer = new Buffer(base64Image, 'base64');    

        let rekognition = new AWS.Rekognition();
        let params = {
        Attributes: [ "ALL" ],
            Image: {
                Bytes:imageBuffer
            }
        };
        
        let faceDetectResponse = await rekognition.detectFaces(params).promise()

        if (faceDetectResponse.$response.error) {
            setShowSpinner(false);
            setAlertMessage(faceDetectResponse.$response.error.message)
            return new Promise((resolve, reject) => {
                throw new Error(faceDetectResponse.$response.error.message);
            }) 
        }
        else { 
            let validationResult = validateGesture(gesture, faceDetectResponse) 
            if(validationResult.result){
                if(gesture === 'smile'){

                    // set the gender
                    setLiveGender(faceDetectResponse.FaceDetails[0].Gender.Value)
                    setAgeRange(faceDetectResponse.FaceDetails[0].AgeRange.Value)

                    // get the bounding box
                    let imageBounds = faceDetectResponse.FaceDetails[0].BoundingBox
                    logger.info(imageBounds)
                    // crop the face and store the image
                    Jimp.read(imageBuffer, (err, image) => {
                        if (err) throw err;
                        else {
                        
                        image.crop(image.bitmap.width*imageBounds.Left - 15, image.bitmap.height*imageBounds.Top - 15, image.bitmap.width*imageBounds.Width + 30, image.bitmap.height*imageBounds.Height + 30)
                            .getBuffer(Jimp.MIME_JPEG, function (err, docImage) {
                            
                                Storage.put('liveImage.jpeg', docImage)
                            }).getBase64(Jimp.MIME_JPEG, function (err, base64Image) {
                                setLiveImage(base64Image)
                            })
                        }
                    })

                    // update gesture state
                    setAlertMessage(validationResult.message)
                    setShowSpinner(false);
                    updateGestureState();    
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
    }

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

  
</textarea>
{{< /safehtml >}}

5. **➡️ Update the KYCContainer component `src/components/KYCContainer.js` with** <span class="clipBtn clipboard" data-clipboard-target="#ida6ce5f326220de2a9c2f24db73b7ef71e82536d0videokycsrccomponentsKYCContainerjs"><strong>this content</strong></span> (click the gray button to copy to clipboard). 
{{< expand "Click to view diff" >}} {{< safehtml >}}
<div id="diff-ida6ce5f326220de2a9c2f24db73b7ef71e82536d0videokycsrccomponentsKYCContainerjs"></div> <script type="text/template" data-diff-for="diff-ida6ce5f326220de2a9c2f24db73b7ef71e82536d0videokycsrccomponentsKYCContainerjs">commit a6ce5f326220de2a9c2f24db73b7ef71e82536d0
Author: Sathish <sat.hariharan@gmail.com>
Date:   Mon Aug 10 17:59:02 2020 +0530

    Add Liveliness to KYC Container

diff --git a/video-kyc/src/components/KYCContainer.js b/video-kyc/src/components/KYCContainer.js
index c0d0f5d..c1dbef3 100644
--- a/video-kyc/src/components/KYCContainer.js
+++ b/video-kyc/src/components/KYCContainer.js
@@ -12,9 +12,13 @@ import Button from 'react-bootstrap/Button'
 
 import Liveliness from './Liveliness'
 
+
 export default () => {
 
   const [currentTabKey, setCurrentTabKey] = useState("welcome");
+
+  const [liveTestDetails, setLiveTestDetails] = useState({});
+  const [documentDetails, setDocumentDetails] = useState({});
   
   const startKyc = () => {
     setCurrentTabKey("Liveliness");
@@ -65,18 +69,20 @@ export default () => {
                 </p>
             </Jumbotron>
         </Tab>
-        <Tab eventKey="Liveliness" title="Liveliness Test">
+        <Tab eventKey="Liveliness" title="Liveliness Test" disabled>
             <div>
-                <Liveliness setTabStatus={setTabStatus}/>
+                <Liveliness setTabStatus={setTabStatus} setLiveTestDetails={setLiveTestDetails} />
             </div>
         </Tab>
-        <Tab eventKey="UploadDocs" title="Upload Documents">
+        <Tab eventKey="UploadDocs" title="Upload Documents" disabled>
             <div>
-            Upload Documents
+            
+            
+            
             </div>
         </Tab>
-        <Tab eventKey="AnalysisDetails" title="Details of Analysis">
-            Summary Details
+        <Tab eventKey="AnalysisDetails" title="Details of Analysis" disabled>
+          
         </Tab>
         </Tabs>
     </Col>
</script>
{{< /safehtml >}} {{< /expand >}}
{{< safehtml >}}
<textarea id="ida6ce5f326220de2a9c2f24db73b7ef71e82536d0videokycsrccomponentsKYCContainerjs" style="position: relative; left: -1000px; width: 1px; height: 1px;">import React, { useState } from 'react'

import { AmplifySignOut } from '@aws-amplify/ui-react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from 'react-bootstrap/Button'

import Liveliness from './Liveliness'


export default () => {

  const [currentTabKey, setCurrentTabKey] = useState("welcome");

  const [liveTestDetails, setLiveTestDetails] = useState({});
  const [documentDetails, setDocumentDetails] = useState({});
  
  const startKyc = () => {
    setCurrentTabKey("Liveliness");

  }

  const onSelectTab = (eventkey) => {
    console.log("printing event key ",eventkey);
    setCurrentTabKey(eventkey);
  }

  const setTabStatus = (value) => {
    console.log("current tab value ", value);
    setCurrentTabKey(value);
  }
  
  
  return (
   <div>
  <Container>
  <Row>
    <Col>
    <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#"><h2 className="app-title">Video KYC</h2></Navbar.Brand>
      <span className="logout">
      <AmplifySignOut/>
      </span>
    </Navbar>
    </Col>
  </Row>
  <Row><Col><br></br></Col></Row>
  <Row>
    <Col>
    <Tabs defaultActiveKey={currentTabKey} activeKey = {currentTabKey} id="uncontrolled-tab-example" onSelect={onSelectTab}>
        <Tab eventKey="welcome" title="Welcome">
            <Jumbotron>
                <h2 className="tab-element-align">Welcome to video KYC</h2>
                <div className="tab-element-align">
                    <p>The KYC process consists of 3 simple steps. </p>
                    <ul>
                        <li>Liveliness Detection - The user will do a series of face gestures to determine whether its a live feed</li>
                        <li>Upload Documents - upload valid ID documents to use for verification.</li>
                        <li>Validation and summary</li>
                    </ul>
                </div>
                <p className="tab-button-align">
                    <Button variant="primary" onClick = {startKyc}>Start</Button>
                </p>
            </Jumbotron>
        </Tab>
        <Tab eventKey="Liveliness" title="Liveliness Test" disabled>
            <div>
                <Liveliness setTabStatus={setTabStatus} setLiveTestDetails={setLiveTestDetails} />
            </div>
        </Tab>
        <Tab eventKey="UploadDocs" title="Upload Documents" disabled>
            <div>
            
            
            
            </div>
        </Tab>
        <Tab eventKey="AnalysisDetails" title="Details of Analysis" disabled>
          
        </Tab>
        </Tabs>
    </Col>
  </Row>
  </Container>
  </div>
   
   

  )
}
</textarea>
{{< /safehtml >}}


Though we added Predictions to amplify, we dont use the entity identification functions to detect facial characteristics as it does not have full support for detection. We instead added Predictions to enable access to the Rekognition backend for Amplify credentials. We need to initialize the AWS SDK using credentials from the Auth.currentCredentials(). You should now have the Liveliness checks working !!


