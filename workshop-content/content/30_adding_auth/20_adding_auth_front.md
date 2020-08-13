+++
title = "Add Auth to Front End"
chapter = false
weight = 20
+++

Now that we have our backend set up for managing registrations and sign-in, all we need to do is use the _withAuthenticator_ [higher-order React component from AWS Amplify](https://aws-amplify.github.io/amplify-js/media/authentication_guide.html#using-components-in-react) to wrap our existing _App_ component. This will take care of rendering a simple UI for letting users sign up, confirm their account, sign in, sign out, or reset their password.

### Adding Amplify NPM dependencies

We haven't yet added the *aws-amplify* and *aws-amplify-react* modules to our app, so let's add them.

**➡️ Run** `npm install --save aws-amplify @aws-amplify/ui-react`

**➡️ Replace `src/App.js` with** <span class="clipBtn clipboard" data-clipboard-target="#id83f54c0769f7d11fbbb29e43cf451a8cd4257b04videokycsrcAppjs"><strong>this content</strong></span> (click the gray button to copy to clipboard). 
{{< expand "Click to view diff" >}} {{< safehtml >}}
<div id="diff-id83f54c0769f7d11fbbb29e43cf451a8cd4257b04videokycsrcAppjs"></div> <script type="text/template" data-diff-for="diff-id83f54c0769f7d11fbbb29e43cf451a8cd4257b04videokycsrcAppjs">commit 83f54c0769f7d11fbbb29e43cf451a8cd4257b04
Author: Sathish <sat.hariharan@gmail.com>
Date:   Tue Aug 4 21:40:22 2020 +0530

    add authentication

diff --git a/video-kyc/src/App.js b/video-kyc/src/App.js
index 2ca7f84..94ca89e 100644
--- a/video-kyc/src/App.js
+++ b/video-kyc/src/App.js
@@ -1,7 +1,12 @@
 import React from 'react';
-import logo from './logo.svg';
+import { withAuthenticator} from '@aws-amplify/ui-react';
+
 import './App.css';
 
+import Amplify from 'aws-amplify';
+import awsconfig from './aws-exports';
+Amplify.configure(awsconfig);
+
 function App() {
   return (
     <div className="App">
@@ -12,4 +17,4 @@ function App() {
   );
 }
 
-export default App;
+export default withAuthenticator(App);
</script>
{{< /safehtml >}} {{< /expand >}}
{{< safehtml >}}
<textarea id="id83f54c0769f7d11fbbb29e43cf451a8cd4257b04videokycsrcAppjs" style="position: relative; left: -1000px; width: 1px; height: 1px;">import React from 'react';
import { withAuthenticator} from '@aws-amplify/ui-react';

import './App.css';

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Hello World !
      </header>
    </div>
  );
}

export default withAuthenticator(App);

</textarea>
{{< /safehtml >}}

Take a look at the web app now and you should have a sign-up / sign-in form!

### What we changed in App.js

- Imported and configured the AWS Amplify JS library

- Imported the withAuthenticator higher order component from aws-amplify-react

- Wrapped the App component using withAuthenticator

### Creating an account

**➡️ Create an account in the app's web interface** by providing a username, password, and a **valid email address** (to receive a confirmation code at).

{{% notice info %}}
You'll be taken to a screen asking you to confirm a code. This is because Amazon Cognito wants to verify a user's email address before it lets them sign in. 
{{% /notice %}}

**➡️ Check your email**. You should have received a confirmation code message. **Copy and paste the confirmation code** into your app and you should then be able to log in with the username and password you entered during sign up. 


{{% notice tip %}}
This is a pretty simple authentication UI, but there's a lot you can do to customize it, including replacing parts with your own React components or using a completely hosted UI that can redirect back to your app. See the Customization section of the [AWS Amplify Authentication Guide](https://aws.github.io/aws-amplify/media/authentication_guide#customization) for more information.
{{% /notice %}}