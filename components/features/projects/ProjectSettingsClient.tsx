/**
 * Project Settings Client Component
 *
 * Interactive client-side component for project settings
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProjectWithMembers } from '@/lib/services/project-service';
import { DeleteProjectButton } from './DeleteProjectButton';

interface ProjectSettingsClientProps {
  project: ProjectWithMembers;
  userRole: 'owner' | 'admin' | 'member' | null;
}

export function ProjectSettingsClient({ project, userRole }: ProjectSettingsClientProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(project.name);
  const [editedDescription, setEditedDescription] = useState(project.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const canEdit = userRole === 'owner' || userRole === 'admin';

  const handleSave = async () => {
    if (!canEdit) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch(`/api/v3/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedName,
          description: editedDescription || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project');
      }

      setIsEditing(false);
      router.refresh(); // Refresh server component data
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(project.name);
    setEditedDescription(project.description || '');
    setIsEditing(false);
    setSaveError(null);
  };

  const handleDeleteSuccess = () => {
    // Redirect to home page after deletion
    router.push('/');
  };

  return (
    <div className="space-y-6">
      {/* Project Details Section */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Project Details</h2>
          {!isEditing && canEdit && (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Project Name</label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Description</label>
              <textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                rows={3}
                className="mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {saveError && (
              <div className="rounded-lg border border-red-900/50 bg-red-900/10 p-3">
                <p className="text-sm text-red-400">{saveError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-400">Name</p>
              <p className="mt-1 text-white">{project.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Description</p>
              <p className="mt-1 text-white">
                {project.description || (
                  <span className="italic text-gray-500">No description provided</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Created</p>
              <p className="mt-1 text-white">
                {new Date(project.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Members Section */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Team Members</h2>
        <div className="space-y-3">
          {project.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900/20 text-blue-400">
                  {member.user.name?.charAt(0).toUpperCase() || member.user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-white">
                    {member.user.name || member.user.email}
                  </p>
                  <p className="text-sm text-gray-400">{member.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    member.role === 'owner'
                      ? 'bg-purple-900/20 text-purple-400'
                      : member.role === 'admin'
                        ? 'bg-blue-900/20 text-blue-400'
                        : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Stats */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">Project Statistics</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <p className="text-sm text-gray-400">Agents</p>
            <p className="mt-1 text-2xl font-semibold text-white">{project._count.agents}</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <p className="text-sm text-gray-400">Workflows</p>
            <p className="mt-1 text-2xl font-semibold text-white">{project._count.workflows}</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <p className="text-sm text-gray-400">Stories</p>
            <p className="mt-1 text-2xl font-semibold text-white">{project._count.stories}</p>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
            <p className="text-sm text-gray-400">Chat Sessions</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {project._count.chatSessions}
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone (Owner Only) */}
      {userRole === 'owner' && (
        <div className="rounded-lg border border-red-900/50 bg-red-900/10 p-6">
          <h2 className="mb-2 text-xl font-semibold text-red-400">Danger Zone</h2>
          <p className="mb-4 text-sm text-gray-400">
            Irreversible and destructive actions for this project.
          </p>

          <div className="flex items-start justify-between rounded-lg border border-red-900/50 bg-gray-950 p-4">
            <div>
              <h3 className="font-medium text-white">Delete this project</h3>
              <p className="mt-1 text-sm text-gray-400">
                Once you delete a project, there is no going back. Please be certain.
              </p>
            </div>
            <DeleteProjectButton
              project={project}
              userRole={userRole}
              variant="button"
              onDeleteSuccess={handleDeleteSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
