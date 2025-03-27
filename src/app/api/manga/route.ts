import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_DIRECTUS_API}/items/mangas`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_TOKEN}`,
        },
        params: {
          fields: [
            'id',
            'titre',
            'description',
            'couverture.filename_disk',
            'couverture.title',
            'vip',
            'status',
            'categorie.id',
            'categorie.titre', // 👈 Relation ajoutée ici
          ].join(','),
          filter: {
            status: { _eq: 'published' },
          },
          sort: '-id',
        },
      }
    );

    const mangas = response.data.data.map((manga: any) => ({
      id: manga.id,
      title: manga.titre,
      description: manga.description,
      imageUrl: manga.couverture?.filename_disk
        ? `${process.env.NEXT_PUBLIC_DIRECTUS_STORAGE}/uploads/${manga.couverture.filename_disk}`
        : '/images/default-cover.jpg',
      vip: manga.vip ?? false,
      categorie: manga.categorie
        ? { id: manga.categorie.id, titre: manga.categorie.titre }
        : undefined,
    }));

    return NextResponse.json(mangas);
  } catch (error: any) {
    console.error('Erreur récupération mangas Directus:', error.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}