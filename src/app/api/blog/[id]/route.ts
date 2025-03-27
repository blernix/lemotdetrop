// app/api/blog/[id]/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_DIRECTUS_API}/items/blog_post/${id}`,
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
            'categorie.titre',
          ].join(','),
        },
      }
    );

    const post = response.data.data;

    const article = {
      id: post.id,
      title: post.titre,
      content: post.contenu,
      imageUrl: post.couverture?.filename_disk
        ? `${process.env.NEXT_PUBLIC_DIRECTUS_STORAGE}/uploads/${post.couverture.filename_disk}`
        : '/images/default-cover.jpg',
      vip: post.vip ?? false,
      categorie: post.categorie?.titre || null,
    };

    return NextResponse.json(article);
  } catch (error: any) {
    console.error('Erreur récupération article blog :', error.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}