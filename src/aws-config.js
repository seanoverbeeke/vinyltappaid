import { Amplify } from 'aws-amplify';

const awsconfig = {
  aws_project_region: 'us-east-1',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: 'us-east-1_ouCYyoFHR',
  aws_user_pools_web_client_id: '1r8i178q6v2hplbtf1jsgr83ii',
  
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',

    // REQUIRED - Amazon Cognito Region
    region: 'us-east-1',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'us-east-1_ouCYyoFHR',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '1r8i178q6v2hplbtf1jsgr83ii',

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,

    // OPTIONAL - Configuration for cookie storage
    cookieStorage: {
      // REQUIRED - Cookie domain (only required if cookieStorage is provided)
      domain: window.location.hostname,
      // OPTIONAL - Cookie path
      path: '/',
      // OPTIONAL - Cookie expiration in days
      expires: 365,
      // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
      sameSite: "strict",
      // OPTIONAL - Cookie secure flag
      secure: true
    },

    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_SRP_AUTH',

    // OPTIONAL - Hosted UI configuration
    oauth: {
      domain: 'us-east-1oucyyofhr.auth.us-east-1.amazoncognito.com',
      scope: ['phone', 'email', 'openid', 'profile'],
      redirectSignIn: 'https://d84l1y8p4kdic.cloudfront.net',
      redirectSignOut: 'https://d84l1y8p4kdic.cloudfront.net',
      responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
    }
  }
};

try {
  Amplify.configure(awsconfig);
  console.log('Successfully configured Amplify');
} catch (error) {
  console.error('Error configuring Amplify:', error);
}

export default awsconfig; 