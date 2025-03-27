'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Grid, Button, Skeleton, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import Hero from '../compoments/layout/Hero';
import ContentCard from '../compoments/cards/ContentCard';

type Category = {
  id: number;
  titre: string;
};

type Manga = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  vip: boolean;
  categorie?: { id: number; titre: string };
};

export default function MangaPage() {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mangaRes, catRes] = await Promise.all([
          fetch('/api/manga'),
          fetch('/api/manga/categories'),
        ]);

        const mangaData = await mangaRes.json();
        const catData = await catRes.json();

        setMangas(Array.isArray(mangaData) ? mangaData : []);
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (error) {
        console.error('Erreur récupération mangas ou catégories :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMangas = selectedCategory
    ? mangas.filter((m) => m.categorie?.id === selectedCategory)
    : mangas;

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Hero
        title="Bienvenue sur la partie manga"
        subtitle="Rentrez dans des univers captivants."
      />

      <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
        Tous les Mangas
      </Typography>

      {/* Filtres par catégorie */}
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

      {/* Liste des mangas */}
      <Grid container spacing={4} mb={8}>
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Skeleton
                  variant="rectangular"
                  height={280}
                  sx={{ borderRadius: 3, bgcolor: '#333' }}
                />
                <Skeleton variant="text" sx={{ bgcolor: '#4a4a4a', my: 1 }} />
                <Skeleton variant="text" width="60%" sx={{ bgcolor: '#4a4a4a' }} />
              </Grid>
            ))
          : filteredMangas.map((manga) => {
              const cleanDescription = DOMPurify.sanitize(manga.description)
                .replace(/<[^>]*>?/gm, '')
                .slice(0, 100);

              return (
                <Grid item key={manga.id} xs={12} sm={6} md={4}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ContentCard
                      title={manga.title}
                      imageUrl={manga.imageUrl}
                      description={`${cleanDescription}...`}
                      href={`/manga/${manga.id}`}
                    />
                  </motion.div>
                </Grid>
              );
            })}
      </Grid>
    </Container>
  );
}