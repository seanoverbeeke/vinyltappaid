import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Amplify } from 'aws-amplify'

Amplify.configure({
  aws_project_region: 'us-east-1',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: 'us-east-1_ouCYyoFHR',
  aws_user_pools_web_client_id: '1mmfv20pak9v89gjehmcgu5r5s',
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_ouCYyoFHR',
    userPoolWebClientId: '1mmfv20pak9v89gjehmcgu5r5s'
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
