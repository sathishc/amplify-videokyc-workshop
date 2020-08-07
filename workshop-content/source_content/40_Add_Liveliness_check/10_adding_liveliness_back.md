+++
title = "Setting up the Back End"
chapter = false
weight = 10
+++

Now that we have a simple React app with a UI Scaffold and authentication, we will now start adding the core features for self-service KYC. The first step is to add a liveliness check. This involves asking the user to perform random poses and checking if they match the request. This involves capturing a snapshot of the user and checking for the pose with Amazon Rekognition. For this purpose, we will add a REST API that sends image details to a Lambda function. The function in-turn invokes Rekognition API to check for a face and characteristics such as orientation, smile, eyes-closed, open mouth, etc.

First we will add a Lambda function that can integrate with Rekognition to provide these features.

### Adding Lambda function

1. **➡️ Run** `amplify add function` to add a lambda function to the app

+++
title = "Setting up the Back End"
chapter = false
weight = 10
+++

Now that we have a simple React app with a UI Scaffold and authentication, we will now start adding the core features for self-service KYC. The first step is to add a liveliness check. This involves asking the user to perform random poses and checking if they match the request. This involves capturing a snapshot of the user and checking for the pose with Amazon Rekognition. For this purpose, we will add a REST API that sends image details to a Lambda function. The function in-turn invokes Rekognition API to check for a face and characteristics such as orientation, smile, eyes-closed, open mouth, etc.

First we will add a Lambda function that can integrate with Rekognition to provide these features. The Lambda function is written in Python and uses libraries such as numpy and opencv. These libraries will also be reused by other lambda functions that we will create later. Hence we will add these as a Lambda Layer that can be reused. 

### Adding Lambda function layer 

1. **➡️ Run** `amplify add function` to add a lambda function to the app

2. For 'Select which capability you want to add:' choose Lambda layer

3. Provide a name for your Lambda layer: kyclayer

4. Select up to 2 compatible runtimes: Python

5. Optionally, configure who else can access this layer. (Hit <Enter> to skip) 

Above will create folders under 'amplify/backend/function/kyclayer'. Your layer libraries will go under 'amplify/backend/function/kyclayer/lib/python/lib/python3.8/site-packages'

### Adding Python libraries

You can add Python libraries into the layer using the following commands

1. **➡️ Run** `pip3 install numpy -t amplify/backend/function/kyclayer/lib/python/lib/python3.8/site-packages` to add numpy library

2. **➡️ Run** `pip3 install opencv-python -t amplify/backend/function/kyclayer/lib/python/lib/python3.8/site-packages` to add opencv library

### Adding the livedetector Lambda function

1. **➡️ Run** `amplify add function` to add a lambda function to the app

2. Choose 'Lambda function (serverless function)"

3. Name your function 'livedetector' and choose the Python runtime

4. Select 'n' for Do you want to access other resources in this project from your Lambda function?

5. Select 'N' for 'Do you want to invoke this function on a recurring schedule?'

6. Select 'y" for Do you want to configure Lambda layers for this function? and select 'kyclayer'

7. Choose the appropriate version for the layer. The 'livedetector' function will now be available under 'amplify/functions/livedetector' folder

8. **➡️ Replace `amplify/backend/function/livedetector/src/index.py` with** ___CLIPBOARD_BUTTON 921f41fbd30b5e456828634dc9e92df2f24e2d55:video-kyc/amplify/backend/function/livedetector/src/index.py|

9. Now update the function by typing `amplify push` in the command line

