import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ mangaId: string }> }
) {
  const { mangaId } = await params;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_DIRECTUS_API}/items/mangas/${mangaId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'User-Agent': 'NextJS-Server'
        },
        params: {
          fields: [
            'id',
            'titre',
            'description',
            'couverture.filename_disk',
            'categorie.titre',
            'chapitres.id',
            'chapitres.titre'
          ].join(',')
        }
      }
    );

    const manga = response.data.data;
    console.log('[🧪 DEBUG MANGA API]', manga);

    const result = {
      id: manga.id,
      title: manga.titre,
      description: manga.description,
      imageUrl: manga.couverture?.filename_disk
        ? `${process.env.NEXT_PUBLIC_DIRECTUS_STORAGE}/uploads/${manga.couverture.filename_disk}`
        : '/images/default-cover.jpg',
      categorie: manga.categorie?.titre || null,
      chapitres: manga.chapitres?.map((c: any) => ({
        id: c.id,
        titre: c.titre,
      })) || [],
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Erreur récupération manga détail :', error.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}