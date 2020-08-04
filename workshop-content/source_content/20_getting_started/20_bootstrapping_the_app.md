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

**➡️ Replace `public/index.html` with** ___CLIPBOARD_BUTTON 127d23a6c9f41ae38a3c94b0e55ecf1e643f0bc0:video-kyc/public/index.html|

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

**➡️ Replace `src/App.js` with** ___CLIPBOARD_BUTTON 0a55beebf3bb19c3c63aef57e2b1b316329b1d82:video-kyc/src/App.js|

{{% notice note %}}
At this point, the browser should automatically refresh and show a much simpler page, with just some text that says 'Hello World'. It's not much to look at yet, but it's good to start with as little markup as possible.
{{% /notice %}}