# BMAD-MADACE Compatibility Implementation Plan

**Date**: 2025-11-05
**Status**: Ready for Implementation
**Priority**: P0 (Critical for Ecosystem Compatibility)
**Timeline**: 2-4 weeks

---

## Phase 1: Immediate Compatibility Layer (Week 1-2)

### Story 1: Agent Format Converter

**ID**: COMPAT-001
**Points**: 13
**Priority**: P0 (Critical)

#### Acceptance Criteria

- ✅ Convert BMAD markdown agents (.md) to MADACE YAML (.agent.yaml)
- ✅ Convert MADACE YAML agents to BMAD markdown
- ✅ Preserve all semantic information (90%+ fidelity)
- ✅ Round-trip conversion maintains agent functionality
- ✅ CLI commands for batch conversion
- ✅ Validation and error reporting

#### Implementation

**Files to Create**:

1. `lib/interop/agent-converter.ts` (300 lines)
2. `lib/interop/markdown-parser.ts` (200 lines)
3. `lib/interop/yaml-generator.ts` (150 lines)
4. `lib/cli/commands/convert-agent.ts` (100 lines)
5. `__tests__/interop/agent-converter.test.ts` (250 lines)

**Core Functions**:

```typescript
// lib/interop/agent-converter.ts

import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

/**
 * Convert BMAD markdown agent to MADACE YAML format
 */
export async function bmadToMADACE(markdownPath: string, outputPath?: string): Promise<string> {
  // 1. Read markdown file
  const content = await fs.readFile(markdownPath, 'utf-8');

  // 2. Parse markdown structure
  const parsed = parseMarkdownAgent(content);

  // 3. Convert to MADACE schema
  const agent = {
    agent: {
      metadata: {
        id: `madace/mam/agents/${parsed.name.toLowerCase()}.md`,
        name: parsed.name,
        title: parsed.title,
        icon: parsed.icon || '🤖',
        module: 'mam', // Default to MAM, can be overridden
        version: '1.0.0',
      },
      persona: {
        role: parsed.role,
        identity: parsed.identity,
        communication_style: parsed.communication_style || '',
        principles: parsed.principles || [],
      },
      menu: parsed.workflows.map((w) => ({
        trigger: w.trigger,
        action: w.action,
        description: w.description,
      })),
      load_always: parsed.load_always || [],
      prompts: parsed.prompts || [],
    },
  };

  // 4. Generate YAML
  const yamlContent = yaml.dump(agent, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
  });

  // 5. Write to file if output path provided
  if (outputPath) {
    await fs.writeFile(outputPath, yamlContent, 'utf-8');
  }

  return yamlContent;
}

/**
 * Convert MADACE YAML agent to BMAD markdown format
 */
export async function madaceToBMAD(yamlPath: string, outputPath?: string): Promise<string> {
  // 1. Read and parse YAML
  const content = await fs.readFile(yamlPath, 'utf-8');
  const agent = yaml.load(content) as any;

  // 2. Generate markdown
  const markdown = generateMarkdownAgent(agent.agent);

  // 3. Write to file if output path provided
  if (outputPath) {
    await fs.writeFile(outputPath, markdown, 'utf-8');
  }

  return markdown;
}

/**
 * Parse BMAD markdown agent file
 */
function parseMarkdownAgent(content: string): ParsedAgent {
  const lines = content.split('\n');
  const result: any = {
    workflows: [],
    principles: [],
  };

  let currentSection = '';
  let sectionContent: string[] = [];

  for (const line of lines) {
    // Detect section headers (## Section Name)
    if (line.startsWith('##')) {
      // Save previous section
      if (currentSection) {
        result[currentSection.toLowerCase().replace(/\s+/g, '_')] = sectionContent
          .join('\n')
          .trim();
      }

      currentSection = line.replace(/^##\s+/, '').trim();
      sectionContent = [];
      continue;
    }

    // Extract agent name from # Title
    if (line.startsWith('# ') && !result.name) {
      result.name = line.replace(/^#\s+/, '').trim();
      continue;
    }

    // Extract workflows (- *trigger - Description)
    if (line.trim().startsWith('- *')) {
      const match = line.match(/^- \*([^\s]+)\s*-\s*(.+)$/);
      if (match) {
        result.workflows.push({
          trigger: `*${match[1]}`,
          action: `workflow:${match[1]}`,
          description: match[2].trim(),
        });
      }
      continue;
    }

    // Accumulate section content
    sectionContent.push(line);
  }

  // Save last section
  if (currentSection) {
    result[currentSection.toLowerCase().replace(/\s+/g, '_')] = sectionContent.join('\n').trim();
  }

  return result;
}

/**
 * Generate BMAD markdown from MADACE agent
 */
function generateMarkdownAgent(agent: any): string {
  let markdown = `# ${agent.metadata.name}\n\n`;

  // Role section
  markdown += `## Role\n${agent.persona.role}\n\n`;

  // Identity section
  markdown += `## Identity\n${agent.persona.identity}\n\n`;

  // Communication Style
  if (agent.persona.communication_style) {
    markdown += `## Communication Style\n${agent.persona.communication_style}\n\n`;
  }

  // Principles
  if (agent.persona.principles && agent.persona.principles.length > 0) {
    markdown += `## Principles\n`;
    agent.persona.principles.forEach((p: string) => {
      markdown += `- ${p}\n`;
    });
    markdown += '\n';
  }

  // Workflows
  if (agent.menu && agent.menu.length > 0) {
    markdown += `## Workflows\n`;
    agent.menu.forEach((w: any) => {
      const trigger = w.trigger.replace(/^\*/, '');
      markdown += `- *${trigger} - ${w.description}\n`;
    });
    markdown += '\n';
  }

  return markdown;
}

interface ParsedAgent {
  name: string;
  title?: string;
  icon?: string;
  role: string;
  identity: string;
  communication_style?: string;
  principles: string[];
  workflows: Array<{
    trigger: string;
    action: string;
    description: string;
  }>;
  load_always?: string[];
  prompts?: string[];
}
```

**CLI Commands**:

```typescript
// lib/cli/commands/convert-agent.ts

import { Command } from 'commander';
import { bmadToMADACE, madaceToBMAD } from '@/lib/interop/agent-converter';
import path from 'path';

export function registerConvertCommand(program: Command) {
  program
    .command('convert-agent')
    .description('Convert agents between BMAD and MADACE formats')
    .requiredOption('--from <format>', 'Source format: bmad or madace')
    .requiredOption('--input <path>', 'Input file path')
    .option('--output <path>', 'Output file path (default: auto-generated)')
    .action(async (options) => {
      const { from, input, output } = options;

      try {
        if (from === 'bmad') {
          const outputPath =
            output ||
            path.join('madace/mam/agents', path.basename(input).replace('.md', '.agent.yaml'));

          await bmadToMADACE(input, outputPath);
          console.log(`✅ Converted BMAD agent to MADACE: ${outputPath}`);
        } else if (from === 'madace') {
          const outputPath =
            output ||
            path.join('bmad/bmm/agents', path.basename(input).replace('.agent.yaml', '.md'));

          await madaceToBMAD(input, outputPath);
          console.log(`✅ Converted MADACE agent to BMAD: ${outputPath}`);
        } else {
          throw new Error(`Unknown format: ${from}. Use 'bmad' or 'madace'`);
        }
      } catch (error) {
        console.error('❌ Conversion failed:', error);
        process.exit(1);
      }
    });

  // Batch conversion command
  program
    .command('convert-agents-batch')
    .description('Convert multiple agents at once')
    .requiredOption('--from <format>', 'Source format: bmad or madace')
    .requiredOption('--input-dir <path>', 'Input directory')
    .option('--output-dir <path>', 'Output directory (default: auto-generated)')
    .action(async (options) => {
      // Batch conversion logic
    });
}
```

**Usage Examples**:

```bash
# Convert single agent: BMAD → MADACE
npm run madace convert-agent \
  --from bmad \
  --input bmad/bmm/agents/pm.md \
  --output madace/mam/agents/pm.agent.yaml

# Convert single agent: MADACE → BMAD
npm run madace convert-agent \
  --from madace \
  --input madace/mam/agents/pm.agent.yaml \
  --output bmad/bmm/agents/pm.md

# Batch convert all BMAD agents
npm run madace convert-agents-batch \
  --from bmad \
  --input-dir bmad/bmm/agents \
  --output-dir madace/mam/agents

# Batch convert all MADACE agents
npm run madace convert-agents-batch \
  --from madace \
  --input-dir madace/mam/agents \
  --output-dir bmad/bmm/agents
```

---

### Story 2: Module Name Aliases

**ID**: COMPAT-002
**Points**: 5
**Priority**: P0 (Critical)

#### Acceptance Criteria

- ✅ Support both BMM and MAM module names
- ✅ Support both BMB and MAB module names
- ✅ Automatic resolution in agent loader
- ✅ Backward compatibility maintained
- ✅ Documentation updated

#### Implementation

**Update**: `lib/agents/loader.ts`

```typescript
// Add at top of file
const MODULE_ALIASES: Record<string, string> = {
  bmm: 'mam', // BMAD Method → MADACE Method
  bmb: 'mab', // BMAD Builder → MADACE Builder
  mam: 'mam', // MADACE Method (canonical)
  mab: 'mab', // MADACE Builder (canonical)
  cis: 'cis', // Creative Intelligence Suite (same in both)
};

/**
 * Resolve module name with alias support
 */
export function resolveModuleName(name: string): string {
  const normalized = name.toLowerCase().trim();
  return MODULE_ALIASES[normalized] || normalized;
}

// Update loadAgentsFromDirectory to scan multiple paths
export async function loadAgentsFromDirectory(dirPath: string): Promise<Agent[]> {
  const moduleName = path.basename(dirPath);
  const resolvedModule = resolveModuleName(moduleName);

  // Try both original and resolved paths
  const paths = [dirPath, dirPath.replace(moduleName, resolvedModule)];

  // ... rest of implementation
}
```

**Update**: `lib/config/manager.ts`

```typescript
// Add module resolution in config paths
export function getModulePath(module: string): string {
  const resolved = resolveModuleName(module);
  const paths = [
    path.join('madace', resolved), // MADACE format
    path.join('bmad', module), // BMAD format (original)
  ];

  for (const p of paths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // Default to MADACE format
  return path.join('madace', resolved);
}
```

---

### Story 3: Directory Structure Compatibility

**ID**: COMPAT-003
**Points**: 8
**Priority**: P1 (High)

#### Acceptance Criteria

- ✅ Support both `madace/` and `bmad/` root directories
- ✅ Agent loader scans both locations
- ✅ Workflow loader scans both locations
- ✅ Configuration manager checks both
- ✅ Priority: `madace/` first, `bmad/` fallback

#### Implementation

**Update**: `lib/agents/loader.ts`

```typescript
/**
 * Get all possible agent directories
 */
function getAgentDirectories(): string[] {
  return [
    // MADACE format (primary)
    path.join(process.cwd(), 'madace', 'mam', 'agents'),
    path.join(process.cwd(), 'madace', 'mab', 'agents'),
    path.join(process.cwd(), 'madace', 'cis', 'agents'),

    // BMAD format (compatibility)
    path.join(process.cwd(), 'bmad', 'bmm', 'agents'),
    path.join(process.cwd(), 'bmad', 'bmb', 'agents'),
    path.join(process.cwd(), 'bmad', 'cis', 'agents'),
  ];
}

/**
 * Load all agents from all supported directories
 */
export async function loadAllAgents(): Promise<Agent[]> {
  const directories = getAgentDirectories();
  const allAgents: Agent[] = [];

  for (const dir of directories) {
    try {
      if (fs.existsSync(dir)) {
        const agents = await defaultLoader.loadAgentsFromDirectory(dir);
        allAgents.push(...agents);
      }
    } catch (error) {
      // Log but don't fail - directory may not exist
      console.warn(`Could not load agents from ${dir}:`, error);
    }
  }

  return allAgents;
}
```

**Update**: `lib/workflows/loader.ts`

```typescript
/**
 * Get all possible workflow directories
 */
function getWorkflowDirectories(): string[] {
  return [
    // MADACE format (primary)
    path.join(process.cwd(), 'madace', 'mam', 'workflows'),
    path.join(process.cwd(), 'madace', 'mab', 'workflows'),
    path.join(process.cwd(), 'madace', 'cis', 'workflows'),
    path.join(process.cwd(), 'madace', 'core', 'workflows'),

    // BMAD format (compatibility)
    path.join(process.cwd(), 'bmad', 'bmm', 'workflows'),
    path.join(process.cwd(), 'bmad', 'bmb', 'workflows'),
    path.join(process.cwd(), 'bmad', 'cis', 'workflows'),
    path.join(process.cwd(), 'bmad', 'core', 'workflows'),
  ];
}

/**
 * Find workflow file in all supported directories
 */
export async function findWorkflow(name: string): Promise<string | null> {
  const directories = getWorkflowDirectories();
  const possibleNames = [
    `${name}.workflow.yaml`,
    `${name}.yaml`,
    name, // If full path provided
  ];

  for (const dir of directories) {
    for (const fileName of possibleNames) {
      const filePath = path.join(dir, fileName);
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }
  }

  return null;
}
```

---

## Phase 2: Enhanced Interoperability (Week 3-4)

### Story 4: Universal Agent Schema

**ID**: COMPAT-004
**Points**: 13
**Priority**: P1 (High)

#### Acceptance Criteria

- ✅ Define universal agent schema (TypeScript interface)
- ✅ Convert BMAD markdown to universal schema
- ✅ Convert MADACE YAML to universal schema
- ✅ Convert universal schema to BMAD markdown
- ✅ Convert universal schema to MADACE YAML
- ✅ Validate universal schema with Zod

#### Implementation

**Create**: `lib/interop/universal-agent.ts`

```typescript
import { z } from 'zod';

/**
 * Universal Agent Schema
 *
 * Intermediate representation that both BMAD and MADACE can consume
 */
export const UniversalAgentSchema = z.object({
  metadata: z.object({
    id: z.string(),
    name: z.string(),
    title: z.string(),
    icon: z.string().optional(),
    module: z.enum(['mam', 'mab', 'cis', 'bmm', 'bmb']),
    version: z.string(),
    source: z.enum(['madace', 'bmad']),
  }),

  persona: z.object({
    role: z.string(),
    identity: z.string(),
    communication_style: z.string(),
    principles: z.array(z.string()),
  }),

  capabilities: z.object({
    workflows: z.array(
      z.object({
        trigger: z.string(),
        action: z.string(),
        description: z.string(),
      })
    ),
    critical_actions: z.array(z.string()).optional(),
  }),

  config: z.object({
    load_always: z.array(z.string()).optional(),
    prompts: z.array(z.string()).optional(),
  }),
});

export type UniversalAgent = z.infer<typeof UniversalAgentSchema>;

/**
 * Convert BMAD markdown to universal agent
 */
export function fromBMADMarkdown(markdown: string): UniversalAgent {
  const parsed = parseMarkdownAgent(markdown);

  return {
    metadata: {
      id: `bmad/bmm/agents/${parsed.name.toLowerCase()}.md`,
      name: parsed.name,
      title: parsed.title || parsed.name,
      icon: parsed.icon,
      module: 'bmm',
      version: '1.0.0',
      source: 'bmad',
    },
    persona: {
      role: parsed.role,
      identity: parsed.identity,
      communication_style: parsed.communication_style || '',
      principles: parsed.principles || [],
    },
    capabilities: {
      workflows: parsed.workflows || [],
      critical_actions: parsed.critical_actions,
    },
    config: {
      load_always: parsed.load_always,
      prompts: parsed.prompts,
    },
  };
}

/**
 * Convert MADACE YAML to universal agent
 */
export function fromMADACEYAML(yamlContent: string): UniversalAgent {
  const agent = yaml.load(yamlContent) as any;

  return {
    metadata: {
      ...agent.agent.metadata,
      source: 'madace',
    },
    persona: agent.agent.persona,
    capabilities: {
      workflows: agent.agent.menu || [],
      critical_actions: agent.agent.critical_actions,
    },
    config: {
      load_always: agent.agent.load_always,
      prompts: agent.agent.prompts,
    },
  };
}

/**
 * Convert universal agent to BMAD markdown
 */
export function toBMADMarkdown(agent: UniversalAgent): string {
  // Implementation similar to generateMarkdownAgent
}

/**
 * Convert universal agent to MADACE YAML
 */
export function toMADACEYAML(agent: UniversalAgent): string {
  // Implementation similar to existing YAML generation
}
```

---

## Testing Strategy

### Unit Tests

**Create**: `__tests__/interop/agent-converter.test.ts`

```typescript
describe('Agent Converter', () => {
  describe('BMAD to MADACE', () => {
    it('should convert PM agent', async () => {
      const result = await bmadToMADACE('fixtures/bmad/pm.md');
      expect(result).toContain('agent:');
      expect(result).toContain('metadata:');
      expect(result).toContain('name: PM');
    });

    it('should preserve workflows', async () => {
      const result = await bmadToMADACE('fixtures/bmad/pm.md');
      const agent = yaml.load(result);
      expect(agent.agent.menu).toHaveLength(8);
    });
  });

  describe('MADACE to BMAD', () => {
    it('should convert PM agent', async () => {
      const result = await madaceToBMAD('madace/mam/agents/pm.agent.yaml');
      expect(result).toContain('# PM');
      expect(result).toContain('## Role');
    });
  });

  describe('Round-trip conversion', () => {
    it('should maintain semantic equivalence', async () => {
      const original = await fs.readFile('fixtures/bmad/pm.md', 'utf-8');
      const yaml = await bmadToMADACE('fixtures/bmad/pm.md');
      const converted = await madaceToBMAD(yaml);

      // Compare semantic content, not exact text
      expect(extractName(converted)).toBe(extractName(original));
      expect(extractWorkflows(converted)).toEqual(extractWorkflows(original));
    });
  });
});
```

### Integration Tests

**Create**: `__tests__/interop/compatibility.integration.test.ts`

```typescript
describe('BMAD-MADACE Compatibility', () => {
  it('should load BMAD agents in MADACE', async () => {
    // Place BMAD agents in bmad/bmm/agents/
    const agents = await loadAllAgents();
    const bmadAgents = agents.filter((a) => a.metadata.id.startsWith('bmad'));

    expect(bmadAgents.length).toBeGreaterThan(0);
  });

  it('should execute BMAD workflow in MADACE', async () => {
    // Convert BMAD workflow to YAML
    // Execute in MADACE workflow engine
    // Verify output
  });
});
```

---

## Migration Guide for Users

**Create**: `docs/MIGRATION-BMAD-TO-MADACE.md`

### For BMAD Users → MADACE

```bash
# Step 1: Install MADACE Method v3.0
git clone https://github.com/tekcin/MADACE-Method-v2.0
cd MADACE-Method-v2.0
npm install

# Step 2: Copy your BMAD project
cp -r ~/my-bmad-project/bmad ./bmad

# Step 3: Convert agents (optional - MADACE can read BMAD agents)
npm run madace convert-agents-batch \
  --from bmad \
  --input-dir bmad/bmm/agents \
  --output-dir madace/mam/agents

# Step 4: Start MADACE
npm run dev:collab

# Step 5: Access web UI
open http://localhost:3000
```

### For MADACE Users → BMAD

```bash
# Step 1: Export agents from MADACE database
npm run madace export-agents --output bmad/bmm/agents

# Step 2: Convert to BMAD format
npm run madace convert-agents-batch \
  --from madace \
  --input-dir madace/mam/agents \
  --output-dir bmad/bmm/agents

# Step 3: Install BMAD
npx bmad-method@alpha install

# Step 4: Copy converted agents to BMAD project
cp -r bmad/bmm/agents ~/.bmad/bmm/agents
```

---

## Documentation Updates

### Update ARCHITECTURE.md

Add new section:

```markdown
## 16. BMAD-MADACE Compatibility

MADACE Method v3.0 maintains compatibility with BMAD-METHOD through:

1. **Agent Format Converters**: md ↔ yaml conversion
2. **Module Aliases**: BMM/MAM, BMB/MAB interchangeable
3. **Directory Support**: Reads from both madace/ and bmad/
4. **Universal Schema**: Intermediate agent representation

See [BMAD-MADACE-COMPARISON.md](./docs/BMAD-MADACE-COMPARISON.md) for details.
```

### Update README.md

Add compatibility section:

```markdown
## BMAD Method Compatibility

MADACE Method v3.0 is compatible with BMAD-METHOD agents and workflows:

- ✅ Import BMAD agents (automatic conversion)
- ✅ Execute BMAD workflows
- ✅ Migration tools provided
- ✅ Shared C.O.R.E. philosophy

See [Migration Guide](./docs/MIGRATION-BMAD-TO-MADACE.md) for details.
```

---

## Success Criteria

### Phase 1 Complete When:

- ✅ Agent converter working (md ↔ yaml)
- ✅ Module aliases functional
- ✅ Directory compatibility implemented
- ✅ 90%+ test coverage
- ✅ Documentation complete

### Phase 2 Complete When:

- ✅ Universal agent schema implemented
- ✅ Round-trip conversion 95%+ semantic fidelity
- ✅ Migration guides published
- ✅ Integration tests passing

---

## Timeline

| Week       | Focus                        | Deliverables                                  |
| ---------- | ---------------------------- | --------------------------------------------- |
| **Week 1** | Agent converter              | COMPAT-001 complete, CLI commands working     |
| **Week 2** | Module aliases + directories | COMPAT-002, COMPAT-003 complete               |
| **Week 3** | Universal schema             | COMPAT-004 complete, full interop layer       |
| **Week 4** | Testing + docs               | All tests passing, migration guides published |

---

## Next Steps

1. **Approve this plan** - Review with BMAD-METHOD team
2. **Create GitHub issues** - One per story (COMPAT-001 to COMPAT-004)
3. **Start implementation** - Begin with COMPAT-001 (agent converter)
4. **Weekly sync** - Coordinate with BMAD team on format changes

---

**Document Owner**: MADACE Core Team
**Approval Required**: BMAD-METHOD Team
**Implementation Start**: 2025-11-05
**Target Completion**: 2025-12-03
