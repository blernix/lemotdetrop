
'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Skeleton,
  Button,
  useMediaQuery,
} from '@mui/material';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

type Page = {
  filename: string;
  title?: string;
  url: string;
};

type Chapitre = {
  id: string;
  titre: string;
  pages: Page[];
};

type NextChapter = {
  id: string;
  titre: string;
};

export default function ChapitreLecturePage() {
  const { mangaId, chapitreId } = useParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [chapitre, setChapitre] = useState<Chapitre | null>(null);
  const [loading, setLoading] = useState(true);
  const [nextChapter, setNextChapter] = useState<NextChapter | null>(null);
  const [showNextButton, setShowNextButton] = useState(false);

  useEffect(() => {
    const fetchChapitre = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/manga/${mangaId}/chapitre/${chapitreId}`);
        const data = await res.json();
        setChapitre(data);

        const nextRes = await fetch(`/api/manga/${mangaId}/chapitre/${chapitreId}/next`);
        if (nextRes.ok) {
          const nextData = await nextRes.json();
          setNextChapter(nextData.next ?? null);
        }
      } catch (error) {
        console.error('Erreur chargement chapitre :', error);
      } finally {
        setLoading(false);
      }
    };

    if (chapitreId && mangaId) fetchChapitre();
  }, [chapitreId, mangaId]);

  // Initialisation de PhotoSwipe
  useEffect(() => {
    if (!chapitre || !chapitre.pages.length) return;

    const lightbox = new PhotoSwipeLightbox({
      gallery: '#gallery',
      children: 'a',
      pswpModule: () => import('photoswipe'),
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
      zoom: true,
      bgOpacity: 1,
    });

    lightbox.init();
    return () => lightbox.destroy();
  }, [chapitre]);

  // Détection de la fin du scroll pour afficher le bouton "chapitre suivant"
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const scrolledToEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
      setShowNextButton(scrolledToEnd);
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [chapitre]);

  if (loading || !chapitre || !Array.isArray(chapitre.pages)) {
    return (
      <Box sx={{ mt: 10, px: 2 }}>
        <Skeleton variant="text" height={50} />
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: '#000',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        color="white"
        mt={isMobile ? 2 : 4}
        mb={2}
      >
        {chapitre.titre}
      </Typography>

      {/* Galerie horizontale */}
      <Box
        id="gallery"
        ref={containerRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          height: 'calc(100vh - 120px)',
          px: 2,
        }}
      >
        {chapitre.pages.map((page, index) => (
          <a
            key={index}
            href={page.url}
            data-pswp-width="1200"
            data-pswp-height="1800"
            style={{ flex: '0 0 100%', scrollSnapAlign: 'center' }}
          >
            <Box
              component="img"
              src={page.url}
              alt={page.title || `Page ${index + 1}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </a>
        ))}
      </Box>

      {nextChapter && showNextButton && (
        <Box
          position="absolute"
          bottom={20}
          left="50%"
          sx={{ transform: 'translateX(-50%)' }}
        >
          <Button
            variant="contained"
            onClick={() => router.push(`/manga/${mangaId}/chapitre/${nextChapter.id}`)}
            sx={{
              px: 4,
              py: 1,
              fontSize: '1rem',
              backgroundColor: '#0077b6',
              '&:hover': { backgroundColor: '#005f87' },
            }}
          >
            Lire le chapitre suivant : {nextChapter.titre}
          </Button>
        </Box>
      )}
    </Box>
  );
}
