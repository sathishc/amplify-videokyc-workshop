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

8. **➡️ Replace `amplify/backend/function/livedetector/src/index.py` with** <span class="clipBtn clipboard" data-clipboard-target="#id921f41fbd30b5e456828634dc9e92df2f24e2d55videokycamplifybackendfunctionlivedetectorsrcindexpy"><strong>this content</strong></span> (click the gray button to copy to clipboard). 
{{< expand "Click to view diff" >}} {{< safehtml >}}
<div id="diff-id921f41fbd30b5e456828634dc9e92df2f24e2d55videokycamplifybackendfunctionlivedetectorsrcindexpy"></div> <script type="text/template" data-diff-for="diff-id921f41fbd30b5e456828634dc9e92df2f24e2d55videokycamplifybackendfunctionlivedetectorsrcindexpy">commit 921f41fbd30b5e456828634dc9e92df2f24e2d55
Author: Sathish <sat.hariharan@gmail.com>
Date:   Fri Aug 7 11:49:25 2020 +0530

    update livedetector function

diff --git a/video-kyc/amplify/backend/function/livedetector/src/index.py b/video-kyc/amplify/backend/function/livedetector/src/index.py
index 7b45b0b..c79a833 100644
--- a/video-kyc/amplify/backend/function/livedetector/src/index.py
+++ b/video-kyc/amplify/backend/function/livedetector/src/index.py
@@ -1,6 +1,138 @@
+import json
+import boto3
+import base64
+import cv2
+import numpy as np
+
+client = boto3.client("rekognition")
+
+def analyse_image(imagebytes):
+    print("inside analyse")
+    print(imagebytes)
+    response = client.detect_faces(
+        Image={
+            'Bytes': imagebytes
+        },
+        Attributes=[
+        'ALL',
+    ]
+    )
+    print(response)
+    return response
+
+def process_response(response):
+    face_details = response['FaceDetails']
+    return face_details
+
+
+def get_face_image(image_array,oheight,owidth,faceDetail):
+    width = faceDetail[0]['BoundingBox']['Width']
+    height = faceDetail[0]['BoundingBox']['Height']
+    left = faceDetail[0]['BoundingBox']['Left']
+    top = faceDetail[0]['BoundingBox']['Top']
+    print(image_array.shape)
+    print(width,height,left,top)
+    print(oheight,owidth)
+    w = int(width * owidth)
+    h = int(height * oheight)
+    x = int(left * owidth)
+    y = int(top * oheight)
+    print(w,h,x,y)
+    #img2 = image_array[y:h, x:w]
+    img2 = image_array[y:y+h, x:x+w]
+         
+    return img2
+  
+def construct_response(output,encoded_face_image):
+  resp_data = output[0]
+  face_details = {
+    "gender": resp_data["Gender"],
+    "smile": resp_data["Smile"],
+    "eyesOpen":resp_data["EyesOpen"],
+    "agerange": {
+      "low": resp_data["AgeRange"]["Low"],
+      "high": resp_data["AgeRange"]["High"],
+    },
+    "pose":{
+      "roll": resp_data["Pose"]["Roll"],
+      "yaw": resp_data["Pose"]["Yaw"],
+      "pitch": resp_data["Pose"]["Pitch"],
+    },
+    "mouthOpen": resp_data["MouthOpen"],
+    "encoded_face_image":encoded_face_image
+  }
+  return face_details
+  
+    
+
 def handler(event, context):
-  print('received event:')
+  print('received event from amplify:')
   print(event)
+  
+  if "body" in event:
+        try:
+            body = json.loads(event["body"])
+            print(body)
+            if "image_bytes" in body:
+                imagedata = bytes(body["image_bytes"][22:],"utf-8")
+                print(imagedata)
+                image_heigth = int(body["height"])
+                image_width = int(body["width"])
+                
+                
+                imagedata = base64.b64decode(imagedata)
+                decoded_array = cv2.imdecode(np.frombuffer(imagedata, np.uint8), -1)
+                
+                
+                #s3 = boto3.resource('s3')
+                #s3.Bucket('sagemaker-us-east-1-365792799466').put_object(Key='test.jpg', Body=imagedata,ContentType='image/jpeg')
+                print(imagedata)
+                response = analyse_image(imagedata)
+                output = process_response(response)
+                
+                cv2.imwrite("/tmp/test.jpg", decoded_array)
+                
+                s3 = boto3.resource('s3')
+                #s3.Bucket('sagemaker-us-east-1-365792799466').put_object(Key='test2.jpg', Body=open('/tmp/test.jpg', 'rb'),ContentType='image/jpeg')
+                s3.Bucket('sagemaker-us-east-1-365792799466').upload_file('/tmp/test.jpg','rekog/test2.jpg')
+
+                face_image_np = get_face_image(decoded_array,image_heigth,image_width,output)
+                
+                #print(face_image_np)
+                cv2.imwrite("/tmp/face.jpg", face_image_np)
+                s3.Bucket('sagemaker-us-east-1-365792799466').upload_file('/tmp/face.jpg','rekog/face.jpg')
+                
+                retval, buffer = cv2.imencode('.jpg', face_image_np)
+                jpg_as_text = base64.b64encode(buffer)
+                jpg_as_text = jpg_as_text.decode("utf-8")
+                print(jpg_as_text)
+                face_object = construct_response(output,jpg_as_text)
+
+            
+                return {
+                    'statusCode': 200,
+                    "headers": {
+                      "Access-Control-Allow-Credentials" : True,
+                        "Access-Control-Allow-Origin": "*",
+                    },
+                    'body': json.dumps(face_object)
+                }
+        except Exception as ex:
+            print(ex)
+            return{
+                'statusCode':500,
+                'body':json.dumps(str(ex)),
+                "headers": {
+                "Access-Control-Allow-Credentials" : True,
+                "Access-Control-Allow-Origin": "*",
+                }
+            }
+    
   return {
-    'message': 'Hello from your new Amplify Python lambda!'
-  }
+        'statusCode':500,
+        'body':json.dumps("invalid request"),
+        "headers": {
+                "Access-Control-Allow-Credentials" : True,
+                "Access-Control-Allow-Origin": "*",
+            }
+    }
\ No newline at end of file
</script>
{{< /safehtml >}} {{< /expand >}}
{{< safehtml >}}
<textarea id="id921f41fbd30b5e456828634dc9e92df2f24e2d55videokycamplifybackendfunctionlivedetectorsrcindexpy" style="position: relative; left: -1000px; width: 1px; height: 1px;">import json
import boto3
import base64
import cv2
import numpy as np

client = boto3.client("rekognition")

def analyse_image(imagebytes):
    print("inside analyse")
    print(imagebytes)
    response = client.detect_faces(
        Image={
            'Bytes': imagebytes
        },
        Attributes=[
        'ALL',
    ]
    )
    print(response)
    return response

def process_response(response):
    face_details = response['FaceDetails']
    return face_details


def get_face_image(image_array,oheight,owidth,faceDetail):
    width = faceDetail[0]['BoundingBox']['Width']
    height = faceDetail[0]['BoundingBox']['Height']
    left = faceDetail[0]['BoundingBox']['Left']
    top = faceDetail[0]['BoundingBox']['Top']
    print(image_array.shape)
    print(width,height,left,top)
    print(oheight,owidth)
    w = int(width * owidth)
    h = int(height * oheight)
    x = int(left * owidth)
    y = int(top * oheight)
    print(w,h,x,y)
    #img2 = image_array[y:h, x:w]
    img2 = image_array[y:y+h, x:x+w]
         
    return img2
  
def construct_response(output,encoded_face_image):
  resp_data = output[0]
  face_details = {
    "gender": resp_data["Gender"],
    "smile": resp_data["Smile"],
    "eyesOpen":resp_data["EyesOpen"],
    "agerange": {
      "low": resp_data["AgeRange"]["Low"],
      "high": resp_data["AgeRange"]["High"],
    },
    "pose":{
      "roll": resp_data["Pose"]["Roll"],
      "yaw": resp_data["Pose"]["Yaw"],
      "pitch": resp_data["Pose"]["Pitch"],
    },
    "mouthOpen": resp_data["MouthOpen"],
    "encoded_face_image":encoded_face_image
  }
  return face_details
  
    

def handler(event, context):
  print('received event from amplify:')
  print(event)
  
  if "body" in event:
        try:
            body = json.loads(event["body"])
            print(body)
            if "image_bytes" in body:
                imagedata = bytes(body["image_bytes"][22:],"utf-8")
                print(imagedata)
                image_heigth = int(body["height"])
                image_width = int(body["width"])
                
                
                imagedata = base64.b64decode(imagedata)
                decoded_array = cv2.imdecode(np.frombuffer(imagedata, np.uint8), -1)
                
                
                #s3 = boto3.resource('s3')
                #s3.Bucket('sagemaker-us-east-1-365792799466').put_object(Key='test.jpg', Body=imagedata,ContentType='image/jpeg')
                print(imagedata)
                response = analyse_image(imagedata)
                output = process_response(response)
                
                cv2.imwrite("/tmp/test.jpg", decoded_array)
                
                s3 = boto3.resource('s3')
                #s3.Bucket('sagemaker-us-east-1-365792799466').put_object(Key='test2.jpg', Body=open('/tmp/test.jpg', 'rb'),ContentType='image/jpeg')
                s3.Bucket('sagemaker-us-east-1-365792799466').upload_file('/tmp/test.jpg','rekog/test2.jpg')

                face_image_np = get_face_image(decoded_array,image_heigth,image_width,output)
                
                #print(face_image_np)
                cv2.imwrite("/tmp/face.jpg", face_image_np)
                s3.Bucket('sagemaker-us-east-1-365792799466').upload_file('/tmp/face.jpg','rekog/face.jpg')
                
                retval, buffer = cv2.imencode('.jpg', face_image_np)
                jpg_as_text = base64.b64encode(buffer)
                jpg_as_text = jpg_as_text.decode("utf-8")
                print(jpg_as_text)
                face_object = construct_response(output,jpg_as_text)

            
                return {
                    'statusCode': 200,
                    "headers": {
                      "Access-Control-Allow-Credentials" : True,
                        "Access-Control-Allow-Origin": "*",
                    },
                    'body': json.dumps(face_object)
                }
        except Exception as ex:
            print(ex)
            return{
                'statusCode':500,
                'body':json.dumps(str(ex)),
                "headers": {
                "Access-Control-Allow-Credentials" : True,
                "Access-Control-Allow-Origin": "*",
                }
            }
    
  return {
        'statusCode':500,
        'body':json.dumps("invalid request"),
        "headers": {
                "Access-Control-Allow-Credentials" : True,
                "Access-Control-Allow-Origin": "*",
            }
    }
</textarea>
{{< /safehtml >}}

9. Now update the function by typing `amplify push` in the command line

