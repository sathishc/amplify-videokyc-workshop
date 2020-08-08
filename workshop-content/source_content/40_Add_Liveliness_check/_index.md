+++
title = "Add Liveliness Checking"
chapter = true
weight = 40
+++

# Adding Liveliness Checks with Amazon Rekognition

Now that we have a simple React app with a UI Scaffold and authentication, we will now start adding the core features for self-service KYC. The first step is to add a liveliness check. This involves asking the user to perform random poses and checking if they match the request. This involves capturing a snapshot of the user and checking for the pose with Amazon Rekognition. For this purpose, we will invoke Rekognition API to check for a face and characteristics such as orientation, smile, eyes-closed, open mouth, etc.

{{% children showhidden="false" %}}


