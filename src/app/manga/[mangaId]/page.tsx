'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Container, Typography, Box, Skeleton, Chip, Card, CardActionArea,
  CardContent, Divider, Stack
} from '@mui/material';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import NextLink from 'next/link';

type Chapitre = {
  id: string;
  titre: string;
};

type Manga = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  categorie?: string | null;
  chapitres: Chapitre[];
};

export default function MangaDetailPage() {
  const { mangaId } = useParams();
  const [manga, setManga] = useState<Manga | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const res = await fetch(`/api/manga/${mangaId}`);
        const data = await res.json();
        setManga(data);
      } catch (error) {
        console.error('Erreur récupération manga :', error);
      } finally {
        setLoading(false);
      }
    };

    if (mangaId) fetchManga();
  }, [mangaId]);

  if (loading || !manga) {
    return (
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2, mb: 3 }} />
        <Skeleton variant="text" height={60} />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="rectangular" height={200} sx={{ mt: 4 }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >

        {/* Couverture style bannière */}
        {manga.imageUrl && (
          <Box
            sx={{
              width: '100%',
              height: 250,
              overflow: 'hidden',
              borderRadius: 2,
              mb: 4,
              boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
            }}
          >
            <Box
              component="img"
              src={manga.imageUrl}
              alt={manga.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        )}

        {/* Titre & catégorie */}
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          {manga.title}
        </Typography>

        {manga.categorie && (
          <Chip label={manga.categorie} sx={{ mb: 2, backgroundColor: '#0077b6', color: '#fff' }} />
        )}

        {/* Description */}
        <Typography variant="subtitle1" fontWeight="bold">
                        📖 Résumé
                      </Typography>
        <Box
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(manga.description),
          }}
          sx={{
            backgroundColor: '#1a1a1a',
            padding: 4,
            borderRadius: 2,
            color: '#d9d9d9',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
            '& p': { marginBottom: '1.5em' },
          }}
        />

        {/* Chapitres */}
        {Array.isArray(manga.chapitres) && manga.chapitres.length > 0 && (
          <>
            <Divider sx={{ my: 6, borderColor: '#333' }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Chapitres disponibles
            </Typography>
            <Stack spacing={2}>
              {manga.chapitres.map((chapitre, index) => (
                <Card key={chapitre.id} sx={{ backgroundColor: '#2a2a2a', color: '#fff' }}>
                  <CardActionArea component={NextLink} href={`/manga/${manga.id}/chapitre/${chapitre.id}`}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">
                        📖 Chapitre {index + 1} — {chapitre.titre}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </motion.div>
    </Container>
  );
}