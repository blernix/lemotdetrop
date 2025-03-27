import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  _req: Request,
  context: { params: Promise<{ mangaId: string; chapitreId: string }> }
) {
  const { mangaId, chapitreId } = await context.params;

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_DIRECTUS_API}/items/manga_chapters`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_TOKEN}`,
        },
        params: {
          fields: [
            'id',
            'titre',
            'pages.directus_files_id.filename_disk',
            'pages.directus_files_id.title'
          ].join(','),
          filter: {
            id: { _eq: chapitreId },
            status: { _eq: 'published' },
          },
        },
      }
    );

    const data = response.data.data?.[0];

    if (!data) {
      return NextResponse.json(
        { error: 'Chapitre non trouvé ou non publié' },
        { status: 404 }
      );
    }

    const chapitre = {
      id: data.id,
      titre: data.titre,
      pages: (data.pages || []).map((page: any) => ({
        filename: page.directus_files_id.filename_disk,
        title: page.directus_files_id.title,
        url: `${process.env.NEXT_PUBLIC_DIRECTUS_STORAGE}/uploads/${page.directus_files_id.filename_disk}`
      }))
    };

    return NextResponse.json(chapitre);
  } catch (error: any) {
    console.error('Erreur récupération chapitre manga :', error.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}