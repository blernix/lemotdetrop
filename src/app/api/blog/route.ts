
    import { NextResponse } from 'next/server';
    import axios from 'axios';
    
    export async function GET() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_DIRECTUS_API}/items/blog_post`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_TOKEN}`,
            },
            params: {
              fields: [
                'id',
                'titre',
                'contenu',
                'couverture.filename_disk',
                'couverture.title',
                'vip',
                'status',
                'categorie.id',
                'categorie.titre', // 👈 On récupère la relation
              ].join(','),
              filter: {
                status: { _eq: 'published' },
              },
              sort: '-id',
            },
          }
        );
    
        const articles = response.data.data.map((post: any) => ({
          id: post.id,
          title: post.titre,
          content: post.contenu,
          imageUrl: post.couverture?.filename_disk
            ? `${process.env.NEXT_PUBLIC_DIRECTUS_STORAGE}/uploads/${post.couverture.filename_disk}`
            : '/images/default-cover.jpg',
          vip: post.vip ?? false,
          categorie: post.categorie
            ? { id: post.categorie.id, titre: post.categorie.titre }
            : undefined,
        }));
    
        return NextResponse.json(articles);
      } catch (error: any) {
        console.error('Erreur récupération blog Directus:', error.message);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
      }
    }