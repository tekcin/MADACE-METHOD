/**
 * Delete Project Button Component
 *
 * Trigger button for project deletion with multiple variants
 * Shows DeleteProjectModal on click
 */

'use client';

import React, { useState } from 'react';
import type { ProjectWithMembers } from '@/lib/services/project-service';
import { DeleteProjectModal } from './DeleteProjectModal';

interface DeleteProjectButtonProps {
  project: ProjectWithMembers;
  userRole: 'owner' | 'admin' | 'member' | null;
  onDeleteSuccess?: () => void;
  variant?: 'icon' | 'button' | 'menu-item';
  className?: string;
}

export function DeleteProjectButton({
  project,
  userRole,
  onDeleteSuccess,
  variant = 'button',
  className = '',
}: DeleteProjectButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canDelete = userRole === 'owner';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (canDelete) {
      setIsModalOpen(true);
    }
  };

  const handleDeleteSuccess = () => {
    setIsModalOpen(false);
    onDeleteSuccess?.();
  };

  // Icon variant (for dropdown menus, etc.)
  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={!canDelete}
          className={`rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-900/20 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          title={canDelete ? 'Delete project' : 'Only owners can delete projects'}
          data-testid="delete-project-icon-button"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>

        <DeleteProjectModal
          project={project}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDeleteSuccess={handleDeleteSuccess}
        />
      </>
    );
  }

  // Menu item variant (for dropdown menus)
  if (variant === 'menu-item') {
    return (
      <>
        <button
          onClick={handleClick}
          disabled={!canDelete}
          className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-400 transition-colors hover:bg-red-900/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          title={canDelete ? undefined : 'Only owners can delete projects'}
          data-testid="delete-project-menu-item"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span>Delete Project</span>
        </button>

        <DeleteProjectModal
          project={project}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDeleteSuccess={handleDeleteSuccess}
        />
      </>
    );
  }

  // Button variant (default)
  return (
    <>
      <button
        onClick={handleClick}
        disabled={!canDelete}
        className={`flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-900/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        title={canDelete ? undefined : 'Only owners can delete projects'}
        data-testid="delete-project-button"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <span>Delete Project</span>
      </button>

      <DeleteProjectModal
        project={project}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </>
  );
}
