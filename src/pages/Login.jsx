import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Box, Container } from '@mui/material';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const formFields = {
    signIn: {
      username: {
        label: 'Email',
        placeholder: 'Enter your email'
      }
    },
    signUp: {
      username: {
        label: 'Email',
        placeholder: 'Enter your email'
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
      <Header showAddButton={false} />
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
          '--amplify-components-tabs-item-hover-color': '#1ed760',
          '--amplify-components-text-color': '#000000',
          '--amplify-components-link-color': '#000000',
          '& .amplify-button[data-variation="link"]': {
            color: '#000000 !important'
          },
          '& .amplify-authenticator__link': {
            color: '#000000 !important'
          },
          '& .amplify-button--link': {
            color: '#000000 !important'
          },
          '& [data-amplify-router-content] a': {
            color: '#000000 !important'
          }
        }}
      >
        <Authenticator
          formFields={formFields}
          components={components}
        >
          {({ signOut, user }) => {
            if (user) {
              navigate('/artist-list');
            }
            return null;
          }}
        </Authenticator>
      </Container>
    </Box>
  );
};

export default Login; 