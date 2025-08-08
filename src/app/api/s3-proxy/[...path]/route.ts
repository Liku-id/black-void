// src/app/api/s3-proxy/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import sharp from 'sharp';

async function streamToBuffer(stream: Readable | ReadableStream | null) {
  if (!stream) return Buffer.from([]);
  if (stream instanceof Readable) {
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) chunks.push(chunk);
    return Buffer.concat(chunks);
  }
  const reader = (stream as ReadableStream).getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const key = path.join('/');

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    const response = await s3.send(command);
    const buffer = await streamToBuffer(response.Body as any);

    // Resize kalau ada param w/h
    const url = new URL(request.url);
    const width = url.searchParams.has('w')
      ? parseInt(url.searchParams.get('w')!)
      : undefined;
    const height = url.searchParams.has('h')
      ? parseInt(url.searchParams.get('h')!)
      : undefined;

    let output = buffer;
    let contentType = response.ContentType || 'application/octet-stream';

    if (width || height) {
      const img = sharp(buffer)
        .resize(width, height, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 });
      output = await streamToBuffer(response.Body as any);
      contentType = 'image/webp';
    }

    return new NextResponse(output, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error fetching image' },
      { status: 404 }
    );
  }
}
