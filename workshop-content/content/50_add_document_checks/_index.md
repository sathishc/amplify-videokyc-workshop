+++
title = "Document Checks"
chapter = true
weight = 50
+++

# Add Document Checks wit AWS Comprehend

Next we will add document checks in our app to verifiy photo IDs. Here we use Amazon Rekogintion to detect text in the photo ids and then use Amazon Comprehend to discover entities in the resulting text like name, date of birth, gender, etc. We also use Rekognition to detect the face in the photo id. This will enable us to later compare the face with the snapshot we captured in the first step.

{{% children showhidden="false" %}}


