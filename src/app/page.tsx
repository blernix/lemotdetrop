'use client';

import { useEffect, useState } from 'react';
import { Container, Grid, Typography, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import Hero from './compoments/layout/Hero';
import applyFloatingBubbles from './lib/FloatingBubbles';
import ContentCard from './compoments/cards/ContentCard';

type BlogPost = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  vip: boolean;
};

type Manga = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  vip: boolean;
};

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applyFloatingBubbles();
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [blogRes, mangaRes] = await Promise.all([
          fetch('/api/blog'),
          fetch('/api/manga')
        ]);

        const blogData = await blogRes.json();
        const mangaData = await mangaRes.json();

        setPosts(blogData);
        setMangas(mangaData);
      } catch (error) {
        console.error("Erreur récupération des contenus :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const vipPosts = posts.filter(post => post.vip);
  const vipMangas = mangas.filter(manga => manga.vip);

  const sectionTitle = (text: string) => (
    <Typography variant="h4" component="h2" gutterBottom sx={{
      textAlign: 'center',
      fontWeight: 'bold',
      position: 'relative',
      mb: 4,
      color: '#d9d9d9',
      '&::after': {
        content: '""',
        display: 'block',
        width: '60px',
        height: '4px',
        backgroundColor: '#0077b6',
        margin: '8px auto 0',
        borderRadius: '2px',
      },
    }}>
      {text}
    </Typography>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Hero
        title="Bienvenue sur Le Mot de Trop"
        subtitle="Laissez-vous emporter par des écrits captivants."
        primaryButton={{ label: 'Explorer les mangas', href: '/manga' }}
        secondaryButton={{ label: 'Explorer le blog', href: '/blog' }}
      />

      {/* Articles VIP */}
      {sectionTitle('Articles Mis en Avant')}
      <Grid container spacing={4} mb={8}>
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3, bgcolor: '#333333' }} />
              <Skeleton variant="text" sx={{ bgcolor: '#4a4a4a', my: 1 }} />
              <Skeleton variant="text" width="60%" sx={{ bgcolor: '#4a4a4a' }} />
            </Grid>
          ))
          : vipPosts.map((post) => (
            <Grid item key={post.id} xs={12} sm={6} md={4}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <ContentCard
                  title={post.title}
                  imageUrl={post.imageUrl}
                  description={DOMPurify.sanitize(post.content).replace(/<[^>]*>?/gm, '').slice(0, 100) + '...'}
                  href={`/blog/${post.id}`}
                />
              </motion.div>
            </Grid>
          ))}
      </Grid>

      {/* Mangas VIP */}
      {sectionTitle('Mangas Mis en Avant')}
      <Grid container spacing={4} mb={8}>
        {loading
          ? Array.from({ length: 2 }).map((_, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3, bgcolor: '#333333' }} />
              <Skeleton variant="text" sx={{ bgcolor: '#4a4a4a', my: 1 }} />
              <Skeleton variant="text" width="60%" sx={{ bgcolor: '#4a4a4a' }} />
            </Grid>
          ))
          : vipMangas.map((manga) => (
            <Grid item key={manga.id} xs={12} sm={6} md={4}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <ContentCard
                  title={manga.title}
                  imageUrl={manga.imageUrl}
                  description={DOMPurify.sanitize(manga.description).replace(/<[^>]*>?/gm, '').slice(0, 100) + '...'}
                  href={`/manga/${manga.id}`}
                />
              </motion.div>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}