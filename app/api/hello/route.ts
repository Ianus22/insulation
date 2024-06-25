import { NextResponse } from 'next/server';

async function GET() {
  const message = `Kurec ${Date.now()}`;

  return new NextResponse(message);
}

export { GET };
