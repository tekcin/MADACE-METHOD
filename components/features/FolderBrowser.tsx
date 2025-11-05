'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, FolderIcon, ChevronRightIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

interface Directory {
  name: string;
  path: string;
}

interface FolderBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  initialPath?: string;
}

export function FolderBrowser({ isOpen, onClose, onSelect, initialPath }: FolderBrowserProps) {
  const [currentPath, setCurrentPath] = useState<string>(initialPath || '');
  const [parentPath, setParentPath] = useState<string | null>(null);
  const [directories, setDirectories] = useState<Directory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load directories when path changes
  useEffect(() => {
    if (isOpen) {
      loadDirectories(currentPath || undefined);
    }
  }, [isOpen, currentPath]);

  const loadDirectories = async (path?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v3/settings/browse-folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to load directories');
      }

      setCurrentPath(result.data.currentPath);
      setParentPath(result.data.parentPath);
      setDirectories(result.data.directories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load directories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const handleGoUp = () => {
    if (parentPath) {
      setCurrentPath(parentPath);
    }
  };

  const handleSelect = () => {
    onSelect(currentPath);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  // Generate breadcrumb segments from current path
  const getBreadcrumbs = () => {
    if (!currentPath) return [];

    const parts = currentPath.split(/[/\\]/).filter(Boolean);
    const breadcrumbs: { label: string; path: string }[] = [];

    // Add root
    const root = currentPath.startsWith('/') ? '/' : currentPath.split(/[/\\]/)[0] + '\\';
    breadcrumbs.push({ label: root === '/' ? 'Root' : root, path: root });

    // Add each directory level
    let accumulatedPath = root;
    parts.forEach((part, index) => {
      if (index === 0 && !currentPath.startsWith('/')) {
        return; // Skip drive letter on Windows (already added as root)
      }
      accumulatedPath = accumulatedPath === '/' ? `/${part}` : `${accumulatedPath}/${part}`;
      breadcrumbs.push({ label: part, path: accumulatedPath });
    });

    return breadcrumbs;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={handleClose}></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl transform overflow-hidden rounded-lg bg-gray-800 shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-6 py-4">
            <h3 className="text-lg font-semibold text-white" id="modal-title">
              Browse Folders
            </h3>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-700 hover:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Current Path Display */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Current Path</label>
              <div className="flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2">
                <FolderIcon className="h-5 w-5 flex-shrink-0 text-blue-400" />
                <span className="flex-1 font-mono text-sm text-gray-200 overflow-x-auto whitespace-nowrap">
                  {currentPath || 'Loading...'}
                </span>
              </div>
            </div>

            {/* Breadcrumb Navigation */}
            {currentPath && (
              <div className="mb-4 flex items-center gap-1 overflow-x-auto whitespace-nowrap text-sm">
                {getBreadcrumbs().map((crumb, index) => (
                  <div key={crumb.path} className="flex items-center">
                    {index > 0 && <ChevronRightIcon className="h-4 w-4 text-gray-500 mx-1" />}
                    <button
                      type="button"
                      onClick={() => handleNavigate(crumb.path)}
                      className="rounded px-2 py-1 text-blue-400 hover:bg-gray-700 hover:text-blue-300"
                    >
                      {crumb.label}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation Controls */}
            {parentPath && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleGoUp}
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600"
                >
                  <ArrowUpIcon className="h-4 w-4" />
                  Go Up
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-md bg-red-900/20 p-3">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Directory List */}
            <div className="mb-4 max-h-96 overflow-y-auto rounded-md border border-gray-700 bg-gray-900">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-8 w-8 animate-spin text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="mt-2 text-sm text-gray-400">Loading directories...</p>
                  </div>
                </div>
              ) : directories.length === 0 ? (
                <div className="py-12 text-center">
                  <FolderIcon className="mx-auto h-12 w-12 text-gray-600" />
                  <p className="mt-2 text-sm text-gray-400">No subdirectories found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {directories.map((dir) => (
                    <button
                      key={dir.path}
                      type="button"
                      onClick={() => handleNavigate(dir.path)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors"
                    >
                      <FolderIcon className="h-5 w-5 flex-shrink-0 text-blue-400" />
                      <span className="flex-1 text-sm text-gray-200">{dir.name}</span>
                      <ChevronRightIcon className="h-4 w-4 text-gray-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-700 bg-gray-800 px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSelect}
              disabled={!currentPath}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              Select This Folder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
