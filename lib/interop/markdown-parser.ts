/**
 * BMAD Markdown Agent Parser
 *
 * Parses BMAD markdown agent files (.md) into structured data
 */

import type { ParsedBMADAgent } from './types';

/**
 * Parse BMAD markdown agent file content
 */
export function parseMarkdownAgent(content: string): ParsedBMADAgent {
  const lines = content.split('\n');
  const result: Partial<ParsedBMADAgent> = {
    workflows: [],
    principles: [],
  };

  let currentSection = '';
  let sectionContent: string[] = [];
  let inListSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Extract agent name from # Title (level 1 heading)
    if (line.startsWith('# ') && !result.name) {
      result.name = line.replace(/^#\s+/, '').trim();
      continue;
    }

    // Detect section headers (## Section Name)
    if (line.startsWith('## ')) {
      // Save previous section
      if (currentSection && sectionContent.length > 0) {
        const content = sectionContent.join('\n').trim();
        const sectionKey = normalizeSectionName(currentSection);
        assignSection(result, sectionKey, content);
      }

      currentSection = line.replace(/^##\s+/, '').trim();
      sectionContent = [];
      inListSection = false;
      continue;
    }

    // Extract workflows (- *trigger - Description or - *trigger: Description)
    if (line.trim().startsWith('- *')) {
      // Match: - *workflow-name - Description or - *workflow-name: Description
      const match = line.match(/^-\s+\*([^\s:-]+)[\s:-]+(.+)$/);
      if (match && match[1] && match[2]) {
        result.workflows!.push({
          trigger: `*${match[1]}`,
          description: match[2].trim(),
        });
      }
      continue;
    }

    // Extract principles as bullet list
    if (
      currentSection &&
      currentSection.toLowerCase().includes('principle') &&
      line.trim().startsWith('- ')
    ) {
      const principle = line.replace(/^-\s+/, '').trim();
      if (principle) {
        result.principles!.push(principle);
      }
      inListSection = true;
      continue;
    }

    // Extract critical actions
    if (
      currentSection &&
      currentSection.toLowerCase().includes('critical') &&
      line.trim().startsWith('- ')
    ) {
      if (!result.critical_actions) {
        result.critical_actions = [];
      }
      const action = line.replace(/^-\s+/, '').trim();
      if (action) {
        result.critical_actions.push(action);
      }
      inListSection = true;
      continue;
    }

    // Accumulate section content (only non-list items)
    if (!inListSection && line.trim()) {
      sectionContent.push(line);
    }
  }

  // Save last section
  if (currentSection && sectionContent.length > 0) {
    const content = sectionContent.join('\n').trim();
    const sectionKey = normalizeSectionName(currentSection);
    assignSection(result, sectionKey, content);
  }

  // Validation
  if (!result.name) {
    throw new Error('Agent name not found (missing # Title)');
  }
  if (!result.role) {
    throw new Error('Agent role not found (missing ## Role section)');
  }
  if (!result.identity) {
    throw new Error('Agent identity not found (missing ## Identity section)');
  }

  return result as ParsedBMADAgent;
}

/**
 * Normalize section name to field name
 */
function normalizeSectionName(section: string): string {
  return section.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '');
}

/**
 * Assign parsed content to appropriate field
 */
function assignSection(agent: Partial<ParsedBMADAgent>, sectionKey: string, content: string): void {
  switch (sectionKey) {
    case 'role':
      agent.role = content;
      break;
    case 'identity':
      agent.identity = content;
      break;
    case 'communication_style':
    case 'communicationstyle':
      agent.communication_style = content;
      break;
    case 'title':
      agent.title = content;
      break;
    case 'icon':
      agent.icon = content.trim();
      break;
    default:
      // Unknown section - could be custom
      break;
  }
}

/**
 * Extract agent name from markdown content (first # heading)
 */
export function extractAgentName(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match && match[1] ? match[1].trim() : null;
}

/**
 * Extract workflows from markdown content
 */
export function extractWorkflows(content: string): Array<{ trigger: string; description: string }> {
  const workflows: Array<{ trigger: string; description: string }> = [];
  const lines = content.split('\n');

  for (const line of lines) {
    if (line.trim().startsWith('- *')) {
      const match = line.match(/^-\s+\*([^\s:-]+)[\s:-]+(.+)$/);
      if (match && match[1] && match[2]) {
        workflows.push({
          trigger: `*${match[1]}`,
          description: match[2].trim(),
        });
      }
    }
  }

  return workflows;
}

/**
 * Extract role from markdown content
 */
export function extractRole(content: string): string | null {
  const match = content.match(/##\s+Role\s*\n+([\s\S]+?)(?=\n##|$)/i);
  return match && match[1] ? match[1].trim() : null;
}
