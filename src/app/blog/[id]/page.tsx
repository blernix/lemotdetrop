'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Typography, Box, Skeleton, Chip, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';

type BlogPost = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  categorie?: string | null;
};

export default function BlogDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${id}`);
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error('Erreur récupération article:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  // ⛱️ Remplacement des URL d'assets par celles du bucket
  const transformedContent = post?.content
    ? DOMPurify.sanitize(
        post.content.replace(
          /src="https:\/\/admin\.2minaci\.xyz\/assets\/([^"]+)"/g,
          `src="${process.env.NEXT_PUBLIC_DIRECTUS_STORAGE}/uploads/$1"`
        )
      )
    : '';

  if (loading || !post) {
    return (
      <Container maxWidth="md" sx={{ mt: 10 }}>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2, mb: 3 }} />
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
        {post.categorie && (
          <Chip label={post.categorie} sx={{ mb: 2, backgroundColor: '#0077b6', color: '#fff' }} />
        )}

        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          {post.title}
        </Typography>

        {post.imageUrl && (
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
              src={post.imageUrl}
              alt={post.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        )}

        <Divider sx={{ my: 4, borderColor: '#333' }} />

        <Box
          dangerouslySetInnerHTML={{ __html: transformedContent }}
          sx={{
            backgroundColor: '#1a1a1a',
            padding: 4,
            borderRadius: 2,
            color: '#d9d9d9',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
            '& p': { marginBottom: '1.5em' },
            '& h2': { fontSize: '1.6rem', fontWeight: 'bold', mt: 4, mb: 2, color: '#ffffff' },
            '& ul': { pl: 3, mb: 2 },
            '& li': { mb: 1 },
            '& blockquote': {
              borderLeft: '4px solid #0077b6',
              pl: 2,
              color: '#aaa',
              fontStyle: 'italic',
              mb: 3,
            },
            '& img': {
              maxWidth: '100%',
              height: '45%',
              borderRadius: '4px',
              mt: 3,
              mb: 3,
            },
          }}
        />
      </motion.div>
    </Container>
  );
}