import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  _req: Request,
  context: { params: Promise<{ mangaId: string; chapitreId: string }> }
) {
  const { mangaId, chapitreId } = await context.params;

  try {
    // Récupérer le manga et tous ses chapitres
    const res = await axios.get(`${process.env.NEXT_PUBLIC_DIRECTUS_API}/items/mangas/${mangaId}`, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DIRECTUS_TOKEN}`,
      },
      params: {
        fields: ['chapitres.id', 'chapitres.titre'].join(','),
      },
    });

    const chapitres = res.data.data?.chapitres || [];

    const currentIndex = chapitres.findIndex((c: any) => c.id === chapitreId);
    const next = chapitres[currentIndex + 1];

    if (!next) {
      return NextResponse.json({ next: null });
    }

    return NextResponse.json({
      next: {
        id: next.id,
        titre: next.titre,
        url: `/manga/${mangaId}/chapitre/${next.id}`,
      },
    });
  } catch (error: any) {
    console.error('[❌ ERREUR CHAPITRE SUIVANT]', error.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}