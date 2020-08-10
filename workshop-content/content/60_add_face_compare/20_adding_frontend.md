+++
title = "Setting up the Front End"
chapter = false
weight = 20
+++

We will now create a front end for the Compare Faces feature . For this we add a new Summary component to our react app. We have already added all necessary libraries for the previous components. We just need to add code to enable this feature.

1. **➡️ Create a new component `src/components/Summary.js` with** <span class="clipBtn clipboard" data-clipboard-target="#ide8514237da80d55cbb7b624cf44691b908df016fvideokycsrccomponentsSummaryjs"><strong>this content</strong></span> (click the gray button to copy to clipboard). 
{{< expand "Click to view diff" >}} {{< safehtml >}}
<div id="diff-ide8514237da80d55cbb7b624cf44691b908df016fvideokycsrccomponentsSummaryjs"></div> <script type="text/template" data-diff-for="diff-ide8514237da80d55cbb7b624cf44691b908df016fvideokycsrccomponentsSummaryjs">commit e8514237da80d55cbb7b624cf44691b908df016f
Author: Sathish <sat.hariharan@gmail.com>
Date:   Mon Aug 10 22:47:34 2020 +0530

    add Summary

diff --git a/video-kyc/src/components/Summary.js b/video-kyc/src/components/Summary.js
new file mode 100644
index 0000000..2dee403
--- /dev/null
+++ b/video-kyc/src/components/Summary.js
@@ -0,0 +1,177 @@
+import React,{ useState, useEffect } from "react";
+import Accordion from 'react-bootstrap/Accordion'
+import Card from 'react-bootstrap/Card'
+import Button from 'react-bootstrap/Button'
+import Container from 'react-bootstrap/Container'
+import Row from 'react-bootstrap/Row'
+import Table from 'react-bootstrap/Table'
+
+import { Auth, Logger } from 'aws-amplify'
+import AWS from 'aws-sdk'
+import awsConfig from "../aws-exports"
+
+const logger = new Logger('kyc-summary','INFO');
+AWS.config.update({region:awsConfig.aws_cognito_region});
+
+
+export default ({setTabStatus,documentDetails, liveTestDetails}) => {
+
+    const [faceSimilarity, setFaceSimilarity] = useState(-1)
+    const [alertMessage, setAlertMessage] = useState("")
+  
+    useEffect(() => {
+    
+        Auth.currentCredentials().then(function(creds){
+            AWS.config.update(creds);   
+        })
+
+    },[])
+    
+    const compareFaces = async () => {
+
+        let rekognition = new AWS.Rekognition();
+
+        
+        const sourceImage = liveTestDetails['liveImage']
+        const sourceBase64Image = sourceImage.split(';base64,').pop();  
+        const sourceBinaryImg = new Buffer(sourceBase64Image, 'base64');  
+
+        const targetImage = documentDetails['userImage']
+        const targetBase64Image = targetImage.split(';base64,').pop();  
+        const targetBinaryImg = new Buffer(targetBase64Image, 'base64');
+
+        
+        let params = {
+            SourceImage: { 
+              Bytes: sourceBinaryImg 
+              
+            },
+            TargetImage: { 
+              Bytes: targetBinaryImg
+            },
+            QualityFilter: 'NONE',
+            SimilarityThreshold: 30
+        };
+        
+
+        let compareFacesResponse = await rekognition.compareFaces(params).promise()
+        if(compareFacesResponse.$response.error) {
+            logger.info(compareFacesResponse.$response.error.message)
+            setFaceSimilarity(-1)
+            setAlertMessage(compareFacesResponse.$response.error.message)
+        } else {
+            logger.info('compare results', compareFacesResponse)
+            setFaceSimilarity(compareFacesResponse.FaceMatches[0].Similarity)
+            if(compareFacesResponse.FaceMatches[0].Similarity > 80){
+                setAlertMessage(" You have successfully completed the KYC")
+            } else {
+                setAlertMessage(" Did not pass Face similarity test. Try again !") 
+            }
+        }
+             
+    }
+        
+    
+    
+    return (
+
+        <div>
+            <Table responsive>
+            <tbody>
+                <tr>
+                    <td>
+                <Card>
+                    <Card.Header>
+                        Liveness Test Data 
+                    </Card.Header>
+                    <Card.Body>
+                        <Container>
+                            <Row>
+                            <Table responsive>
+                                <tbody>
+                                    <tr>
+                                    <td>Gender</td>
+                                    <td>{liveTestDetails["liveGender"]}</td>
+                                    </tr>
+                                    
+                                    <tr>
+                                    <td>Live Image</td>
+                                    <td>
+                                        <img src={`${liveTestDetails['liveImage']}`} />
+                                    </td>
+                                    </tr>
+                                   
+                                </tbody>
+                                </Table>
+                          
+                            </Row>
+                        </Container>
+                    </Card.Body>
+                
+                </Card>
+                </td>
+                <td>
+                <Card>
+                    <Card.Header>
+                       Data Extracted from ID documents.
+                    </Card.Header>
+                    <Card.Body>
+                        <Container>
+                            <Row>
+                            <Table responsive>
+                                <tbody>
+                                    <tr>
+                                    <td>Name</td>
+                                    <td>{documentDetails["name"]}</td>
+                                    </tr>
+
+                                    <tr>
+                                    <td>Date of Birth</td>
+                                    <td>{documentDetails["dateOfBirth"]}</td>
+                                    </tr>
+
+                                    <tr>
+                                    <td>Gender</td>
+                                    <td>{documentDetails["gender"]}</td>
+                                    </tr>
+                                    
+                                    <tr>
+                                    <td>Image</td>
+                                    <td>
+                                        <img src={`${documentDetails['userImage']}`} />
+                                    </td>
+                                    </tr>
+                                   
+                                </tbody>
+                                </Table>
+                          
+                            </Row>
+                        </Container>
+                    </Card.Body>
+                </Card>
+                </td>
+                </tr>
+                <tr>
+                    <td colspan="2">
+                    <Card>
+                        <Card.Header>
+                        Compare Faces to complete KYC
+                        </Card.Header>
+                        <Card.Body>
+                            
+                        {faceSimilarity === -1 && <Button variant="primary" onClick={compareFaces}>Compare Faces</Button> }
+
+                        {faceSimilarity !== -1 && <span>Face Similarity is <b> {Math.round(faceSimilarity, -2) }%  </b></span> }                        
+
+                         <span> {alertMessage} </span>
+                            
+                        </Card.Body>
+                    </Card>
+                </td>
+                </tr>
+                </tbody>
+            </Table>    
+
+        </div>
+    )
+};
\ No newline at end of file
</script>
{{< /safehtml >}} {{< /expand >}}
{{< safehtml >}}
<textarea id="ide8514237da80d55cbb7b624cf44691b908df016fvideokycsrccomponentsSummaryjs" style="position: relative; left: -1000px; width: 1px; height: 1px;">import React,{ useState, useEffect } from "react";
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'

import { Auth, Logger } from 'aws-amplify'
import AWS from 'aws-sdk'
import awsConfig from "../aws-exports"

const logger = new Logger('kyc-summary','INFO');
AWS.config.update({region:awsConfig.aws_cognito_region});


export default ({setTabStatus,documentDetails, liveTestDetails}) => {

    const [faceSimilarity, setFaceSimilarity] = useState(-1)
    const [alertMessage, setAlertMessage] = useState("")
  
    useEffect(() => {
    
        Auth.currentCredentials().then(function(creds){
            AWS.config.update(creds);   
        })

    },[])
    
    const compareFaces = async () => {

        let rekognition = new AWS.Rekognition();

        
        const sourceImage = liveTestDetails['liveImage']
        const sourceBase64Image = sourceImage.split(';base64,').pop();  
        const sourceBinaryImg = new Buffer(sourceBase64Image, 'base64');  

        const targetImage = documentDetails['userImage']
        const targetBase64Image = targetImage.split(';base64,').pop();  
        const targetBinaryImg = new Buffer(targetBase64Image, 'base64');

        
        let params = {
            SourceImage: { 
              Bytes: sourceBinaryImg 
              
            },
            TargetImage: { 
              Bytes: targetBinaryImg
            },
            QualityFilter: 'NONE',
            SimilarityThreshold: 30
        };
        

        let compareFacesResponse = await rekognition.compareFaces(params).promise()
        if(compareFacesResponse.$response.error) {
            logger.info(compareFacesResponse.$response.error.message)
            setFaceSimilarity(-1)
            setAlertMessage(compareFacesResponse.$response.error.message)
        } else {
            logger.info('compare results', compareFacesResponse)
            setFaceSimilarity(compareFacesResponse.FaceMatches[0].Similarity)
            if(compareFacesResponse.FaceMatches[0].Similarity > 80){
                setAlertMessage(" You have successfully completed the KYC")
            } else {
                setAlertMessage(" Did not pass Face similarity test. Try again !") 
            }
        }
             
    }
        
    
    
    return (

        <div>
            <Table responsive>
            <tbody>
                <tr>
                    <td>
                <Card>
                    <Card.Header>
                        Liveness Test Data 
                    </Card.Header>
                    <Card.Body>
                        <Container>
                            <Row>
                            <Table responsive>
                                <tbody>
                                    <tr>
                                    <td>Gender</td>
                                    <td>{liveTestDetails["liveGender"]}</td>
                                    </tr>
                                    
                                    <tr>
                                    <td>Live Image</td>
                                    <td>
                                        <img src={`${liveTestDetails['liveImage']}`} />
                                    </td>
                                    </tr>
                                   
                                </tbody>
                                </Table>
                          
                            </Row>
                        </Container>
                    </Card.Body>
                
                </Card>
                </td>
                <td>
                <Card>
                    <Card.Header>
                       Data Extracted from ID documents.
                    </Card.Header>
                    <Card.Body>
                        <Container>
                            <Row>
                            <Table responsive>
                                <tbody>
                                    <tr>
                                    <td>Name</td>
                                    <td>{documentDetails["name"]}</td>
                                    </tr>

                                    <tr>
                                    <td>Date of Birth</td>
                                    <td>{documentDetails["dateOfBirth"]}</td>
                                    </tr>

                                    <tr>
                                    <td>Gender</td>
                                    <td>{documentDetails["gender"]}</td>
                                    </tr>
                                    
                                    <tr>
                                    <td>Image</td>
                                    <td>
                                        <img src={`${documentDetails['userImage']}`} />
                                    </td>
                                    </tr>
                                   
                                </tbody>
                                </Table>
                          
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
                </td>
                </tr>
                <tr>
                    <td colspan="2">
                    <Card>
                        <Card.Header>
                        Compare Faces to complete KYC
                        </Card.Header>
                        <Card.Body>
                            
                        {faceSimilarity === -1 && <Button variant="primary" onClick={compareFaces}>Compare Faces</Button> }

                        {faceSimilarity !== -1 && <span>Face Similarity is <b> {Math.round(faceSimilarity, -2) }%  </b></span> }                        

                         <span> {alertMessage} </span>
                            
                        </Card.Body>
                    </Card>
                </td>
                </tr>
                </tbody>
            </Table>    

        </div>
    )
};
</textarea>
{{< /safehtml >}}

5. **➡️ Update the KYCContainer component `src/components/KYCContainer.js` with** <span class="clipBtn clipboard" data-clipboard-target="#id956a94b6a5bb853db9adc64b3b6a72c732778758videokycsrccomponentsKYCContainerjs"><strong>this content</strong></span> (click the gray button to copy to clipboard). 
{{< expand "Click to view diff" >}} {{< safehtml >}}
<div id="diff-id956a94b6a5bb853db9adc64b3b6a72c732778758videokycsrccomponentsKYCContainerjs"></div> <script type="text/template" data-diff-for="diff-id956a94b6a5bb853db9adc64b3b6a72c732778758videokycsrccomponentsKYCContainerjs">commit 956a94b6a5bb853db9adc64b3b6a72c732778758
Author: Sathish <sat.hariharan@gmail.com>
Date:   Mon Aug 10 22:47:50 2020 +0530

    Add Summary to Container

diff --git a/video-kyc/src/components/KYCContainer.js b/video-kyc/src/components/KYCContainer.js
index ab847ed..f0b3f3c 100644
--- a/video-kyc/src/components/KYCContainer.js
+++ b/video-kyc/src/components/KYCContainer.js
@@ -12,6 +12,7 @@ import Button from 'react-bootstrap/Button'
 
 import Liveliness from './Liveliness'
 import AnalyzeDocs from './AnalyzeDocs'
+import Summary from './Summary'
 
 
 export default () => {
@@ -81,7 +82,7 @@ export default () => {
             </div>
         </Tab>
         <Tab eventKey="AnalysisDetails" title="Details of Analysis" disabled>
-          
+        <Summary setTabStatus={setTabStatus} documentDetails={documentDetails} liveTestDetails={liveTestDetails} />
         </Tab>
         </Tabs>
     </Col>
</script>
{{< /safehtml >}} {{< /expand >}}
{{< safehtml >}}
<textarea id="id956a94b6a5bb853db9adc64b3b6a72c732778758videokycsrccomponentsKYCContainerjs" style="position: relative; left: -1000px; width: 1px; height: 1px;">import React, { useState } from 'react'

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
import Summary from './Summary'


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
        <Summary setTabStatus={setTabStatus} documentDetails={documentDetails} liveTestDetails={liveTestDetails} />
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


