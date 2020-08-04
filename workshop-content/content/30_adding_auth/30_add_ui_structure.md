+++
title = "Add UI Scaffold"
chapter = false
weight = 30
+++

Now that we have authentication enabled we will create the overall scaffold for the user interface. The UI will consist of tabs to keep things simple. We will add a container to hold the state of the app and perform the various tasks in different tabs.

We will add a separate components folder to hold the container and the individual components

**➡️ In the video-kyc/src folder, run** `mkdir components`.

Within the components folder create a new file KYCContainer.js and add <span class="clipBtn clipboard" data-clipboard-target="#id380db0eae66e04b9213cdb1ee89e2d30faee24abvideokycsrccomponentsKYCContainerjs"><strong>this content</strong></span> (click the gray button to copy to clipboard). 
{{< expand "Click to view diff" >}} {{< safehtml >}}
<div id="diff-id380db0eae66e04b9213cdb1ee89e2d30faee24abvideokycsrccomponentsKYCContainerjs"></div> <script type="text/template" data-diff-for="diff-id380db0eae66e04b9213cdb1ee89e2d30faee24abvideokycsrccomponentsKYCContainerjs">commit 380db0eae66e04b9213cdb1ee89e2d30faee24ab
Author: Sathish <sat.hariharan@gmail.com>
Date:   Tue Aug 4 22:35:51 2020 +0530

    create KYCContainer

diff --git a/video-kyc/src/components/KYCContainer.js b/video-kyc/src/components/KYCContainer.js
new file mode 100644
index 0000000..48c9ba0
--- /dev/null
+++ b/video-kyc/src/components/KYCContainer.js
@@ -0,0 +1,85 @@
+import React, { useState } from 'react'
+
+import { AmplifySignOut } from '@aws-amplify/ui-react'
+import Navbar from 'react-bootstrap/Navbar'
+import Container from 'react-bootstrap/Container'
+import Row from 'react-bootstrap/Row'
+import Col from 'react-bootstrap/Col'
+import Tabs from 'react-bootstrap/Tabs'
+import Tab from 'react-bootstrap/Tab'
+import Jumbotron from 'react-bootstrap/Jumbotron'
+import Button from 'react-bootstrap/Button'
+
+
+export default () => {
+
+  const [currentTabKey, setCurrentTabKey] = useState("welcome");
+  
+  const startKyc = () => {
+    setCurrentTabKey("Liveliness");
+
+  }
+
+  const onSelectTab = (eventkey) => {
+    console.log("printing event key ",eventkey);
+    setCurrentTabKey(eventkey);
+  }
+
+  
+  
+  return (
+   <div>
+  <Container>
+  <Row>
+    <Col>
+    <Navbar bg="dark" variant="dark">
+    <Navbar.Brand href="#"><h2 className="app-title">Video KYC</h2></Navbar.Brand>
+      <span className="logout">
+      <AmplifySignOut/>
+      </span>
+    </Navbar>
+    </Col>
+  </Row>
+  <Row><Col><br></br></Col></Row>
+  <Row>
+    <Col>
+    <Tabs defaultActiveKey={currentTabKey} activeKey = {currentTabKey} id="uncontrolled-tab-example" onSelect={onSelectTab}>
+        <Tab eventKey="welcome" title="Welcome">
+            <Jumbotron>
+                <h2 className="tab-element-align">Welcome to video KYC</h2>
+                <div className="tab-element-align">
+                    <p>The KYC process consists of 3 simple steps. </p>
+                    <ul>
+                        <li>Liveliness Detection - The user will do a series of face gestures to determine whether its a live feed</li>
+                        <li>Upload Documents - upload valid ID documents to use for verification.</li>
+                        <li>Validation and summary</li>
+                    </ul>
+                </div>
+                <p className="tab-button-align">
+                    <Button variant="primary" onClick = {startKyc}>Start</Button>
+                </p>
+            </Jumbotron>
+        </Tab>
+        <Tab eventKey="Liveliness" title="Liveliness Test">
+            <div>
+                Liveliness Check !
+            </div>
+        </Tab>
+        <Tab eventKey="UploadDocs" title="Upload Documents">
+            <div>
+            Upload Documents
+            </div>
+        </Tab>
+        <Tab eventKey="AnalysisDetails" title="Details of Analysis">
+            Summary Details
+        </Tab>
+        </Tabs>
+    </Col>
+  </Row>
+  </Container>
+  </div>
+   
+   
+
+  )
+}
\ No newline at end of file
</script>
{{< /safehtml >}} {{< /expand >}}
{{< safehtml >}}
<textarea id="id380db0eae66e04b9213cdb1ee89e2d30faee24abvideokycsrccomponentsKYCContainerjs" style="position: relative; left: -1000px; width: 1px; height: 1px;">import React, { useState } from 'react'

import { AmplifySignOut } from '@aws-amplify/ui-react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from 'react-bootstrap/Button'


export default () => {

  const [currentTabKey, setCurrentTabKey] = useState("welcome");
  
  const startKyc = () => {
    setCurrentTabKey("Liveliness");

  }

  const onSelectTab = (eventkey) => {
    console.log("printing event key ",eventkey);
    setCurrentTabKey(eventkey);
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
        <Tab eventKey="Liveliness" title="Liveliness Test">
            <div>
                Liveliness Check !
            </div>
        </Tab>
        <Tab eventKey="UploadDocs" title="Upload Documents">
            <div>
            Upload Documents
            </div>
        </Tab>
        <Tab eventKey="AnalysisDetails" title="Details of Analysis">
            Summary Details
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

**➡️ Replace `src/App.css` with** <span class="clipBtn clipboard" data-clipboard-target="#idc13d78c8972083949229d97c6a32e794e72364b6videokycsrcAppcss"><strong>this content</strong></span> (click the gray button to copy to clipboard). 
{{< expand "Click to view diff" >}} {{< safehtml >}}
<div id="diff-idc13d78c8972083949229d97c6a32e794e72364b6videokycsrcAppcss"></div> <script type="text/template" data-diff-for="diff-idc13d78c8972083949229d97c6a32e794e72364b6videokycsrcAppcss">commit c13d78c8972083949229d97c6a32e794e72364b6
Author: Sathish <sat.hariharan@gmail.com>
Date:   Tue Aug 4 22:35:33 2020 +0530

    update App.css

diff --git a/video-kyc/src/App.css b/video-kyc/src/App.css
index 74b5e05..9018bb4 100644
--- a/video-kyc/src/App.css
+++ b/video-kyc/src/App.css
@@ -28,6 +28,96 @@
   color: #61dafb;
 }
 
+.logout {
+  padding-left: 65%;
+
+}
+
+.tab-element-align {
+  padding-left : 10%;
+}
+
+.tab-button-align {
+  padding-left : 20%;
+}
+
+.live-button-align {
+  padding-left : 30%;
+}
+
+.app-title{
+  text-align: center;
+}
+
+.video-padding{
+  padding-left: 10%;
+}
+
+.upload{
+  padding: 5%;
+}
+
+.text-center {
+  text-align: center;
+}
+
+.summary-title
+{
+  text-align: center;
+  padding-top: 5%;
+}
+
+.summary-image
+{
+  padding-left: 10% !important;
+}
+
+.summary-face-details
+{
+  padding-right: 4% !important;
+}
+
+.spinner {
+  position: absolute;
+  left: 40%;
+  top: 45%;
+  height:100px;
+  width:100px;
+  margin:0px auto;
+  -webkit-animation: rotation .6s infinite linear;
+  -moz-animation: rotation .6s infinite linear;
+  -o-animation: rotation .6s infinite linear;
+  animation: rotation .6s infinite linear;
+  border-left:6px solid rgba(0,174,239,.15);
+  border-right:6px solid rgba(0,174,239,.15);
+  border-bottom:6px solid rgba(0,174,239,.15);
+  border-top:6px solid rgba(0,174,239,.8);
+  border-radius:100%;
+}
+
+@-webkit-keyframes rotation {
+  from {-webkit-transform: rotate(0deg);}
+  to {-webkit-transform: rotate(359deg);}
+}
+@-moz-keyframes rotation {
+  from {-moz-transform: rotate(0deg);}
+  to {-moz-transform: rotate(359deg);}
+}
+@-o-keyframes rotation {
+  from {-o-transform: rotate(0deg);}
+  to {-o-transform: rotate(359deg);}
+}
+@keyframes rotation {
+  from {transform: rotate(0deg);}
+  to {transform: rotate(359deg);}
+}
+
+
+.button-padding{
+  padding-left: 20% !important;
+  padding-right: 20% !important;
+}
+
 @keyframes App-logo-spin {
   from {
     transform: rotate(0deg);
@@ -35,4 +125,4 @@
   to {
     transform: rotate(360deg);
   }
-}
+}
\ No newline at end of file
</script>
{{< /safehtml >}} {{< /expand >}}
{{< safehtml >}}
<textarea id="idc13d78c8972083949229d97c6a32e794e72364b6videokycsrcAppcss" style="position: relative; left: -1000px; width: 1px; height: 1px;">.App {
  text-align: center;
}

.App-logo {
  height: 40vmin;
  pointer-events: none;
}

@media (prefers-reduced-motion: no-preference) {
  .App-logo {
    animation: App-logo-spin infinite 20s linear;
  }
}

.App-header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.App-link {
  color: #61dafb;
}

.logout {
  padding-left: 65%;

}

.tab-element-align {
  padding-left : 10%;
}

.tab-button-align {
  padding-left : 20%;
}

.live-button-align {
  padding-left : 30%;
}

.app-title{
  text-align: center;
}

.video-padding{
  padding-left: 10%;
}

.upload{
  padding: 5%;
}

.text-center {
  text-align: center;
}

.summary-title
{
  text-align: center;
  padding-top: 5%;
}

.summary-image
{
  padding-left: 10% !important;
}

.summary-face-details
{
  padding-right: 4% !important;
}

.spinner {
  position: absolute;
  left: 40%;
  top: 45%;
  height:100px;
  width:100px;
  margin:0px auto;
  -webkit-animation: rotation .6s infinite linear;
  -moz-animation: rotation .6s infinite linear;
  -o-animation: rotation .6s infinite linear;
  animation: rotation .6s infinite linear;
  border-left:6px solid rgba(0,174,239,.15);
  border-right:6px solid rgba(0,174,239,.15);
  border-bottom:6px solid rgba(0,174,239,.15);
  border-top:6px solid rgba(0,174,239,.8);
  border-radius:100%;
}

@-webkit-keyframes rotation {
  from {-webkit-transform: rotate(0deg);}
  to {-webkit-transform: rotate(359deg);}
}
@-moz-keyframes rotation {
  from {-moz-transform: rotate(0deg);}
  to {-moz-transform: rotate(359deg);}
}
@-o-keyframes rotation {
  from {-o-transform: rotate(0deg);}
  to {-o-transform: rotate(359deg);}
}
@keyframes rotation {
  from {transform: rotate(0deg);}
  to {transform: rotate(359deg);}
}


.button-padding{
  padding-left: 20% !important;
  padding-right: 20% !important;
}

@keyframes App-logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</textarea>
{{< /safehtml >}}

**➡️ Replace `src/App.js` with** <span class="clipBtn clipboard" data-clipboard-target="#id7cb8e8f48e3d3889a3f99d22c5c2e302b5082f77videokycsrcAppjs"><strong>this content</strong></span> (click the gray button to copy to clipboard). 
{{< expand "Click to view diff" >}} {{< safehtml >}}
<div id="diff-id7cb8e8f48e3d3889a3f99d22c5c2e302b5082f77videokycsrcAppjs"></div> <script type="text/template" data-diff-for="diff-id7cb8e8f48e3d3889a3f99d22c5c2e302b5082f77videokycsrcAppjs">commit 7cb8e8f48e3d3889a3f99d22c5c2e302b5082f77
Author: Sathish <sat.hariharan@gmail.com>
Date:   Tue Aug 4 22:36:02 2020 +0530

    update App.js

diff --git a/video-kyc/src/App.js b/video-kyc/src/App.js
index 94ca89e..c508334 100644
--- a/video-kyc/src/App.js
+++ b/video-kyc/src/App.js
@@ -5,14 +5,16 @@ import './App.css';
 
 import Amplify from 'aws-amplify';
 import awsconfig from './aws-exports';
+import KYCContainer from './components/KYCContainer'
+
 Amplify.configure(awsconfig);
 
+
+
 function App() {
   return (
-    <div className="App">
-      <header className="App-header">
-        Hello World !
-      </header>
+    <div>
+        <KYCContainer />
     </div>
   );
 }
</script>
{{< /safehtml >}} {{< /expand >}}
{{< safehtml >}}
<textarea id="id7cb8e8f48e3d3889a3f99d22c5c2e302b5082f77videokycsrcAppjs" style="position: relative; left: -1000px; width: 1px; height: 1px;">import React from 'react';
import { withAuthenticator} from '@aws-amplify/ui-react';

import './App.css';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import KYCContainer from './components/KYCContainer'

Amplify.configure(awsconfig);



function App() {
  return (
    <div>
        <KYCContainer />
    </div>
  );
}

export default withAuthenticator(App);

</textarea>
{{< /safehtml >}}

Take a look at the web app now and you should a page with multiple tabs like below

![UI with tabs](/images/ui_with_tabs.png)



