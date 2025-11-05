'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import EditorToolbar from '@/components/features/ide/EditorToolbar';
import TabBar, { FileTab } from '@/components/features/ide/TabBar';
import FileExplorer from '@/components/features/ide/FileExplorer';
import FileSearch, { GitStatus } from '@/components/features/ide/FileSearch';
import ConnectionStatus from '@/components/features/ide/ConnectionStatus';
import PresenceList from '@/components/features/ide/PresenceList';
import ToastContainer from '@/components/features/ide/Toast';
import ChatPanel from '@/components/features/ide/ChatPanel';
import { FileTreeItem } from '@/components/features/ide/FileTreeNode';

// Lazy load heavy components for better performance
const MonacoEditor = dynamic(() => import('@/components/features/ide/MonacoEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-900">
      <div className="text-sm text-gray-400">
        <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
        Loading Monaco Editor...
      </div>
    </div>
  ),
});

const Terminal = dynamic(() => import('@/components/features/ide/Terminal'), {
  ssr: false,
  loading: () => (
    <div className="flex h-20 items-center justify-center bg-gray-800">
      <div className="text-sm text-gray-400">Loading Terminal...</div>
    </div>
  ),
});

/**
 * IDE Page Component
 *
 * Full-featured code editor powered by Monaco Editor (VS Code engine)
 * Supports multi-file tab editing with keyboard shortcuts
 */
export default function IDEPage() {
  // Tab state
  const [tabs, setTabs] = useState<FileTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');

  // Sidebar state
  const [showSidebar, setShowSidebar] = useState(true);
  const [showPresenceList] = useState(true); // TODO: Add toggle button
  const [showChatPanel, setShowChatPanel] = useState(true);
  const [_onlineUserCount, setOnlineUserCount] = useState(0); // Prefix with _ to indicate intentionally unused

  // Terminal state
  const [showTerminal, setShowTerminal] = useState(false);

  // Editor options state
  const [theme, setTheme] = useState<'vs-dark' | 'vs-light' | 'hc-black' | 'hc-light'>('vs-dark');
  const [wordWrap, setWordWrap] = useState(false);
  const [minimap, setMinimap] = useState(true);
  const [lineNumbers, setLineNumbers] = useState<'on' | 'off' | 'relative'>('on');
  const [fontSize, setFontSize] = useState(14);

  // Git status state
  const [gitStatus, setGitStatus] = useState<GitStatus>({});

  // File tree state (loaded from API)
  const [fileTree, setFileTree] = useState<FileTreeItem | null>(null);
  const [isLoadingTree, setIsLoadingTree] = useState(true);
  const [treeError, setTreeError] = useState<string | null>(null);

  /**
   * Flatten file tree into a list of all files (for search)
   */
  const flattenFileTree = (tree: FileTreeItem | null): FileTreeItem[] => {
    if (!tree) return [];

    const files: FileTreeItem[] = [];

    const traverse = (item: FileTreeItem) => {
      if (item.type === 'file') {
        files.push(item);
      }
      if (item.children) {
        item.children.forEach(traverse);
      }
    };

    traverse(tree);
    return files;
  };

  const allFiles = flattenFileTree(fileTree);

  /**
   * Fetch Git status from API
   */
  const fetchGitStatus = async () => {
    try {
      const response = await fetch('/api/v3/git/status');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.statusMap) {
          setGitStatus(data.data.statusMap);
        }
      }
    } catch (error) {
      console.error('Failed to fetch Git status:', error);
    }
  };

  /**
   * Poll Git status every 10 seconds
   */
  useEffect(() => {
    // Initial fetch
    fetchGitStatus();

    // Poll every 10 seconds
    const interval = setInterval(fetchGitStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Load file tree from API on component mount
   */
  useEffect(() => {
    const loadFileTree = async () => {
      try {
        setIsLoadingTree(true);
        setTreeError(null);

        const response = await fetch('/api/v3/files/tree');
        const data = await response.json();

        if (data.success && data.data) {
          setFileTree(data.data);
        } else {
          setTreeError(data.error || 'Failed to load file tree');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setTreeError(errorMessage);
      } finally {
        setIsLoadingTree(false);
      }
    };

    loadFileTree();
  }, []);

  /**
   * Initialize with first file (README.md if exists)
   */
  useEffect(() => {
    if (!fileTree || isLoadingTree) return;

    // Try to open README.md as the first file
    const loadInitialFile = async () => {
      try {
        const response = await fetch('/api/v3/files?path=README.md');
        const data = await response.json();

        if (data.success && data.data) {
          const initialTab: FileTab = {
            id: 'tab-0',
            fileName: 'README.md',
            content: data.data.content,
            language: data.data.language,
          };
          setTabs([initialTab]);
          setActiveTabId(initialTab.id);
        }
      } catch (error) {
        // Silently fail - user can open files manually
        console.error('Failed to load initial file:', error);
      }
    };

    loadInitialFile();
  }, [fileTree, isLoadingTree]);

  /**
   * Get active tab
   */
  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  /**
   * Handle tab selection
   */
  const handleTabSelect = (tabId: string) => {
    setActiveTabId(tabId);
  };

  /**
   * Handle tab close
   */
  const handleTabClose = (tabId: string) => {
    const tabIndex = tabs.findIndex((t) => t.id === tabId);
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);

    // Select adjacent tab if closing active tab
    if (tabId === activeTabId && newTabs.length > 0) {
      const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      const newActiveTab = newTabs[newActiveIndex];
      if (newActiveTab) {
        setActiveTabId(newActiveTab.id);
      }
    }
  };

  /**
   * Open a new file from file tree
   */
  const handleFileTreeClick = async (item: FileTreeItem) => {
    if (item.type !== 'file') return;

    // Check if file is already open
    const existingTab = tabs.find((t) => t.fileName === item.name);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    // Fetch file content from API
    try {
      // Remove leading slash from path
      const filePath = item.path.startsWith('/') ? item.path.slice(1) : item.path;
      const response = await fetch(`/api/v3/files?path=${encodeURIComponent(filePath)}`);
      const data = await response.json();

      if (data.success && data.data) {
        const newTab: FileTab = {
          id: `tab-${Date.now()}`,
          fileName: item.name,
          content: data.data.content,
          language: data.data.language,
        };
        setTabs([...tabs, newTab]);
        setActiveTabId(newTab.id);
      } else {
        console.error('Failed to load file:', data.error);
      }
    } catch (error) {
      console.error('Error loading file:', error);
    }
  };

  /**
   * Open a new file by name (for dropdown)
   */
  const handleOpenFile = async (fileName: string) => {
    // Check if file is already open
    const existingTab = tabs.find((t) => t.fileName === fileName);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    // Find the file in the file tree to get its path
    const findFileInTree = (tree: FileTreeItem | null, name: string): FileTreeItem | null => {
      if (!tree) return null;
      if (tree.type === 'file' && tree.name === name) return tree;
      if (tree.children) {
        for (const child of tree.children) {
          const found = findFileInTree(child, name);
          if (found) return found;
        }
      }
      return null;
    };

    const fileItem = findFileInTree(fileTree, fileName);
    if (fileItem) {
      // Use handleFileTreeClick to fetch and open the file
      await handleFileTreeClick(fileItem);
    }
  };

  /**
   * Handle content change
   */
  const handleContentChange = (value: string | undefined) => {
    if (activeTab) {
      const newTabs = tabs.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              content: value || '',
              isDirty: true // Mark as dirty when content changes
            }
          : tab
      );
      setTabs(newTabs);
    }
  };

  /**
   * Handle keyboard shortcuts
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + W: Close current tab
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        if (activeTabId && tabs.length > 1) {
          handleTabClose(activeTabId);
        }
      }

      // Ctrl/Cmd + Tab: Next tab
      if ((e.ctrlKey || e.metaKey) && e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        if (tabs.length > 0) {
          const currentIndex = tabs.findIndex((t) => t.id === activeTabId);
          const nextIndex = (currentIndex + 1) % tabs.length;
          const nextTab = tabs[nextIndex];
          if (nextTab) {
            setActiveTabId(nextTab.id);
          }
        }
      }

      // Ctrl/Cmd + Shift + Tab: Previous tab
      if ((e.ctrlKey || e.metaKey) && e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        if (tabs.length > 0) {
          const currentIndex = tabs.findIndex((t) => t.id === activeTabId);
          const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          const prevTab = tabs[prevIndex];
          if (prevTab) {
            setActiveTabId(prevTab.id);
          }
        }
      }

      // Ctrl/Cmd + 1-8: Switch to tab by number
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '8') {
        e.preventDefault();
        const tabIndex = parseInt(e.key) - 1;
        if (tabs[tabIndex]) {
          setActiveTabId(tabs[tabIndex].id);
        }
      }

      // Ctrl + ` (backtick): Toggle terminal
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setShowTerminal((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs, activeTabId]);

  return (
    <div className="flex h-screen flex-col bg-gray-900">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-700 bg-gray-800 px-6">
        <div className="flex items-center space-x-4">
          {/* Sidebar toggle button */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="rounded p-2 transition-colors hover:bg-gray-700"
            title={showSidebar ? 'Hide sidebar' : 'Show sidebar'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
              />
            </svg>
          </button>

          <h1 className="text-xl font-bold text-white">MADACE IDE</h1>
          <span className="text-sm text-gray-400">Powered by Monaco Editor (VS Code)</span>
        </div>

        {/* File selector and connection status */}
        <div className="flex items-center space-x-4">
          {/* Connection status indicator */}
          <ConnectionStatus showUserCount showDetails />

          {/* File selector */}
          <div className="flex items-center space-x-3">
            <label htmlFor="file-select" className="text-sm text-gray-400">
              Open File:
            </label>
            <select
              id="file-select"
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  handleOpenFile(e.target.value);
                  e.target.value = ''; // Reset selection
                }
              }}
              className="rounded border border-gray-600 bg-gray-700 px-3 py-1.5 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={isLoadingTree || !fileTree}
            >
              <option value="">
                {isLoadingTree ? 'Loading files...' : 'Select a file...'}
              </option>
              {allFiles
                .filter((file) => !tabs.find((t) => t.fileName === file.name))
                .map((file) => (
                  <option key={file.id} value={file.name}>
                    {file.path.startsWith('/') ? file.path.slice(1) : file.path}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main content area with sidebar and editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer Sidebar */}
        {showSidebar && (
          <div className="w-64 overflow-y-auto border-r border-gray-700">
            {isLoadingTree ? (
              <div className="flex h-full items-center justify-center p-4">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
                  <p className="text-sm text-gray-400">Loading file tree...</p>
                </div>
              </div>
            ) : treeError ? (
              <div className="flex h-full items-center justify-center p-4">
                <div className="text-center">
                  <p className="mb-2 text-sm text-red-400">Failed to load file tree</p>
                  <p className="text-xs text-gray-500">{treeError}</p>
                </div>
              </div>
            ) : fileTree ? (
              <FileExplorer
                root={fileTree}
                selectedPath={activeTab ? `${fileTree.path}/${activeTab.fileName}` : undefined}
                onFileClick={handleFileTreeClick}
                gitStatus={gitStatus}
              />
            ) : (
              <div className="flex h-full items-center justify-center p-4">
                <p className="text-sm text-gray-400">No files available</p>
              </div>
            )}
          </div>
        )}

        {/* Editor area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Tab bar */}
          <TabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onTabSelect={handleTabSelect}
            onTabClose={handleTabClose}
          />

          {/* Editor toolbar */}
          {activeTab && (
            <EditorToolbar
              theme={theme}
              onThemeChange={setTheme}
              wordWrap={wordWrap}
              onWordWrapToggle={() => setWordWrap(!wordWrap)}
              minimap={minimap}
              onMinimapToggle={() => setMinimap(!minimap)}
              lineNumbers={lineNumbers}
              onLineNumbersChange={setLineNumbers}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
              fileName={activeTab.fileName}
              language={activeTab.language}
            />
          )}

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            {activeTab ? (
              <MonacoEditor
                value={activeTab.content}
                language={activeTab.language}
                theme={theme}
                onChange={handleContentChange}
                wordWrap={wordWrap ? 'on' : 'off'}
                minimap={minimap}
                lineNumbers={lineNumbers}
                fontSize={fontSize}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-900 text-gray-400">
                <div className="text-center">
                  <p className="mb-2 text-lg">No files open</p>
                  <p className="text-sm">Select a file from the dropdown above to get started</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {activeTab && (
            <div className="flex h-8 items-center justify-between border-t border-gray-700 bg-gray-800 px-6 text-xs text-gray-400">
              <div>
                Lines: {activeTab.content.split('\n').length} | Characters:{' '}
                {activeTab.content.length}
                {activeTab.isDirty && <span className="ml-2 text-blue-400">• Modified</span>}
              </div>
              <div>
                Language: {activeTab.language.toUpperCase()} | Encoding: UTF-8 | Tab Size: 2
              </div>
            </div>
          )}

          {/* Keyboard shortcuts hint */}
          <div className="flex h-6 items-center justify-between border-t border-gray-800 bg-gray-900 px-6 text-xs text-gray-500">
            <span>
              Shortcuts: Ctrl/Cmd+Tab (next tab) | Ctrl/Cmd+Shift+Tab (prev tab) | Ctrl/Cmd+W
              (close) | Ctrl/Cmd+1-8 (tab #) | Ctrl+` (terminal)
            </span>
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className="rounded px-2 py-0.5 transition-colors hover:bg-gray-800 hover:text-white"
              title={showTerminal ? 'Hide terminal' : 'Show terminal'}
            >
              {showTerminal ? '▼ Terminal' : '▲ Terminal'}
            </button>
          </div>

          {/* Integrated Terminal */}
          <Terminal
            projectPath="/Users/nimda/MADACE-Method-v2.0"
            visible={showTerminal}
            onHeightChange={(_height) => {
              // Terminal height changed callback
            }}
          />
        </div>

        {/* Right Sidebar: Presence List + Chat Panel */}
        {(showPresenceList || showChatPanel) && (
          <div className="flex flex-col border-l border-gray-800">
            {/* Presence List */}
            {showPresenceList && (
              <PresenceList visible={showPresenceList} onUserCountChange={setOnlineUserCount} />
            )}

            {/* Chat Panel */}
            {showChatPanel && (
              <ChatPanel
                roomId="demo-project" // Demo room ID
                userId="user-001" // Demo user ID
                userName="Demo User" // Demo user name
                userAvatar={undefined} // No avatar for demo
                visible={showChatPanel}
                onClose={() => setShowChatPanel(false)}
              />
            )}
          </div>
        )}
      </div>

      {/* Toast notifications */}
      <ToastContainer />

      {/* File Search (Ctrl+P / Cmd+P) */}
      <FileSearch files={allFiles} gitStatus={gitStatus} onFileSelect={handleFileTreeClick} />
    </div>
  );
}
