import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { homedir } from 'os';

/**
 * POST /api/v3/settings/browse-folders
 * Browse directories on the file system
 *
 * Request body:
 * {
 *   "path": "/path/to/directory" (optional, defaults to home directory)
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "currentPath": "/absolute/path",
 *     "parentPath": "/parent/path" | null,
 *     "directories": [
 *       { "name": "folder1", "path": "/absolute/path/folder1" },
 *       { "name": "folder2", "path": "/absolute/path/folder2" }
 *     ]
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requestedPath = body.path || homedir();

    // Resolve to absolute path
    const absolutePath = path.resolve(requestedPath);

    // Security: Ensure path exists and is a directory
    let stats;
    try {
      stats = await fs.stat(absolutePath);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Path does not exist or is not accessible',
        },
        { status: 400 }
      );
    }

    if (!stats.isDirectory()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Path is not a directory',
        },
        { status: 400 }
      );
    }

    // Security: Prevent access to sensitive system directories
    const normalizedPath = path.normalize(absolutePath);
    const sensitivePatterns = [
      '/etc',
      '/var',
      '/sys',
      '/proc',
      '/dev',
      '/boot',
      'C:\\Windows',
      'C:\\System32',
    ];

    const isSensitive = sensitivePatterns.some((pattern) => {
      return normalizedPath === pattern || normalizedPath.startsWith(pattern + path.sep);
    });

    if (isSensitive) {
      return NextResponse.json(
        {
          success: false,
          error: 'Access to system directories is restricted',
        },
        { status: 403 }
      );
    }

    // Read directory contents
    let entries;
    try {
      entries = await fs.readdir(absolutePath, { withFileTypes: true });
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to read directory contents',
        },
        { status: 500 }
      );
    }

    // Filter for directories only, exclude hidden directories (starting with .)
    const directories = entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .map((entry) => ({
        name: entry.name,
        path: path.join(absolutePath, entry.name),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    // Get parent directory (null if at root)
    const parentPath = absolutePath !== path.parse(absolutePath).root ? path.dirname(absolutePath) : null;

    return NextResponse.json({
      success: true,
      data: {
        currentPath: absolutePath,
        parentPath,
        directories,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to browse directories',
      },
      { status: 500 }
    );
  }
}
