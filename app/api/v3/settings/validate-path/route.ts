/**
 * Path Validation API
 *
 * POST /api/v3/settings/validate-path
 * Validates a file system path for use as project root
 */

import { NextRequest, NextResponse } from 'next/server';
import { existsSync, statSync } from 'fs';
import { access, constants } from 'fs/promises';
import path from 'path';

interface ValidatePathRequest {
  path: string;
}

interface ValidatePathResponse {
  valid: boolean;
  exists: boolean;
  isDirectory: boolean;
  isAbsolute: boolean;
  writable: boolean;
  readable: boolean;
  message: string;
  resolvedPath?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ValidatePathRequest = await request.json();

    if (!body.path || typeof body.path !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing or invalid path parameter',
        },
        { status: 400 }
      );
    }

    const result = await validatePath(body.path);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

/**
 * Validate a path for use as project root
 */
async function validatePath(inputPath: string): Promise<ValidatePathResponse> {
  const result: ValidatePathResponse = {
    valid: false,
    exists: false,
    isDirectory: false,
    isAbsolute: path.isAbsolute(inputPath),
    writable: false,
    readable: false,
    message: '',
  };

  // Check if path is absolute
  if (!result.isAbsolute) {
    result.message = 'Path must be an absolute path (e.g., /Users/name/projects or C:\\Users\\name\\projects)';
    return result;
  }

  // Resolve path to normalize (remove .., ., etc.)
  try {
    result.resolvedPath = path.resolve(inputPath);
  } catch (error) {
    result.message = `Failed to resolve path: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return result;
  }

  // Check if path exists
  if (!existsSync(result.resolvedPath)) {
    result.message = 'Path does not exist. Please create the directory first or provide an existing path.';
    return result;
  }

  result.exists = true;

  // Check if path is a directory
  try {
    const stats = statSync(result.resolvedPath);
    result.isDirectory = stats.isDirectory();
  } catch (error) {
    result.message = `Failed to read path stats: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return result;
  }

  if (!result.isDirectory) {
    result.message = 'Path must be a directory, not a file.';
    return result;
  }

  // Check read permission
  try {
    await access(result.resolvedPath, constants.R_OK);
    result.readable = true;
  } catch {
    result.message = 'Directory is not readable. Please check permissions.';
    return result;
  }

  // Check write permission
  try {
    await access(result.resolvedPath, constants.W_OK);
    result.writable = true;
  } catch {
    result.message = 'Directory is not writable. Please check permissions.';
    return result;
  }

  // All checks passed
  result.valid = true;
  result.message = `✓ Valid project root path. Resolved to: ${result.resolvedPath}`;

  return result;
}
