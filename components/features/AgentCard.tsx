'use client';

/**
 * AgentCard Component
 *
 * Displays individual agent information with icon, name, and selection state.
 * Part of the agent selection UI for choosing MADACE agents.
 */

export interface AgentCardData {
  id: string;
  name: string;
  title: string;
  icon: string;
  module: string;
}

export interface AgentCardProps {
  agent: AgentCardData;
  selected?: boolean;
  onSelect?: (agentId: string) => void;
  onClick?: (agentId: string) => void;
}

export function AgentCard({ agent, selected = false, onSelect, onClick }: AgentCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(agent.id);
    }
    if (onSelect) {
      onSelect(agent.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group relative flex flex-col items-center rounded-lg border-2 p-6 transition-all ${
        selected
          ? 'border-blue-400 bg-blue-900/20 shadow-lg'
          : 'border-gray-600 bg-gray-800 hover:border-blue-500 hover:shadow-md'
      } focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none`}
      aria-pressed={selected}
      aria-label={`Select ${agent.title} agent`}
    >
      {/* Selection indicator */}
      {selected && (
        <div className="absolute top-3 right-3">
          <div className="flex size-6 items-center justify-center rounded-full bg-blue-400 text-white">
            <svg className="size-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Agent icon */}
      <div
        className={`mb-4 flex size-16 items-center justify-center rounded-full text-4xl ${selected ? 'bg-blue-800' : 'bg-gray-700'} `}
      >
        {agent.icon}
      </div>

      {/* Agent name */}
      <h3 className={`text-lg font-bold ${selected ? 'text-blue-100' : 'text-white'} `}>
        {agent.name}
      </h3>

      {/* Agent title */}
      <p className={`mt-1 text-sm ${selected ? 'text-blue-300' : 'text-gray-400'} `}>
        {agent.title}
      </p>

      {/* Module badge */}
      <div
        className={`mt-3 rounded-full px-3 py-1 text-xs font-medium uppercase ${
          selected ? 'bg-blue-700 text-blue-200' : 'bg-gray-700 text-gray-300'
        } `}
      >
        {agent.module}
      </div>
    </button>
  );
}
