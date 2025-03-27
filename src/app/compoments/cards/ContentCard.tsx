'use client';

import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import Link from 'next/link';

type Props = {
  title: string;
  imageUrl: string;
  description: string;
  href: string;
};

export default function ContentCard({ title, imageUrl, description, href }: Props) {
  return (
    <Link href={href}>
 <Card
  sx={{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 3,
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    cursor: 'pointer',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0px 10px 20px rgba(0, 119, 182, 0.4)',
    },
  }}
>
  {imageUrl && (
    <CardMedia
      component="img"
      image={imageUrl}
      alt={title}
      sx={{
        height: 180,
        objectFit: 'cover',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}
    />
  )}
        <CardContent>
          <Typography variant="h6" sx={{ color: '#0077b6', fontWeight: 'bold', mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}