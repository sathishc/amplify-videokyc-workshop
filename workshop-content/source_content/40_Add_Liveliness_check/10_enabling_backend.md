+++
title = "Enabling the Back End"
chapter = false
weight = 10
+++

The liveness checks uses AWS Rekognition detect faces functionality to check of facial gestures like smile, open mouth and closed eyes. We use the Rekognition sdk in Amplify by enabling the Predictions feature with appropriate inputs.

1. **➡️ Run** `amplify add predictions'` to enable usage of Rekoginition features

2. For "Please select from one of the categories below" - select Identify

3. For "What would you like to identify?" - select Identify Entities

4. For "Provide a friendly name for your resource". Provide a name "faceId". Use "Default Configuration"

5. For "Who should have access?" Select - Auth users only

6. **➡️ Now run** `amplify push'` to update the backend to enable Rekognition usage


