/**
 * Projects List Page
 *
 * View and manage all user projects
 */

import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getProjects } from '@/lib/services/project-service';
import { DeleteProjectButton } from '@/components/features/projects/DeleteProjectButton';

export const metadata: Metadata = {
  title: 'Projects - MADACE',
  description: 'Manage your MADACE projects',
};

// Mock current user ID (in production, get from auth session)
const getCurrentUserId = () => 'default-user';

export default async function ProjectsPage() {
  const userId = getCurrentUserId();
  const projects = await getProjects(userId);

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Projects</h1>
            <p className="mt-2 text-gray-400">Manage your MADACE projects and their configurations</p>
          </div>
          <Link
            href="/?showCreateProject=true"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Create Project
          </Link>
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-12 text-center">
            <div className="mx-auto max-w-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="mx-auto h-12 w-12 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                />
              </svg>
              <h2 className="mt-4 text-xl font-semibold text-white">No projects yet</h2>
              <p className="mt-2 text-gray-400">
                Get started by creating your first MADACE project.
              </p>
              <Link
                href="/?showCreateProject=true"
                className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Create Your First Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const userMember = project.members.find((m) => m.userId === userId);
              const userRole = userMember?.role || null;

              return (
                <div
                  key={project.id}
                  className="group relative rounded-lg border border-gray-800 bg-gray-900 p-6 transition-colors hover:border-gray-700"
                >
                  {/* Project Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          href={`/projects/${project.id}/settings`}
                          className="block text-xl font-semibold text-white transition-colors hover:text-blue-400"
                        >
                          {project.name}
                        </Link>
                        <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                          {project.description || (
                            <span className="italic">No description</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Role Badge */}
                    <div className="mt-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                          userRole === 'owner'
                            ? 'bg-purple-900/20 text-purple-400'
                            : userRole === 'admin'
                              ? 'bg-blue-900/20 text-blue-400'
                              : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {userRole || 'member'}
                      </span>
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                      <p className="text-xs text-gray-500">Agents</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {project._count.agents}
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                      <p className="text-xs text-gray-500">Workflows</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {project._count.workflows}
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                      <p className="text-xs text-gray-500">Stories</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {project._count.stories}
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                      <p className="text-xs text-gray-500">Chats</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {project._count.chatSessions}
                      </p>
                    </div>
                  </div>

                  {/* Team Members Count */}
                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                      />
                    </svg>
                    <span>{project.members.length} member{project.members.length !== 1 ? 's' : ''}</span>
                  </div>

                  {/* Last Updated */}
                  <div className="mb-4 text-xs text-gray-500">
                    Updated {new Date(project.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 border-t border-gray-800 pt-4">
                    <Link
                      href={`/projects/${project.id}/settings`}
                      className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-center text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
                    >
                      Settings
                    </Link>
                    {userRole === 'owner' && (
                      <DeleteProjectButton
                        project={project}
                        userRole={userRole}
                        variant="icon"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
