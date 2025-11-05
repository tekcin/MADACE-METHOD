import { NextRequest, NextResponse } from 'next/server';
import { readFile, listFiles, detectLanguage } from '@/lib/services/file-service';

/**
 * GET /api/v3/files?path=
 *
 * Read a file from the project
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json({ success: false, error: 'Missing path parameter' }, { status: 400 });
    }

    const content = await readFile(filePath);
    const language = detectLanguage(filePath);

    return NextResponse.json({
      success: true,
      data: {
        path: filePath,
        content,
        language,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
