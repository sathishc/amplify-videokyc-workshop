+++
title = "Setting up the Back End"
chapter = false
weight = 10
+++

Now that we have a simple React app with a UI Scaffold and authentication, we will now start adding the core features for self-service KYC. The first step is to add a liveliness check. This involves asking the user to perform random poses and checking if they match the request. This involves capturing a snapshot of the user and checking for the pose with Amazon Rekognition. For this purpose, we will add a REST API that sends image details to a Lambda function. The function in-turn invokes Rekognition API to check for a face and characteristics such as orientation, smile, eyes-closed, open mouth, etc.

First we will add a Lambda function that can integrate with Rekognition to provide these features.

### Adding Lambda function

1. **➡️ Run** `amplify add function` to add a lambda function to the app

