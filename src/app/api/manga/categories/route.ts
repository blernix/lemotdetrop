import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_DIRECTUS_API}/items/manga_categories`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_TOKEN}`,
        },
        params: {
          fields: ['id', 'titre'].join(','),
          sort: 'titre',
        },
      }
    );

    return NextResponse.json(response.data.data);
  } catch (error: any) {
    console.error('Erreur récupération des catégories manga :', error.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}