+++
title = "Setting up the Front End"
chapter = false
weight = 20
+++

We will now create a front end for the liveness feature to capture the portrait of the user. For ths we add a new Liveliness component to our recat app which includes a webcan integration. We will use the react-webcam component for this purpose. The liveness checks uses AWS Rekognition detect faces functionality to check of facial gestures like smile, open mouth and closed eyes. We use the Rekognition sdk in Amplify by enabling the Predictions feature with appropriate inputs.

1. **➡️ Run** `npm install --save 'react-webcam'` to add the webcam component.

2. **➡️ Run** `npm install --save 'lodash'` as we use this library for data structures

3. **➡️ Run** `npm install --save 'jimp'` as we use this library for image cropping

4. **➡️ Run** `npm install --save 'aws-sdk'` as we use direct calls into the SDK for using features in Rekognition and later with Comprehend

5. **➡️ Create a new file `src/components/gestures.json` with** ___CLIPBOARD_BUTTON 289c28f8f0b28b9795ff1f23815b35fa9d293467:video-kyc/src/components/gestures.json|

6. **➡️ Create a new component `src/components/Liveliness.js` with** ___CLIPBOARD_BUTTON 5d97797aa0aa74980f33169de44dea8285456d11:video-kyc/src/components/Liveliness.js|

7. **➡️ Update the KYCContainer component `src/components/KYCContainer.js` with** ___CLIPBOARD_BUTTON a6ce5f326220de2a9c2f24db73b7ef71e82536d0:video-kyc/src/components/KYCContainer.js|


Though we added Predictions to amplify, we dont use the entity identification functions to detect facial characteristics as it does not have full support for detection. We instead added Predictions to enable access to the Rekognition backend for Amplify credentials. We need to initialize the AWS SDK using credentials from the Auth.currentCredentials(). You should now have the Liveliness checks working !!


