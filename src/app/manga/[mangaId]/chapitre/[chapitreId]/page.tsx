'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container, Typography, Box, Skeleton, Button, IconButton
} from '@mui/material';
import { Fullscreen, FullscreenExit } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

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
  const swiperRef = useRef<HTMLDivElement>(null);
  const [chapitre, setChapitre] = useState<Chapitre | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextChapter, setNextChapter] = useState<NextChapter | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      swiperRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading || !chapitre || !Array.isArray(chapitre.pages)) {
    return (
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Skeleton variant="text" height={50} />
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 6,
        mb: 10,
        backgroundColor: '#121212',
        p: 3,
        borderRadius: 3,
        boxShadow: '0 0 15px rgba(0,0,0,0.5)',
      }}
    >
      {/* Titre et bouton plein écran */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight="bold">
          {chapitre.titre}
        </Typography>
        <IconButton onClick={toggleFullscreen} sx={{ color: '#d9d9d9' }}>
          {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>
      </Box>

      {/* Swiper */}
      <Box ref={swiperRef}>
        <Swiper
          modules={[Pagination, Keyboard]}
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          spaceBetween={0}
          slidesPerView={1}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          style={{ borderRadius: '12px', overflow: 'hidden' }}
        >
          {chapitre.pages.map((page, index) => (
            <SwiperSlide key={index}>
              <Box
                component="img"
                src={page.url}
                alt={page.title || `Page ${index + 1}`}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '85vh',
                  objectFit: 'contain',
                  backgroundColor: '#111',
                  borderRadius: 2,
                }}
              />
            </SwiperSlide>
          ))}

          {nextChapter && (
            <SwiperSlide>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="85vh"
                sx={{ textAlign: 'center', color: '#d9d9d9' }}
              >
                <Typography variant="h5" gutterBottom>
                  Vous avez terminé ce chapitre !
                </Typography>
                <Button
                  variant="contained"
                  onClick={() =>
                    router.push(`/manga/${mangaId}/chapitre/${nextChapter.id}`)
                  }
                  sx={{
                    mt: 2,
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
            </SwiperSlide>
          )}
        </Swiper>
      </Box>

      <Typography
        variant="caption"
        display="block"
        align="center"
        sx={{ mt: 2, color: '#777' }}
      >
        Page {Math.min(activeIndex + 1, chapitre.pages.length)} sur {chapitre.pages.length}
      </Typography>
    </Container>
  );
}