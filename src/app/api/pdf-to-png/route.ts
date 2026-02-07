import { NextRequest, NextResponse } from 'next/server';
import { createCanvas } from '@napi-rs/canvas';
import { join } from 'path';
import { pathToFileURL } from 'url';

let pdfjsModule: any = null;

async function getPdfjs() {
  if (pdfjsModule) return pdfjsModule;
  pdfjsModule = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjsModule.GlobalWorkerOptions.workerSrc = pathToFileURL(
    join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')
  ).href;
  return pdfjsModule;
}

const canvasFactory = {
  create(width: number, height: number) {
    const canvas = createCanvas(width, height);
    return { canvas, context: canvas.getContext('2d') };
  },
  reset(pair: any, width: number, height: number) {
    pair.canvas.width = width;
    pair.canvas.height = height;
  },
  destroy(pair: any) {
    pair.canvas.width = 0;
    pair.canvas.height = 0;
  },
};

async function convertPdfToImage(pdfData: Uint8Array): Promise<Buffer> {
  const pdfjs = await getPdfjs();

  const doc = await pdfjs.getDocument({
    data: pdfData,
    canvasFactory: canvasFactory as any,
    disableFontFace: true,
    isEvalSupported: false,
  } as any).promise;

  const page = await doc.getPage(1);
  const scale = 2;
  const viewport = page.getViewport({ scale });

  const canvas = createCanvas(viewport.width, viewport.height);
  const context = canvas.getContext('2d');

  context.fillStyle = '#1e1e1e';
  context.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext: context as any,
    viewport,
    intent: 'print',
    canvas: canvas as any,
  }).promise;

  doc.destroy();
  return canvas.toBuffer('image/jpeg', 90);
}

export async function POST(request: NextRequest) {
  try {
    const pdfBuffer = await request.arrayBuffer();
    const imgBuffer = await convertPdfToImage(new Uint8Array(pdfBuffer));
    return new NextResponse(new Uint8Array(imgBuffer), {
      headers: { 'Content-Type': 'image/jpeg' },
    });
  } catch (e) {
    console.error('PDF to image conversion failed:', e);
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
