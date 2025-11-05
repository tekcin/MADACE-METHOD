/**
 * Project Settings Page
 *
 * Manage project details, members, and danger zone operations
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProject, getUserProjectRole } from '@/lib/services/project-service';
import { ProjectSettingsClient } from '@/components/features/projects/ProjectSettingsClient';

export const metadata: Metadata = {
  title: 'Project Settings - MADACE',
  description: 'Manage project settings, members, and permissions',
};

// Mock current user ID (in production, get from auth session)
const getCurrentUserId = () => 'default-user';

interface ProjectSettingsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectSettingsPage({ params }: ProjectSettingsPageProps) {
  const { id } = await params;
  const userId = getCurrentUserId();

  // Fetch project with permission check
  const project = await getProject(id, userId);

  if (!project) {
    notFound();
  }

  // Get user's role in project
  const userRole = await getUserProjectRole(id, userId);

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Project Settings</h1>
          <p className="mt-2 text-gray-400">Manage your project configuration and team members</p>
        </div>

        {/* Client Component for interactive features */}
        <ProjectSettingsClient project={project} userRole={userRole} />
      </div>
    </div>
  );
}
