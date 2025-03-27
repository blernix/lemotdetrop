'use client';

import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#1a1a1a', color: '#b3b3b3', textAlign: 'center', py: 3, mt: 10 }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} Le Mot De Trop — Tous droits réservés.
      </Typography>
    </Box>
  );
};

export default Footer;