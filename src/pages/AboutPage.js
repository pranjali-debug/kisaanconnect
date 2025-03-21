import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Divider,
} from '@mui/material';
import {
  AgricultureOutlined,
  Diversity3Outlined,
  SavingsOutlined,
  RecyclingOutlined,
} from '@mui/icons-material';

const AboutPage = () => {
  const benefits = [
    {
      icon: <AgricultureOutlined sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Support Local Farmers',
      description: 'Help farmers find markets for their surplus produce and reduce waste while supporting local agriculture.',
    },
    {
      icon: <Diversity3Outlined sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Empower Communities',
      description: 'Enable NGOs and community organizations to access fresh produce at affordable prices for those in need.',
    },
    {
      icon: <SavingsOutlined sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Cost Effective',
      description: 'Reduce costs for both farmers and organizations by eliminating middlemen in the supply chain.',
    },
    {
      icon: <RecyclingOutlined sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Reduce Food Waste',
      description: 'Help prevent surplus farm products from going to waste by connecting supply directly with demand.',
    },
  ];

  const team = [
    {
      name: 'Jane Smith',
      role: 'Founder & CEO',
      bio: 'Former agricultural economist passionate about sustainable farming and food systems.',
      avatar: '/assets/team-1.jpg',
    },
    {
      name: 'John Doe',
      role: 'CTO',
      bio: 'Software engineer with 15 years of experience building platforms that connect communities.',
      avatar: '/assets/team-2.jpg',
    },
    {
      name: 'Sarah Williams',
      role: 'Operations Director',
      bio: 'Former NGO coordinator specializing in food distribution and community programs.',
      avatar: '/assets/team-3.jpg',
    },
  ];

  return (
    <Container>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          About FarmNGO
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Connecting surplus farm products with organizations that need them
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          FarmNGO is dedicated to creating a sustainable and efficient marketplace that connects farmers with surplus produce to non-governmental organizations (NGOs) and community groups that can distribute this food to those who need it most. We believe that by building this bridge, we can simultaneously address the issues of food waste, farmer income stability, and food access for vulnerable communities.
        </Typography>
        <Typography variant="body1" paragraph>
          Our platform leverages technology to make these connections simple, transparent, and beneficial for all parties involved. By providing real-time mapping, secure messaging, and a transparent marketplace, we remove barriers that traditionally prevented direct farmer-to-organization transactions.
        </Typography>
      </Paper>

      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        Benefits of Our Platform
      </Typography>
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {benefits.map((benefit, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Box sx={{ mb: 2 }}>{benefit.icon}</Box>
              <Typography variant="h6" gutterBottom>{benefit.title}</Typography>
              <Typography variant="body1" color="text.secondary">{benefit.description}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
          Our Story
        </Typography>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body1" paragraph>
                FarmNGO was founded in 2020 as a response to the increasing challenges faced by small-scale farmers in finding markets for their surplus produce, particularly during the COVID-19 pandemic. Our founder, Jane Smith, witnessed firsthand how tons of fresh produce were going to waste on farms while many community organizations struggled to source affordable food for their programs.
              </Typography>
              <Typography variant="body1" paragraph>
                What began as a small pilot program connecting 15 farmers with 5 local organizations has now grown into a nationwide platform serving hundreds of farmers and dozens of NGOs. Our technology-driven approach has enabled us to scale efficiently while maintaining the personal connections that make our marketplace effective.
              </Typography>
              <Typography variant="body1">
                Today, we continue to innovate and improve our platform based on feedback from our users. Our goal is to expand to all regions and help create a more sustainable and equitable food system for all.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/assets/about-story.jpg"
                alt="Farmer with NGO representative"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
        Meet Our Team
      </Typography>
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {team.map((member, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}>
                <Avatar
                  src={member.avatar}
                  alt={member.name}
                  sx={{ width: 120, height: 120 }}
                />
              </Box>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>{member.name}</Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>{member.role}</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary">{member.bio}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AboutPage;
