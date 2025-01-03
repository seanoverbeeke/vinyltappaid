import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const formFields = {
    signIn: {
      username: {
        label: 'Email',
        placeholder: 'Enter your email',
        isRequired: true,
        type: 'email'
      }
    },
    signUp: {
      username: {
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
      username: {
        label: 'Email',
        placeholder: 'Enter your email',
        isRequired: true,
        type: 'email'
      }
    },
    resetPassword: {
      username: {
        label: 'Email',
        placeholder: 'Enter your email',
        isRequired: true,
        type: 'email'
      }
    },
    confirmResetPassword: {
      username: {
        label: 'Email',
        placeholder: 'Enter your email',
        isRequired: true,
        type: 'email'
      }
    }
  };

  const components = {
    Header: () => (
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <h1 style={{ color: '#1DB954' }}>Vinyl Tap</h1>
        <p style={{ color: 'white' }}>Sign in to your account</p>
      </Box>
    )
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "#121212" }}>
      <Container 
        sx={{ 
          py: 8,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          '--amplify-colors-brand-primary-80': '#1DB954',
          '--amplify-colors-brand-primary-90': '#1DB954',
          '--amplify-colors-brand-primary-100': '#1DB954',
          '--amplify-components-button-primary-background-color': '#1DB954',
          '--amplify-components-button-primary-hover-background-color': '#1ed760',
          '--amplify-components-tabs-item-active-color': '#1DB954',
          '--amplify-components-tabs-item-focus-color': '#1DB954',
          '--amplify-components-tabs-item-hover-color': '#1ed760',
          '& [data-amplify-authenticator] [name="email"]': {
            display: 'none'
          }
        }}
      >
        <Authenticator
          formFields={formFields}
          components={components}
          hideSignUp={false}
          loginMechanisms={['username']}
        >
          {({ signOut, user }) => {
            if (user) {
              navigate('/artist-list');
              return null;
            }
            return null;
          }}
        </Authenticator>
      </Container>
    </Box>
  );
};

export default Login; 