+++
title = "Setting up the Front End"
chapter = false
weight = 20
+++

We will now create a front end for the liveness feature to capture the portrait of the user. For ths we add a new Liveliness component to our recat app which includes a webcan integration. We will use the react-webcam component for this purpose. The liveness checks uses AWS Rekognition detect faces functionality to check of facial gestures like smile, open mouth and closed eyes. We use the Rekognition sdk in Amplify by enabling the Predictions feature with appropriate inputs.

1. **➡️ Run** `npm install --save 'react-webcam'` to add the webcam component.

2. **➡️ Run** `npm install --save 'lodash'` as we use this library for data structures

3. **➡️ Create a new file `src/components/gestures.json` with** ___CLIPBOARD_BUTTON f77ec89eb8e98c6d9706c221315a4a5b9ec0d618:video-kyc/src/components/gestures.json|

4. **➡️ Create a new component `src/components/Liveliness.js` with** ___CLIPBOARD_BUTTON 6d5b9805fcaca7611f2e074b473a08596aad180c:video-kyc/src/components/Liveliness.js|

5. **➡️ Update the KYCContainer component `src/components/KYCContainer.js` with** ___CLIPBOARD_BUTTON a6ce5f326220de2a9c2f24db73b7ef71e82536d0:video-kyc/src/components/KYCContainer.js|


Though we added Predictions to amplify, we dont use the entity identification functions to detect facial characteristics as it does not have full support for detection. We instead added Predictions to enable access to the Rekognition backend for Amplify credentials. We need to initialize the AWS SDK using credentials from the Auth.currentCredentials(). You should now have the Liveliness checks working !!


