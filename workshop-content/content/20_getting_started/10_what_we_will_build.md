+++
title = "What We'll Build"
chapter = false
weight = 10
+++

### Our Goal
In this workshop, we'll build an app with quite a few features, including:

* Allowing user sign up and authentication, so we know who is performing the self-service KYC and any data provided remains safe

* Add a Liveliness check to make sure the user performing the KYC steps is a real person and not a photgraph, etc. This done by invoking Rekognition APIs. Extract face information during Liveness check to compare with photo identification

* Add a photo identification upload feature to gather a photo id document. Extract text and photo information from ths document to compare with information gathered during the livliness check. Use Amazon Rekognition to extract text and then use Amazon Comprehend to extract entity information such as date of birth, gender, etc

* Compare faces extracted during the Liveliness check and the photo id using Amazon Rekognition


### The Architecture

Here's a map of the services we'll use and how they'll all connect.

![Video KYC Architecture](/images/architecture.png)

### Our Tools

If we were to try and build scalable and highly-available systems to handle each of the above concerns on our own, we'd probably never get around to building our app! Fortunately, AWS provides services and tooling to handle a lot of the undifferentiated heavy lifting involved in building modern, robust applications. We'll use a number of these services and tools in our solution, including:

* The [AWS Amplify CLI](https://github.com/aws-amplify/amplify-cli), to rapidly provision and configure our cloud services

* The [AWS Amplify JavaScript library](https://aws-amplify.github.io/), to connect our front end to cloud resources

* [Amazon Cognito](https://aws.amazon.com/cognito/), to handle user sign up authorization

* [Amazon Rekognition](https://aws.amazon.com/rekognition/), to detect relevant information from liveness checks and documents uploaded

* [Amazon Comprehend](https://aws.amazon.com/comprehend/), to detect relevant information from documents uploaded


If any or all of these services are new to you, don't worry. We'll cover everything you need to know to get started using everything mentioned above. And there's no better way to learn than to build, so let's get started!