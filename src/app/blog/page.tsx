'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Button, Skeleton, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import Hero from '../compoments/layout/Hero';
import ContentCard from '../compoments/cards/ContentCard';

type Category = {
  id: number;
  titre: string;
};

type BlogPost = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  vip: boolean;
  categorie?: { id: number; titre: string };
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, catRes] = await Promise.all([
          fetch('/api/blog'),
          fetch('/api/blog/categories'),
        ]);

        const blogData = await blogRes.json();
        const catData = await catRes.json();

        setPosts(Array.isArray(blogData) ? blogData : []);
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (error) {
        console.error('Erreur récupération blog ou catégories :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.categorie?.id === selectedCategory)
    : posts;

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Hero
        title="Bienvenu sur la partie blog"
        subtitle="Laissez-vous emporter par des articles touchant à des sujets divers et variés."
      />

      <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
        Tous les Articles
      </Typography>

      <Stack
  direction="row"
  spacing={2}
  justifyContent="center"
  mb={6}
  flexWrap="wrap"
>
  <Button
    variant="contained"
    onClick={() => setSelectedCategory(null)}
    sx={{
      backgroundColor: !selectedCategory ? '#0077b6' : '#2a2a2a',
      color: '#fff',
      border: '1px solid #444',
      '&:hover': {
        backgroundColor: !selectedCategory ? '#005f87' : '#1f1f1f',
      },
    }}
  >
    Tous
  </Button>
  {categories.map((cat) => (
    <Button
      key={cat.id}
      onClick={() => setSelectedCategory(cat.id)}
      sx={{
        backgroundColor: selectedCategory === cat.id ? '#0077b6' : '#2a2a2a',
        color: '#fff',
        border: '1px solid #444',
        '&:hover': {
          backgroundColor:
            selectedCategory === cat.id ? '#005f87' : '#1f1f1f',
        },
      }}
    >
      {cat.titre}
    </Button>
  ))}
</Stack>

      <Grid container spacing={4} mb={8}>
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3, bgcolor: '#333' }} />
                <Skeleton variant="text" sx={{ bgcolor: '#4a4a4a', my: 1 }} />
                <Skeleton variant="text" width="60%" sx={{ bgcolor: '#4a4a4a' }} />
              </Grid>
            ))
          : filteredPosts.map((post) => (
              <Grid item key={post.id} xs={12} sm={6} md={4}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <ContentCard
                    title={post.title}
                    imageUrl={post.imageUrl}
                    href={`/blog/${post.id}`}
                    description={DOMPurify.sanitize(post.content).replace(/<[^>]*>?/gm, '').slice(0, 100) + '...'}
                  />
                </motion.div>
              </Grid>
            ))}
      </Grid>
    </Container>
  );
}