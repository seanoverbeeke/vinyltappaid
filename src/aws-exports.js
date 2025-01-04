import { Amplify } from 'aws-amplify';

const awsconfig = {
  aws_project_region: 'us-east-1',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: 'us-east-1_BFDpg2rtb',
  aws_user_pools_web_client_id: '59elbeql946789rtmlq660ac2c',
  
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_BFDpg2rtb',
    userPoolWebClientId: '59elbeql946789rtmlq660ac2c',
    mandatorySignIn: false,
    cookieStorage: {
      domain: window.location.hostname,
      path: '/',
      expires: 365,
      sameSite: "strict",
      secure: true
    },
    authenticationFlowType: 'USER_SRP_AUTH',
    oauth: {
      domain: 'us-east-1bfdpg2rtb.auth.us-east-1.amazoncognito.com',
      scope: ['phone', 'email', 'openid', 'profile'],
      // Add both dev and production URLs, separated by a comma:
      redirectSignIn: 'http://localhost:5173,https://app.vinyltapit.com',
      redirectSignOut: 'http://localhost:5173,https://app.vinyltapit.com',
      responseType: 'code'
    }
  }
};

Amplify.configure(awsconfig);

export default awsconfig; 