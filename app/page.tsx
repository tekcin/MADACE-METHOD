'use client';

import Link from 'next/link';
import { ProjectBadge } from '@/components/features/ProjectBadge';

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl bg-gray-900 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">MADACE Web UI</h1>
          <p className="mt-2 text-gray-400">
            Methodology for AI-Driven Agile Collaboration Engine - v3.0
          </p>
        </div>
        <ProjectBadge />
      </div>

      {/* Quick Actions Bar */}
      <div className="mb-8 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-200">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/kanban?action=new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Story
          </Link>

          <Link
            href="/workflows"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-green-700 hover:shadow-md"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Run Workflow
          </Link>

          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-purple-700 hover:shadow-md"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Chat
          </Link>

          <Link
            href="/ide"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-600 hover:shadow-md"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            Open IDE
          </Link>
        </div>
      </div>

      {/* Status overview */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="text-sm text-gray-400">Total Agents</div>
          <div className="mt-1 text-2xl font-bold text-white">22</div>
          <div className="mt-1 text-xs text-gray-500">All Modules</div>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="text-sm text-gray-400">Active Workflows</div>
          <div className="mt-1 text-2xl font-bold text-white">0</div>
          <div className="mt-1 text-xs text-gray-500">Ready to start</div>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="text-sm text-gray-400">System Status</div>
          <div className="mt-1 flex items-center">
            <div className="size-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-lg font-bold text-white">Operational</span>
          </div>
          <div className="mt-1 text-xs text-gray-500">All systems running</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/setup"
            className="block rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center space-x-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-blue-900 text-blue-300">
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Setup Wizard</h3>
                <p className="text-sm text-gray-400">Configure your installation</p>
              </div>
            </div>
          </Link>

          <Link
            href="/agents"
            className="block rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center space-x-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-green-900 text-green-300">
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Agents</h3>
                <p className="text-sm text-gray-400">View and manage agents</p>
              </div>
            </div>
          </Link>

          <Link
            href="/kanban"
            className="block rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center space-x-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-purple-900 text-purple-300">
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Kanban Board</h3>
                <p className="text-sm text-gray-400">Track story lifecycle</p>
              </div>
            </div>
          </Link>

          <Link
            href="/workflows"
            className="block rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center space-x-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-orange-900 text-orange-300">
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Workflows</h3>
                <p className="text-sm text-gray-400">Execute workflows</p>
              </div>
            </div>
          </Link>

          <Link
            href="/llm-test"
            className="block rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center space-x-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-pink-900 text-pink-300">
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">LLM Test</h3>
                <p className="text-sm text-gray-400">Test LLM connections</p>
              </div>
            </div>
          </Link>

          <Link
            href="/settings"
            className="block rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center space-x-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-gray-700 text-gray-300">
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white">Settings</h3>
                <p className="text-sm text-gray-400">Configure application</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Getting started */}
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
        <h2 className="mb-3 text-lg font-bold text-white">Getting Started</h2>
        <p className="mb-4 text-sm text-gray-200">
          Welcome to the MADACE Web UI! This interface provides access to all MADACE features:
        </p>
        <ol className="list-inside list-decimal space-y-2 text-sm text-gray-300">
          <li>
            <strong>Setup Wizard</strong> - Configure project settings and LLM provider
          </li>
          <li>
            <strong>Agents</strong> - View and interact with AI agents (PM, Analyst, Architect, SM,
            DEV)
          </li>
          <li>
            <strong>Kanban Board</strong> - Visual workflow state tracking (BACKLOG → TODO → IN
            PROGRESS → DONE)
          </li>
          <li>
            <strong>Workflows</strong> - Execute automated development workflows
          </li>
          <li>
            <strong>LLM Test</strong> - Verify your LLM provider configuration
          </li>
          <li>
            <strong>Settings</strong> - Manage application and module settings
          </li>
        </ol>
      </div>
    </div>
  );
}
