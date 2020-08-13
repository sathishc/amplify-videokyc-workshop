---
title: "Amplify + AI Services KYC App Workshop"
chapter: true
weight: 1
---

## Build a self-service Video KYC App <br/> with AWS Amplify and Amazon AI Services

### Welcome!

In this workshop, we'll use React to build a data-driven web app that lets users perform self-service Video KYC (Know your customer). The app does a liveness check by asking the user to perform random actions and validates these actions using Amazon Rekognition. It then asks the user to upload certain identifty documents and uses Amazon Rekognition and Comprehend to parse the contents to the document to gather information such as name, date of birth, etc. The app also compared snapshots of the user face and compares the same with the photo identification provided.