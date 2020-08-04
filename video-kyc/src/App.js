import React from 'react';
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
