
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://thispersondoesnotexist.com', {
      method: 'GET',
      //cache: 'no-store',
    });

    if (!response.ok) throw new Error('Errore durante il recupero dell\'immagine');

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(imageBuffer), {
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error('Errore:', error);
    return new NextResponse(JSON.stringify({ error: 'Errore durante il recupero dell\'immagine' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
