+++
title = "Setting up the Front End"
chapter = false
weight = 20
+++

We will now create a front end for the Document check feature to capture the phot id of the user. For ths we add a new Upload component to our react app. We have already added all necessary libraries for the previous component. We jut need to add code to enable this feature.

1. **➡️ Create a new component `src/components/AnalyzeDocs.js` with** <span class="clipBtn clipboard" data-clipboard-target="#idf7530e6d5fa7c225620938a8303c2200d5861884videokycsrccomponentsAnalyzeDocsjs"><strong>this content</strong></span> (click the gray button to copy to clipboard). 
{{< expand "Click to view diff" >}} {{< safehtml >}}
<div id="diff-idf7530e6d5fa7c225620938a8303c2200d5861884videokycsrccomponentsAnalyzeDocsjs"></div> <script type="text/template" data-diff-for="diff-idf7530e6d5fa7c225620938a8303c2200d5861884videokycsrccomponentsAnalyzeDocsjs">commit f7530e6d5fa7c225620938a8303c2200d5861884
Author: Sathish <sat.hariharan@gmail.com>
Date:   Mon Aug 10 22:03:01 2020 +0530

    add AnalyzeDocs

diff --git a/video-kyc/src/components/AnalyzeDocs.js b/video-kyc/src/components/AnalyzeDocs.js
new file mode 100644
index 0000000..2d4bb99
--- /dev/null
+++ b/video-kyc/src/components/AnalyzeDocs.js
@@ -0,0 +1,280 @@
+import React,{ useState, useEffect } from "react";
+import Webcam from "react-webcam";
+import Button from 'react-bootstrap/Button'
+import Card from "react-bootstrap/Card"
+import ProgressBar from "react-bootstrap/ProgressBar"
+import _ from 'lodash'
+import Jimp from 'jimp'
+
+import { Auth, Logger } from 'aws-amplify'
+import AWS from 'aws-sdk'
+import awsConfig from "../aws-exports"
+
+const logger = new Logger('kyc-analyze','INFO');
+AWS.config.update({region:awsConfig.aws_cognito_region});
+
+
+const videoConstraints = {
+    width: 1280,
+    height: 720,
+    facingMode: "user"
+};
+
+const side_data = [
+    {"name":"front", "description":"Show the front of the Photo ID to the camera"},
+    {"name":"back", "description":"Show the back of the Photo ID to the camera"}
+]  
+
+  export default ({setTabStatus, documentDetails, setDocumentDetails }) => {
+    const [side, setSide] = useState(null);
+    const [showSpinner,setShowSpinner] = useState(false);
+    const [alertMessage, setAlertMessage] = useState("You will be asked to display the front and back of photo IDs.  ");
+    const [showProgress, setShowProgress] = useState(false);
+    const [showWebcam, setShowWebcam] = useState(false);
+    const [progressValue, setProgressValue] = useState(0);
+
+    // identification state from document
+    const [gender, setGender] = useState("");
+    const [dob, setDob] = useState("");
+    const [userName, setUserName] = useState("");
+    const [documentImage, setDocumentImage] = useState("");
+    
+
+    useEffect(() => {
+        Auth.currentCredentials().then(function(creds){
+            AWS.config.update(creds);   
+        })
+
+    },[])
+
+    useEffect(() => {
+            
+      if(side !== null)  {
+        const description = getSideDescription(side)  
+        setAlertMessage(description + ". Click button to continue =>  ")
+      }
+  
+    },[side])
+
+   
+
+    const getSideDescription = (side) => {
+        return _.find(side_data, function(gest){
+            return gest.name === side;
+        }).description
+    }
+    
+
+    const proceedToNext = () => {
+        setDocumentDetails({
+            name:userName,
+            dateOfBirth:dob,
+            gender:gender,
+            userImage:documentImage
+        })
+      setTabStatus("AnalysisDetails");
+    }
+
+  
+
+    const captureFaceDetails = async (imageBuffer) => {
+        let rekognition = new AWS.Rekognition();
+        
+        logger.info("Calling rekognition face Detect")
+        let faceDetectParams = {
+            Attributes: [ "ALL" ],
+            Image: {
+                Bytes:imageBuffer
+            }
+        };
+        let faceDetectResponse = await rekognition.detectFaces(faceDetectParams).promise();
+        if(faceDetectResponse.$response.error) {
+            setShowSpinner(false);
+            setAlertMessage(faceDetectResponse.$response.error.message)
+            return new Promise((resolve, reject) => {
+                throw new Error(faceDetectResponse.$response.error.message);
+            }) 
+        }
+        else {
+            logger.info('rekgn ', faceDetectResponse)
+            
+            if(faceDetectResponse.FaceDetails.length === 0){
+                // more than one face
+                return new Promise((resolve, reject) => {
+                    throw new Error("Could not recognize a face. Try again ");
+                }) 
+            }
+
+            setGender(faceDetectResponse.FaceDetails[0].Gender.Value)
+            setAlertMessage("Captured image details")
+            setProgressValue(50)
+
+            // get the bounding box
+            let imageBounds = faceDetectResponse.FaceDetails[0].BoundingBox
+            logger.info(imageBounds)
+            // crop the face and store the image
+            Jimp.read(imageBuffer, (err, image) => {
+                if (err) throw err;
+                else {
+                  
+                  image.crop(image.bitmap.width*imageBounds.Left - 15, image.bitmap.height*imageBounds.Top - 15, image.bitmap.width*imageBounds.Width + 30, image.bitmap.height*imageBounds.Height + 30)
+                    .quality(100)
+                    .getBase64(Jimp.MIME_JPEG, function (err, base64Image) {
+                        setDocumentImage(base64Image)
+                    })
+                }
+              })
+        }
+        return faceDetectResponse
+    } 
+
+    const captureTextDetails = async (image) => {
+        let rekognition = new AWS.Rekognition();
+        
+        let textDetectParams = {
+            Image: {
+                Bytes:image
+            }
+        };
+        let textDetectResponse = await rekognition.detectText(textDetectParams).promise();
+        var allText 
+        if(textDetectResponse.$response.error) {
+            setShowSpinner(false);
+            setAlertMessage(textDetectResponse.$response.error.message)
+            return new Promise((resolve, reject) => {
+                throw new Error(textDetectResponse.$response.error.message);
+            }) 
+        }
+        else {
+            let detectedLines = _.filter(textDetectResponse.TextDetections, function(item){
+                return item.Type === 'LINE' && item.Confidence > 80
+            })    
+            logger.info("Lines ", detectedLines)
+            let detectedTextMap = _.map(detectedLines,(item) => item.DetectedText)
+            allText = _.join(detectedTextMap, ' ')
+        }
+
+        let comprehend = new AWS.Comprehend();    
+        let comprehendParams = {
+            Text: allText,
+            LanguageCode: 'en' 
+          };
+        
+        let detectEntitiesResponse = await comprehend.detectEntities(comprehendParams).promise();
+        if(detectEntitiesResponse.$response.error) {
+            setShowSpinner(false);
+            setAlertMessage(detectEntitiesResponse.$response.error.message)
+        }
+        else {
+            logger.info('comprehend out', detectEntitiesResponse)
+            let filteredEntities = _.filter(detectEntitiesResponse.Entities,(entity) => entity.Score > 0.7)
+            
+            let personEntity = _.find(filteredEntities,(entity) => entity.Type === 'PERSON')
+            if(!personEntity){
+                setAlertMessage("Unable to recognize name, Try again ")
+                setProgressValue(5)
+                return new Promise((resolve, reject) => {
+                    throw new Error("Unable to recognize name, Try again ");
+                }) 
+            } else {
+                
+                setUserName(personEntity.Text)
+                setProgressValue(70)
+            }
+            
+            let dobEntity = _.find(filteredEntities,(entity) => entity.Type === 'DATE')
+            if(!dobEntity){
+                setAlertMessage("Unable to recognize date of birth, Try again ")
+                setProgressValue(5)
+                return new Promise((resolve, reject) => {
+                    throw new Error("Unable to recognize date of birth, Try again ");
+                }) 
+            } else {
+                setDob(dobEntity.Text)
+                setProgressValue(80)
+            }
+            
+            
+            setAlertMessage("Captured Document details")
+            setProgressValue(90)
+        }
+
+        return detectEntitiesResponse
+    } 
+
+
+    const requestSide = async () => {
+      
+      
+        setShowSpinner(true);
+      
+        const imageBase64String = webcamRef.current.getScreenshot({width: 800, height: 450}); 
+        const base64Image = imageBase64String.split(';base64,').pop();  
+        const binaryImg = new Buffer(base64Image, 'base64');    
+
+        try {
+            await captureFaceDetails(binaryImg)
+
+            await captureTextDetails(binaryImg)
+
+            setProgressValue(100)    
+            setShowSpinner(false)
+            setShowWebcam(false);
+            setAlertMessage("Document processed successfully.  ")
+            
+            
+        } catch(error){
+            setAlertMessage(error.message)
+            setProgressValue(5)
+            setShowSpinner(false)
+        }
+        
+
+        
+    }
+
+    function start_test(evt){
+      setProgressValue(5)  
+      setShowProgress(true);
+      setShowWebcam(true);
+      setSide("front")
+    }
+
+    const webcamRef = React.useRef(null);
+   
+   
+    return (
+      <>
+        <Card>
+            <Card.Header>
+                {alertMessage} 
+                {!showProgress && <Button variant="primary" onClick={start_test}>Start</Button>}
+                {progressValue === 5 && <Button variant="primary" onClick={requestSide}>Validate</Button>}
+                {progressValue === 100 && <Button variant="primary" onClick={proceedToNext}>Continue</Button>}
+            </Card.Header>
+            
+            <Card.Body>
+                {showSpinner && <div className="spinner" ></div>}
+                {showWebcam && <div className="video-padding">
+                        <Webcam
+                            audio={false}
+                            height={450}
+                            ref={webcamRef}
+                            screenshotFormat="image/jpeg"
+                            width={800}
+                            videoConst
+                            raints={videoConstraints}
+                        />
+                        
+                    </div>
+                }
+                
+                {progressValue !== 0 && showProgress &&  <div className="live-progressbar"><ProgressBar key={progressValue} now={progressValue} label={`${progressValue}%`} /></div> }
+
+            </Card.Body>
+        </Card>
+      </>
+    );
+  };
+
+  
\ No newline at end of file
</script>
{{< /safehtml >}} {{< /expand >}}
{{< safehtml >}}
<textarea id="idf7530e6d5fa7c225620938a8303c2200d5861884videokycsrccomponentsAnalyzeDocsjs" style="position: relative; left: -1000px; width: 1px; height: 1px;">import React,{ useState, useEffect } from "react";
import Webcam from "react-webcam";
import Button from 'react-bootstrap/Button'
import Card from "react-bootstrap/Card"
import ProgressBar from "react-bootstrap/ProgressBar"
import _ from 'lodash'
import Jimp from 'jimp'

import { Auth, Logger } from 'aws-amplify'
import AWS from 'aws-sdk'
import awsConfig from "../aws-exports"

const logger = new Logger('kyc-analyze','INFO');
AWS.config.update({region:awsConfig.aws_cognito_region});


const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

const side_data = [
    {"name":"front", "description":"Show the front of the Photo ID to the camera"},
    {"name":"back", "description":"Show the back of the Photo ID to the camera"}
]  

  export default ({setTabStatus, documentDetails, setDocumentDetails }) => {
    const [side, setSide] = useState(null);
    const [showSpinner,setShowSpinner] = useState(false);
    const [alertMessage, setAlertMessage] = useState("You will be asked to display the front and back of photo IDs.  ");
    const [showProgress, setShowProgress] = useState(false);
    const [showWebcam, setShowWebcam] = useState(false);
    const [progressValue, setProgressValue] = useState(0);

    // identification state from document
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [userName, setUserName] = useState("");
    const [documentImage, setDocumentImage] = useState("");
    

    useEffect(() => {
        Auth.currentCredentials().then(function(creds){
            AWS.config.update(creds);   
        })

    },[])

    useEffect(() => {
            
      if(side !== null)  {
        const description = getSideDescription(side)  
        setAlertMessage(description + ". Click button to continue =>  ")
      }
  
    },[side])

   

    const getSideDescription = (side) => {
        return _.find(side_data, function(gest){
            return gest.name === side;
        }).description
    }
    

    const proceedToNext = () => {
        setDocumentDetails({
            name:userName,
            dateOfBirth:dob,
            gender:gender,
            userImage:documentImage
        })
      setTabStatus("AnalysisDetails");
    }

  

    const captureFaceDetails = async (imageBuffer) => {
        let rekognition = new AWS.Rekognition();
        
        logger.info("Calling rekognition face Detect")
        let faceDetectParams = {
            Attributes: [ "ALL" ],
            Image: {
                Bytes:imageBuffer
            }
        };
        let faceDetectResponse = await rekognition.detectFaces(faceDetectParams).promise();
        if(faceDetectResponse.$response.error) {
            setShowSpinner(false);
            setAlertMessage(faceDetectResponse.$response.error.message)
            return new Promise((resolve, reject) => {
                throw new Error(faceDetectResponse.$response.error.message);
            }) 
        }
        else {
            logger.info('rekgn ', faceDetectResponse)
            
            if(faceDetectResponse.FaceDetails.length === 0){
                // more than one face
                return new Promise((resolve, reject) => {
                    throw new Error("Could not recognize a face. Try again ");
                }) 
            }

            setGender(faceDetectResponse.FaceDetails[0].Gender.Value)
            setAlertMessage("Captured image details")
            setProgressValue(50)

            // get the bounding box
            let imageBounds = faceDetectResponse.FaceDetails[0].BoundingBox
            logger.info(imageBounds)
            // crop the face and store the image
            Jimp.read(imageBuffer, (err, image) => {
                if (err) throw err;
                else {
                  
                  image.crop(image.bitmap.width*imageBounds.Left - 15, image.bitmap.height*imageBounds.Top - 15, image.bitmap.width*imageBounds.Width + 30, image.bitmap.height*imageBounds.Height + 30)
                    .quality(100)
                    .getBase64(Jimp.MIME_JPEG, function (err, base64Image) {
                        setDocumentImage(base64Image)
                    })
                }
              })
        }
        return faceDetectResponse
    } 

    const captureTextDetails = async (image) => {
        let rekognition = new AWS.Rekognition();
        
        let textDetectParams = {
            Image: {
                Bytes:image
            }
        };
        let textDetectResponse = await rekognition.detectText(textDetectParams).promise();
        var allText 
        if(textDetectResponse.$response.error) {
            setShowSpinner(false);
            setAlertMessage(textDetectResponse.$response.error.message)
            return new Promise((resolve, reject) => {
                throw new Error(textDetectResponse.$response.error.message);
            }) 
        }
        else {
            let detectedLines = _.filter(textDetectResponse.TextDetections, function(item){
                return item.Type === 'LINE' && item.Confidence > 80
            })    
            logger.info("Lines ", detectedLines)
            let detectedTextMap = _.map(detectedLines,(item) => item.DetectedText)
            allText = _.join(detectedTextMap, ' ')
        }

        let comprehend = new AWS.Comprehend();    
        let comprehendParams = {
            Text: allText,
            LanguageCode: 'en' 
          };
        
        let detectEntitiesResponse = await comprehend.detectEntities(comprehendParams).promise();
        if(detectEntitiesResponse.$response.error) {
            setShowSpinner(false);
            setAlertMessage(detectEntitiesResponse.$response.error.message)
        }
        else {
            logger.info('comprehend out', detectEntitiesResponse)
            let filteredEntities = _.filter(detectEntitiesResponse.Entities,(entity) => entity.Score > 0.7)
            
            let personEntity = _.find(filteredEntities,(entity) => entity.Type === 'PERSON')
            if(!personEntity){
                setAlertMessage("Unable to recognize name, Try again ")
                setProgressValue(5)
                return new Promise((resolve, reject) => {
                    throw new Error("Unable to recognize name, Try again ");
                }) 
            } else {
                
                setUserName(personEntity.Text)
                setProgressValue(70)
            }
            
            let dobEntity = _.find(filteredEntities,(entity) => entity.Type === 'DATE')
            if(!dobEntity){
                setAlertMessage("Unable to recognize date of birth, Try again ")
                setProgressValue(5)
                return new Promise((resolve, reject) => {
                    throw new Error("Unable to recognize date of birth, Try again ");
                }) 
            } else {
                setDob(dobEntity.Text)
                setProgressValue(80)
            }
            
            
            setAlertMessage("Captured Document details")
            setProgressValue(90)
        }

        return detectEntitiesResponse
    } 


    const requestSide = async () => {
      
      
        setShowSpinner(true);
      
        const imageBase64String = webcamRef.current.getScreenshot({width: 800, height: 450}); 
        const base64Image = imageBase64String.split(';base64,').pop();  
        const binaryImg = new Buffer(base64Image, 'base64');    

        try {
            await captureFaceDetails(binaryImg)

            await captureTextDetails(binaryImg)

            setProgressValue(100)    
            setShowSpinner(false)
            setShowWebcam(false);
            setAlertMessage("Document processed successfully.  ")
            
            
        } catch(error){
            setAlertMessage(error.message)
            setProgressValue(5)
            setShowSpinner(false)
        }
        

        
    }

    function start_test(evt){
      setProgressValue(5)  
      setShowProgress(true);
      setShowWebcam(true);
      setSide("front")
    }

    const webcamRef = React.useRef(null);
   
   
    return (
      <>
        <Card>
            <Card.Header>
                {alertMessage} 
                {!showProgress && <Button variant="primary" onClick={start_test}>Start</Button>}
                {progressValue === 5 && <Button variant="primary" onClick={requestSide}>Validate</Button>}
                {progressValue === 100 && <Button variant="primary" onClick={proceedToNext}>Continue</Button>}
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
                
                {progressValue !== 0 && showProgress &&  <div className="live-progressbar"><ProgressBar key={progressValue} now={progressValue} label={`${progressValue}%`} /></div> }

            </Card.Body>
        </Card>
      </>
    );
  };

  
</textarea>
{{< /safehtml >}}

5. **➡️ Update the KYCContainer component `src/components/KYCContainer.js` with** <span class="clipBtn clipboard" data-clipboard-target="#id8ff03f90a36340d07a0320feef1c728fed2990b9videokycsrccomponentsKYCContainerjs"><strong>this content</strong></span> (click the gray button to copy to clipboard). 
{{< expand "Click to view diff" >}} {{< safehtml >}}
<div id="diff-id8ff03f90a36340d07a0320feef1c728fed2990b9videokycsrccomponentsKYCContainerjs"></div> <script type="text/template" data-diff-for="diff-id8ff03f90a36340d07a0320feef1c728fed2990b9videokycsrccomponentsKYCContainerjs">commit 8ff03f90a36340d07a0320feef1c728fed2990b9
Author: Sathish <sat.hariharan@gmail.com>
Date:   Mon Aug 10 22:03:27 2020 +0530

    add AnalyzeDocs Component t o container

diff --git a/video-kyc/src/components/KYCContainer.js b/video-kyc/src/components/KYCContainer.js
index c1dbef3..ab847ed 100644
--- a/video-kyc/src/components/KYCContainer.js
+++ b/video-kyc/src/components/KYCContainer.js
@@ -11,6 +11,7 @@ import Jumbotron from 'react-bootstrap/Jumbotron'
 import Button from 'react-bootstrap/Button'
 
 import Liveliness from './Liveliness'
+import AnalyzeDocs from './AnalyzeDocs'
 
 
 export default () => {
@@ -76,9 +77,7 @@ export default () => {
         </Tab>
         <Tab eventKey="UploadDocs" title="Upload Documents" disabled>
             <div>
-            
-            
-            
+              <AnalyzeDocs setTabStatus={setTabStatus} setDocumentDetails={setDocumentDetails} />
             </div>
         </Tab>
         <Tab eventKey="AnalysisDetails" title="Details of Analysis" disabled>
</script>
{{< /safehtml >}} {{< /expand >}}
{{< safehtml >}}
<textarea id="id8ff03f90a36340d07a0320feef1c728fed2990b9videokycsrccomponentsKYCContainerjs" style="position: relative; left: -1000px; width: 1px; height: 1px;">import React, { useState } from 'react'

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
import AnalyzeDocs from './AnalyzeDocs'


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
              <AnalyzeDocs setTabStatus={setTabStatus} setDocumentDetails={setDocumentDetails} />
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


Though we added Predictions to amplify, we use the AWS SDK APIs directly to implement face detection, text detection and entity detection in text


