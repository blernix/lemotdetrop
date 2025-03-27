// app/manifest.ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Le Mot de Trop',
    short_name: 'MotDeTrop',
    description: "L'univers de Jackson Dominique ✨",
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0d0d0d',
    theme_color: '#1a1a1a',
    icons: [
      {
        src: '/icons/iconeapp192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/iconeapp512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    
    ],
  }
}