import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  styled
} from "@mui/material";
import {
  Person as PersonIcon,
  Group as GroupIcon,
  Headphones as HeadphonesIcon,
  Business as BusinessIcon,
  MusicNote as MusicNoteIcon,
  QrCode as QrCodeIcon,
  LibraryMusic as LibraryMusicIcon,
  MicNone as MicIcon,
  AccountBox as ProfileIcon
} from '@mui/icons-material';
import React, { useRef } from "react";
import { useNavigate } from 'react-router-dom';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: "none",
}));

const CustomIcon = ({ src, alt, size = 40 }) => (
  <Box
    component="img"
    src={src}
    alt={alt}
    sx={{
      width: size,
      height: size,
      display: 'inline-block'
    }}
  />
);

const Landing = () => {
  const navigate = useNavigate();
  const featuresRef = useRef(null);

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleLearnMore = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: <MicIcon sx={{ fontSize: 40, color: '#1DB954' }} />,
      title: "Beautiful Customizable Profiles",
      description: "Create stunning artist profiles with custom images, bios, and more."
    },
    {
      icon: <HeadphonesIcon sx={{ fontSize: 40, color: '#1DB954' }} />,
      title: "All Your Content in One Place",
      description: "Manage your music, videos, and social media links in a single dashboard."
    },
    {
      icon: <ProfileIcon sx={{ fontSize: 40, color: '#1DB954' }} />,
      title: "Easy to Use Interface",
      description: "Simple and intuitive design makes managing your content a breeze."
    }
  ];

  return (
    <Box sx={{ width: "100%", bgcolor: "#121212" }}>
      {/* Hero Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" color="white" sx={{ fontWeight: "bold" }}>
              Your Ultimate Digital EPK Solution
            </Typography>
            <Typography variant="h6" color="gray" sx={{ mt: 2 }}>
              Share Your Music. Amplify Your Brand. Engage Your Fans.
            </Typography>
            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
              <StyledButton variant="contained" color="success" sx={{ width: 200 }} onClick={handleGetStarted}>
                Get Started Now
              </StyledButton>
              <StyledButton variant="outlined" color="inherit" sx={{ width: 200 }} onClick={handleLearnMore}>
                Learn More
              </StyledButton>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="100%"
                image="/img.png"
                alt="EPK Image"
              />
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box ref={featuresRef} sx={{ bgcolor: "#181818", py: 8 }}>
        <Container>
          <Typography variant="h4" color="white" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
            Why Choose Vinyl Tap?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ bgcolor: "#282828", borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      {feature.icon}
                      <Typography variant="h6" color="white" sx={{ fontWeight: "bold", ml: 1 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="gray">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography variant="h4" color="white" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
            How It Works
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                step: "1",
                title: "Create Your EPK",
                description: "Upload your media, write your bio, and customize your artist profile."
              },
              {
                step: "2",
                title: "Share with Ease",
                description: "Use your unique QR code to share your EPK anywhere."
              },
              {
                step: "3",
                title: "Grow Your Reach",
                description: "Impress event organizers and boost your visibility."
              }
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box sx={{ textAlign: "center" }}>
                  <Box sx={{
                    bgcolor: "#1db954",
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    mx: "auto",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    <Typography variant="h4" color="black">
                      {item.step}
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="white" sx={{ fontWeight: "bold" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="gray" sx={{ mt: 1 }}>
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Who's It For Section */}
      <Box sx={{ bgcolor: "#181818", py: 8 }}>
        <Container>
          <Typography variant="h4" color="white" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
            Who's It For?
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              { icon: <PersonIcon sx={{ fontSize: 40, color: '#1DB954' }} />, text: "Independent Artists" },
              { icon: <GroupIcon sx={{ fontSize: 40, color: '#1DB954' }} />, text: "Bands" },
              { icon: <HeadphonesIcon sx={{ fontSize: 40, color: '#1DB954' }} />, text: "DJs" },
              { icon: <BusinessIcon sx={{ fontSize: 40, color: '#1DB954' }} />, text: "Managers & Promoters" }
            ].map((item, index) => (
              <Grid item xs={12} md={3} sx={{ textAlign: "center" }} key={index}>
                {item.icon}
                <Typography variant="body1" color="white" sx={{ mt: 1 }}>
                  {item.text}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box sx={{ py: 8 }}>
        <Container>
          <Typography variant="h4" color="white" align="center" sx={{ fontWeight: "bold", mb: 4 }}>
            Get Started for Free
          </Typography>
          <Typography variant="h6" color="gray" align="center" sx={{ mb: 4 }}>
            Creating your Vinyl Tap EPK is fast, easy, and free.
          </Typography>
          <Box sx={{ textAlign: "center" }}>
            <StyledButton variant="contained" color="success" sx={{ width: 300 }} onClick={handleGetStarted}>
              Start Creating Your EPK
            </StyledButton>
            <Typography variant="body2" color="#1db954" sx={{ mt: 2 }}>
              🎵 Your Music. Your Story. Amplified.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing; 