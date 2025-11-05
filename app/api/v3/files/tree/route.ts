import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { existsSync, statSync } from 'fs';
import { getProjectRoot } from '@/lib/services/file-service';

interface FileTreeItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  extension?: string;
  children?: FileTreeItem[];
}

// Directories to exclude from file tree
const EXCLUDED_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  'dist',
  'build',
  'coverage',
  '.cache',
  '.vscode',
  'prisma/migrations', // Exclude migrations folder
]);

// Files to exclude
const EXCLUDED_FILES = new Set([
  '.DS_Store',
  'thumbs.db',
  '*.log',
  '*.lock',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
]);

/**
 * Build file tree recursively
 */
async function buildFileTree(
  dirPath: string,
  relativePath: string = '',
  depth: number = 0
): Promise<FileTreeItem | null> {
  const MAX_DEPTH = 5; // Limit tree depth to prevent infinite recursion

  if (depth > MAX_DEPTH) {
    return null;
  }

  const fullPath = path.join(dirPath, relativePath);
  const stats = statSync(fullPath);
  const name = path.basename(fullPath) || 'project';

  // Skip excluded directories
  if (EXCLUDED_DIRS.has(name)) {
    return null;
  }

  // Skip excluded files
  if (EXCLUDED_FILES.has(name)) {
    return null;
  }

  const item: FileTreeItem = {
    id: relativePath || 'root',
    name,
    type: stats.isDirectory() ? 'folder' : 'file',
    path: relativePath ? `/${relativePath}` : '/',
  };

  if (stats.isFile()) {
    const ext = path.extname(name);
    if (ext) {
      item.extension = ext.slice(1); // Remove the dot
    }
  }

  if (stats.isDirectory()) {
    try {
      const children = await fs.readdir(fullPath);
      const childItems: FileTreeItem[] = [];

      for (const child of children) {
        const childRelativePath = relativePath ? path.join(relativePath, child) : child;
        const childItem = await buildFileTree(dirPath, childRelativePath, depth + 1);

        if (childItem) {
          childItems.push(childItem);
        }
      }

      // Sort: folders first, then files, both alphabetically
      childItems.sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === 'folder' ? -1 : 1;
      });

      if (childItems.length > 0) {
        item.children = childItems;
      }
    } catch (error) {
      console.error(`Error reading directory ${fullPath}:`, error);
    }
  }

  return item;
}

/**
 * GET /api/v3/files/tree
 *
 * Build file tree for the project
 */
export async function GET(request: NextRequest) {
  try {
    const projectRoot = getProjectRoot();

    if (!existsSync(projectRoot)) {
      return NextResponse.json({ success: false, error: 'Project root not found' }, { status: 404 });
    }

    const tree = await buildFileTree(projectRoot);

    if (!tree) {
      return NextResponse.json({ success: false, error: 'Failed to build file tree' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: tree,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API] Error building file tree:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
