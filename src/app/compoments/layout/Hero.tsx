'use client';

import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';

interface HeroProps {
  title: string;
  subtitle: string;
  primaryButton?: {
    label: string;
    href: string;
  };
  secondaryButton?: {
    label: string;
    href: string;
  };
}

const Hero = ({ title, subtitle, primaryButton, secondaryButton }: HeroProps) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 10,
      background: 'linear-gradient(135deg, #333333 0%, #1a1a1a 100%)',
      borderRadius: 4,
      color: '#ffffff',
      mb: 10,
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',
    }}
  >
    <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
      {title}
    </Typography>
    <Typography variant="h5" sx={{ mb: 4, color: '#b3b3b3' }}>
      {subtitle}
    </Typography>
    {primaryButton && (
      <Button
        variant="contained"
        size="large"
        sx={{ mr: 2, px: 4, py: 1, fontSize: '1rem', backgroundColor: '#0077b6' }}
        component={Link}
        href={primaryButton.href}
      >
        {primaryButton.label}
      </Button>
    )}
    {secondaryButton && (
      <Button
        variant="outlined"
        size="large"
        sx={{
          px: 4,
          py: 1,
          fontSize: '1rem',
          color: '#0077b6',
          borderColor: '#0077b6',
          '&:hover': { backgroundColor: 'rgba(0, 119, 182, 0.1)', borderColor: '#005f87' },
        }}
        component={Link}
        href={secondaryButton.href}
      >
        {secondaryButton.label}
      </Button>
    )}
  </Box>
);

export default Hero;