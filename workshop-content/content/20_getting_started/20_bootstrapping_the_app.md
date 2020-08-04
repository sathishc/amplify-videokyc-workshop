+++
title = "Bootstrapping the App"
chapter = false
weight = 20
+++

### Creating a React app
We'll get things started by building a new React web app using the **create-react-app** CLI tool. 

{{% notice info %}}
This will give us a sample React app with a local auto-reloading web server and some helpful transpiling support for the browser like letting us use async/await keywords, arrow functions, and more.
{{% /notice %}}

{{% notice tip %}}
You can learn more about create-react-app at [https://github.com/facebook/create-react-app](https://github.com/facebook/create-react-app).
{{% /notice %}}

**➡️ In the Cloud9 terminal, run** `npx create-react-app video-kyc`.

**➡️ Then, navigate to the newly created directory with** `cd video-kyc`.


### Adding React Bootstrap

Before we start writing our UI, we'll also include React Bootstrap UI components for React to give us components that will help make our interface look a bit nicer.

**➡️ In the video-kyc directory, run** `npm install --save react-bootstrap bootstrap`

**➡️ Replace `public/index.html` with** <span class="clipBtn clipboard" data-clipboard-target="#id127d23a6c9f41ae38a3c94b0e55ecf1e643f0bc0videokycpublicindexhtml"><strong>this content</strong></span> (click the gray button to copy to clipboard). 
{{< expand "Click to view diff" >}} {{< safehtml >}}
<div id="diff-id127d23a6c9f41ae38a3c94b0e55ecf1e643f0bc0videokycpublicindexhtml"></div> <script type="text/template" data-diff-for="diff-id127d23a6c9f41ae38a3c94b0e55ecf1e643f0bc0videokycpublicindexhtml">commit 127d23a6c9f41ae38a3c94b0e55ecf1e643f0bc0
Author: Sathish <sat.hariharan@gmail.com>
Date:   Tue Aug 4 14:14:39 2020 +0530

    update the video-kyc public files

diff --git a/video-kyc/public/index.html b/video-kyc/public/index.html
new file mode 100644
index 0000000..7b2088a
--- /dev/null
+++ b/video-kyc/public/index.html
@@ -0,0 +1,49 @@
+<!DOCTYPE html>
+<html lang="en">
+  <head>
+    <meta charset="utf-8" />
+    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
+    <meta name="viewport" content="width=device-width, initial-scale=1" />
+    <meta name="theme-color" content="#000000" />
+    <meta
+      name="description"
+      content="Web site created using create-react-app"
+    />
+    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
+    <!--
+      manifest.json provides metadata used when your web app is installed on a
+      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
+    -->
+    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
+    <link
+      rel="stylesheet"
+      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
+      integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
+      crossorigin="anonymous"
+    />
+    <!--
+      Notice the use of %PUBLIC_URL% in the tags above.
+      It will be replaced with the URL of the `public` folder during the build.
+      Only files inside the `public` folder can be referenced from the HTML.
+
+      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
+      work correctly both with client-side routing and a non-root public URL.
+      Learn how to configure a non-root public URL by running `npm run build`.
+    -->
+    <title>Video KYC Demo</title>
+  </head>
+  <body>
+    <noscript>You need to enable JavaScript to run this app.</noscript>
+    <div id="root"></div>
+    <!--
+      This HTML file is a template.
+      If you open it directly in the browser, you will see an empty page.
+
+      You can add webfonts, meta tags, or analytics to this file.
+      The build step will place the bundled scripts into the <body> tag.
+
+      To begin the development, run `npm start` or `yarn start`.
+      To create a production bundle, use `npm run build` or `yarn build`.
+    -->
+  </body>
+</html>
</script>
{{< /safehtml >}} {{< /expand >}}
{{< safehtml >}}
<textarea id="id127d23a6c9f41ae38a3c94b0e55ecf1e643f0bc0videokycpublicindexhtml" style="position: relative; left: -1000px; width: 1px; height: 1px;"><!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Web site created using create-react-app"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
      integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
      crossorigin="anonymous"
    />
    <!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    -->
    <title>Video KYC Demo</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
  </body>
</html>

</textarea>
{{< /safehtml >}}

### Starting the App
Now let's start our development server so we can make changes and see them refreshed live in the browser.

**➡️ In the video-kyc directory, run** `npm start`. 

Once the web server has started, click the **Preview** menu and **select Preview Running Application**

![preview running application](/images/preview_running_application.png)

If you'd like, you can also **pop the preview to a new window**:

![pop app to new window](/images/pop_browser_new_window.png)

Finally, **open another terminal window**. We'll leave this first terminal alone since it's running the web server process.

![new terminal](/images/c9_new_terminal.png)

### Simplifying markup

Next, we'll want to start with a clean slate.

**➡️ Replace `src/App.js` with** <span class="clipBtn clipboard" data-clipboard-target="#id0a55beebf3bb19c3c63aef57e2b1b316329b1d82videokycsrcAppjs"><strong>this content</strong></span> (click the gray button to copy to clipboard). 
{{< expand "Click to view diff" >}} {{< safehtml >}}
<div id="diff-id0a55beebf3bb19c3c63aef57e2b1b316329b1d82videokycsrcAppjs"></div> <script type="text/template" data-diff-for="diff-id0a55beebf3bb19c3c63aef57e2b1b316329b1d82videokycsrcAppjs">commit 0a55beebf3bb19c3c63aef57e2b1b316329b1d82
Author: Sathish <sat.hariharan@gmail.com>
Date:   Tue Aug 4 21:04:06 2020 +0530

    clean App.js

diff --git a/video-kyc/src/App.js b/video-kyc/src/App.js
index ce9cbd2..2ca7f84 100644
--- a/video-kyc/src/App.js
+++ b/video-kyc/src/App.js
@@ -6,18 +6,7 @@ function App() {
   return (
     <div className="App">
       <header className="App-header">
-        <img src={logo} className="App-logo" alt="logo" />
-        <p>
-          Edit <code>src/App.js</code> and save to reload.
-        </p>
-        <a
-          className="App-link"
-          href="https://reactjs.org"
-          target="_blank"
-          rel="noopener noreferrer"
-        >
-          Learn React
-        </a>
+        Hello World !
       </header>
     </div>
   );
</script>
{{< /safehtml >}} {{< /expand >}}
{{< safehtml >}}
<textarea id="id0a55beebf3bb19c3c63aef57e2b1b316329b1d82videokycsrcAppjs" style="position: relative; left: -1000px; width: 1px; height: 1px;">import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Hello World !
      </header>
    </div>
  );
}

export default App;

</textarea>
{{< /safehtml >}}

{{% notice note %}}
At this point, the browser should automatically refresh and show a much simpler page, with just some text that says 'Hello World'. It's not much to look at yet, but it's good to start with as little markup as possible.
{{% /notice %}}