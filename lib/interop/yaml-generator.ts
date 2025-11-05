/**
 * MADACE YAML Agent Generator
 *
 * Generates MADACE YAML agent files (.agent.yaml) from parsed BMAD agents
 */

import * as yaml from 'js-yaml';
import type { ParsedBMADAgent } from './types';
import type { Agent } from '@/lib/types/agent';

/**
 * Generate MADACE YAML agent from parsed BMAD agent
 */
export function generateMADACEYAML(
  bmadAgent: ParsedBMADAgent,
  targetModule: string = 'mam'
): string {
  const agent: { agent: Agent } = {
    agent: {
      metadata: {
        id: `madace/${targetModule}/agents/${bmadAgent.name.toLowerCase()}.md`,
        name: bmadAgent.name,
        title: bmadAgent.title || `${bmadAgent.name} - ${bmadAgent.role}`,
        icon: bmadAgent.icon || '🤖',
        module: targetModule as 'mam' | 'mab' | 'cis',
        version: '1.0.0',
      },
      persona: {
        role: bmadAgent.role,
        identity: bmadAgent.identity,
        communication_style: bmadAgent.communication_style || '',
        principles: bmadAgent.principles || [],
      },
      menu: bmadAgent.workflows.map((w) => ({
        trigger: w.trigger,
        action: `workflow:${w.trigger.replace(/^\*/, '')}`,
        description: w.description,
      })),
      critical_actions: bmadAgent.critical_actions,
      load_always: bmadAgent.load_always || [`madace/core/config.yaml`],
      prompts: bmadAgent.prompts?.map((p, i) => ({
        name: `prompt-${i + 1}`,
        trigger: `*prompt-${i + 1}`,
        content: p,
      })),
    },
  };

  return yaml.dump(agent, {
    indent: 2,
    lineWidth: 100,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
  });
}

/**
 * Generate BMAD markdown from MADACE agent
 */
export function generateBMADMarkdown(agent: Agent): string {
  let markdown = `# ${agent.metadata.name}\n\n`;

  // Role section
  markdown += `## Role\n\n${agent.persona.role}\n\n`;

  // Identity section
  markdown += `## Identity\n\n${agent.persona.identity}\n\n`;

  // Communication Style (if present)
  if (agent.persona.communication_style && agent.persona.communication_style.trim()) {
    markdown += `## Communication Style\n\n${agent.persona.communication_style}\n\n`;
  }

  // Principles
  if (agent.persona.principles && agent.persona.principles.length > 0) {
    markdown += `## Principles\n\n`;
    agent.persona.principles.forEach((p) => {
      markdown += `- ${p}\n`;
    });
    markdown += '\n';
  }

  // Critical Actions (if present)
  if (agent.critical_actions && agent.critical_actions.length > 0) {
    markdown += `## Critical Actions\n\n`;
    agent.critical_actions.forEach((a) => {
      markdown += `- ${a}\n`;
    });
    markdown += '\n';
  }

  // Workflows
  if (agent.menu && agent.menu.length > 0) {
    markdown += `## Workflows\n\n`;
    agent.menu.forEach((w) => {
      const trigger = w.trigger.replace(/^\*/, '');
      markdown += `- *${trigger} - ${w.description}\n`;
    });
    markdown += '\n';
  }

  return markdown;
}

/**
 * Convert MADACE agent object to YAML string
 */
export function agentToYAML(agent: Agent): string {
  const wrapped = { agent };
  return yaml.dump(wrapped, {
    indent: 2,
    lineWidth: 100,
    noRefs: true,
  });
}
