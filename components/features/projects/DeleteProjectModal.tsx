/**
 * Delete Project Modal Component
 *
 * Confirmation dialog for project deletion with cascade preview
 * Requires typing project name to confirm (prevents accidental deletion)
 */

'use client';

import React, { useState } from 'react';
import type { ProjectWithMembers } from '@/lib/services/project-service';

interface DeleteProjectModalProps {
  project: ProjectWithMembers;
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess?: () => void;
}

export function DeleteProjectModal({
  project,
  isOpen,
  onClose,
  onDeleteSuccess,
}: DeleteProjectModalProps) {
  const [confirmationInput, setConfirmationInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfirmed = confirmationInput === project.name;

  const handleDelete = async () => {
    if (!isConfirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/v3/projects/${project.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }

      // Success!
      onDeleteSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (isDeleting) return; // Prevent closing during deletion
    setConfirmationInput('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
        data-testid="delete-project-modal-backdrop"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg rounded-lg border border-red-900/50 bg-gray-900 shadow-xl"
          onClick={(e) => e.stopPropagation()}
          data-testid="delete-project-modal"
        >
          {/* Header */}
          <div className="border-b border-gray-800 px-6 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-900/20">
                <svg
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white">Delete Project</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Are you sure you want to delete{' '}
                  <span className="font-medium text-white">&quot;{project.name}&quot;</span>?
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            {/* Warning */}
            <div className="rounded-lg border border-red-900/50 bg-red-900/10 p-4">
              <p className="text-sm font-medium text-red-400">
                ⚠️ This action CANNOT be undone
              </p>
              <p className="mt-1 text-sm text-gray-300">
                The following data will be permanently deleted or orphaned:
              </p>
            </div>

            {/* Cascade Impact */}
            <div className="mt-4 space-y-4">
              {/* Deleted Items */}
              <div>
                <h4 className="text-sm font-semibold text-white">✓ Deleted (Permanent)</h4>
                <ul className="mt-2 space-y-1 text-sm text-gray-400">
                  <li>• {project._count.workflows} workflows</li>
                  <li>• {project._count.stories} stories (BACKLOG/TODO/IN_PROGRESS/DONE)</li>
                  <li>• {project.members.length} project member relationships</li>
                </ul>
              </div>

              {/* Orphaned Items */}
              {(project._count.chatSessions > 0 || project._count.agents > 0) && (
                <div>
                  <h4 className="text-sm font-semibold text-yellow-400">
                    ⚠️ Orphaned (Kept without project)
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm text-gray-400">
                    {project._count.chatSessions > 0 && (
                      <li>• {project._count.chatSessions} chat sessions</li>
                    )}
                    {project._count.agents > 0 && (
                      <li>• {project._count.agents} custom agents</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirmation Input */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300">
                Type the project name to confirm:
              </label>
              <input
                type="text"
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder={project.name}
                disabled={isDeleting}
                className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                data-testid="delete-project-confirmation-input"
              />
              {confirmationInput && !isConfirmed && (
                <p className="mt-1 text-xs text-red-400">
                  Project name doesn&apos;t match. Please type exactly: {project.name}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 rounded-lg border border-red-900/50 bg-red-900/10 p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-800 px-6 py-4">
            <button
              onClick={handleClose}
              disabled={isDeleting}
              className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              data-testid="delete-project-cancel-button"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={!isConfirmed || isDeleting}
              className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              data-testid="delete-project-confirm-button"
            >
              {isDeleting && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              <span>{isDeleting ? 'Deleting...' : 'Delete Project'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
