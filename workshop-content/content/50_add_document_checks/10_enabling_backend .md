+++
title = "Enabling the Back End"
chapter = false
weight = 10
+++

We have already enabled Predictions for face detection for Liveliness checks. We can continue to use that for detecting photo in the id. But we now need to detect text as well and entities in text. For this we need to enable new features in Predictions.

## To enable text detection, we need to do the following

1. **➡️ Run** `amplify add predictions'` to enable usage of Rekoginition features

2. For "Please select from one of the categories below" - select Identify

3. For "What would you like to identify?" - select 'Identify Text'

4. For "Provide a friendly name for your resource". Provide a name "textID". Use "Default Configuration"

5. For "Who should have access?" Select - Auth users only

6. **➡️ Now run** `amplify push'` to update the backend to enable Rekognition usage


## To enable entity detection in text, we need to do the following to enable comprehend access

1. **➡️ Run** `amplify add predictions'` to enable usage of Comprehend features

2. For "Please select from one of the categories below" - select 'Interpret'

3. For "What would you like to interpret?" - select 'Interpret Text'

4. For "Provide a friendly name for your resource". Provide a name "textInterpret". Use "Default Configuration"

5. For "What kind of interpretation would you like?". Select 'Entity'

6. For "Who should have access?" Select - Auth users only

7. **➡️ Now run** `amplify push'` to update the backend to enable Comprehend usage


