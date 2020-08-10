+++
title = "Enabling the Back End"
chapter = false
weight = 10
+++

We have already enabled Predictions for face detection for Liveliness checks. For doing face comparison, we need to use the compareFaces API within Rekognition. There are no command line interfaces to enbale this API, but to use the same, all we need is a way to implement access to this API. For this we need to modify the existing cloudformation template already created for Rekognition and enable access to the compareFaces API

## To enable compareFaces, we need to do the following

1. Open the file 'amplify/backend/predictions/faceid-template.json"

2. Check the section 'PolicyDocument' and add "rekognition:CompareFaces" in the Actions section

3. **➡️ Now run** `amplify push'` to update the backend to enable CompareFaces usage

This should enable access to the relevant APIs 

