// src/pages/Login.jsx
import React from 'react';
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports'; // Your Amplify config file
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// 1) Configure Amplify once at the top
Amplify.configure(awsExports);

const Login = () => {
  const navigate = useNavigate();

  // 2) "formFields" WITHOUT a "signIn" block
  const formFields = {
    signUp: {
      email: {
        label: 'Email',
        placeholder: 'Enter your email',
        isRequired: true,
        type: 'email',
        order: 1
      },
      password: {
        label: 'Password',
        placeholder: 'Enter your password',
        isRequired: true,
        type: 'password',
        order: 2
      },
      confirm_password: {
        label: 'Confirm Password',
        placeholder: 'Please confirm your password',
        order: 3
      }
    },
    confirmSignUp: {
      email: {
        label: 'Email',
        placeholder: 'Enter your email',
        isRequired: true,
        type: 'email'
      }
    },
    resetPassword: {
      email: {
        label: 'Email',
        placeholder: 'Enter your email',
        isRequired: true,
        type: 'email'
      }
    },
    confirmResetPassword: {
      email: {
        label: 'Email',
        placeholder: 'Enter your email',
        isRequired: true,
        type: 'email'
      }
    }
  };

  // 3) Optional custom header
  const components = {
    Header() {
      return (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <h1 style={{ color: '#1DB954' }}>Vinyl Tap</h1>
          <p style={{ color: 'white' }}>Sign in to your account</p>
        </Box>
      );
    }
  };

  return (
    <Box sx={{ width: '100%', bgcolor: '#121212' }}>
      <Container
        sx={{
          py: 8,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          // Amplify theming variables
          '--amplify-colors-brand-primary-80': '#1DB954',
          '--amplify-colors-brand-primary-90': '#1DB954',
          '--amplify-colors-brand-primary-100': '#1DB954',
          '--amplify-components-button-primary-background-color': '#1DB954',
          '--amplify-components-button-primary-hover-background-color': '#1ed760',
          '--amplify-components-tabs-item-active-color': '#1DB954',
          '--amplify-components-tabs-item-focus-color': '#1DB954',
          '--amplify-components-tabs-item-hover-color': '#1ed760',
        }}
      >
        <Authenticator
          formFields={formFields}
          components={components}
          hideSignUp={false}
          loginMechanisms={['email']}
        >
          {({ user }) => {
            if (user) {
              navigate('/artist-list');
              return null;
            }
            // If not logged in, let the Authenticator UI handle sign-in
            return null;
          }}
        </Authenticator>
      </Container>
    </Box>
  );
};

export default Login;