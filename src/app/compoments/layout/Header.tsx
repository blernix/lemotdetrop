'use client';

import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a1a1a' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          <Link href="/" style={{ textDecoration: 'none', color: '#ffffff' }}>
            Le Mot De Trop
          </Link>
        </Typography>
        <Box>
          <Button color="inherit" component={Link} href="/blog">Blog</Button>
          <Button color="inherit" component={Link} href="/manga">Manga</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;