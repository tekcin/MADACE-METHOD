/**
 * Platform-Specific Injections
 * Story A4: IDE-specific optimizations and configurations
 *
 * Provides platform-specific enhancements for different IDEs:
 * - Claude Code: Sub-agent support, task management
 * - Windsurf: Cascade mode optimizations
 * - Cursor: Composer mode support
 * - Cline: Context window management
 * - Qwen: Multi-language support
 */

/**
 * Platform injection templates
 */
const PLATFORM_INJECTIONS = {
  'claude-code': {
    name: 'Claude Code',
    features: ['sub-agents', 'task-management', 'file-operations'],
    injections: {
      agent_suffix: `

## Claude Code Optimizations

**Sub-Agent Support:**
- You can launch specialized sub-agents using the Task tool
- Use sub-agents for complex, multi-step operations
- Each sub-agent runs independently with its own context

**Task Management:**
- Use TodoWrite tool to track multi-step workflows
- Mark tasks as pending → in_progress → completed
- Keep user informed of progress

**File Operations:**
- Prefer specialized tools (Read, Edit, Write) over bash commands
- Use Glob for file search, Grep for content search
- Cross-platform path handling with path.join()
`,
    },
  },

  windsurf: {
    name: 'Windsurf',
    features: ['cascade-mode', 'flow-optimization'],
    injections: {
      agent_suffix: `

## Windsurf Cascade Optimizations

**Cascade Mode:**
- Optimize for streaming responses
- Provide incremental progress updates
- Use clear section headers for readability

**Flow Optimization:**
- Present information in digestible chunks
- Use visual separators effectively
- Maintain conversation flow naturally
`,
    },
  },

  cursor: {
    name: 'Cursor',
    features: ['composer-mode', 'multi-file-edit'],
    injections: {
      agent_suffix: `

## Cursor Composer Optimizations

**Composer Mode:**
- Support multi-file editing workflows
- Provide clear file change summaries
- Group related changes together

**Code Navigation:**
- Reference specific line numbers for clarity
- Use file_path:line_number format
- Suggest relevant code locations
`,
    },
  },

  cline: {
    name: 'Cline',
    features: ['context-management', 'approval-workflow'],
    injections: {
      agent_suffix: `

## Cline Optimizations

**Context Management:**
- Be mindful of context window limits
- Prioritize most relevant information
- Summarize when appropriate

**Approval Workflow:**
- Explain actions before executing
- Provide clear rationale for decisions
- Wait for user confirmation when needed
`,
    },
  },

  qwen: {
    name: 'Qwen',
    features: ['multi-language', 'localization'],
    injections: {
      agent_suffix: `

## Qwen Optimizations

**Multi-Language Support:**
- Respect user's communication_language setting
- Provide clear, culturally appropriate responses
- Support localized content when available

**Localization:**
- Adapt examples to user's context
- Use appropriate date/time formats
- Consider regional conventions
`,
    },
  },

  none: {
    name: 'Generic/Other',
    features: ['standard'],
    injections: {
      agent_suffix: `

## Standard Configuration

This agent is configured for general use without IDE-specific optimizations.
All core MADACE features are available.
`,
    },
  },
};

/**
 * Get platform injection for IDE
 * @param {string} ide - IDE identifier
 * @returns {object} Platform injection configuration
 */
function getPlatformInjection(ide) {
  const injection = PLATFORM_INJECTIONS[ide] || PLATFORM_INJECTIONS.none;
  return {
    ...injection,
    ide,
  };
}

/**
 * Apply platform injections to agent content
 * @param {string} content - Base agent content
 * @param {string} ide - IDE identifier
 * @returns {string} Content with platform injections
 */
function applyPlatformInjections(content, ide) {
  const injection = getPlatformInjection(ide);

  // Append platform-specific suffix
  if (injection.injections.agent_suffix) {
    content += `\n${injection.injections.agent_suffix}`;
  }

  return content;
}

/**
 * Get all supported platforms
 * @returns {object[]} Array of supported platforms
 */
function getSupportedPlatforms() {
  return Object.entries(PLATFORM_INJECTIONS).map(([key, value]) => ({
    id: key,
    name: value.name,
    features: value.features,
  }));
}

/**
 * Validate IDE selection
 * @param {string} ide - IDE identifier
 * @returns {boolean} True if valid
 */
function isValidIDE(ide) {
  return ide in PLATFORM_INJECTIONS;
}

export { PLATFORM_INJECTIONS, getPlatformInjection, applyPlatformInjections, getSupportedPlatforms, isValidIDE };

export default {
  getPlatformInjection,
  applyPlatformInjections,
  getSupportedPlatforms,
  isValidIDE,
};
