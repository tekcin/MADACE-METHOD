# BMAD-METHOD vs MADACE Method v3.0 - Compatibility Analysis

**Date**: 2025-11-05
**Last Updated**: 2025-11-05
**Status**: Architectural Alignment Proposal
**Purpose**: Ensure compatibility between BMAD-METHOD core and MADACE Method v3.0 while maintaining distinct implementations

---

## ⚠️ IMPORTANT: BMAD Structure Clarifications

**Based on analysis of BMAD-METHOD repository (2025-11-05):**

1. **Agents**: Markdown files (`.md`) in `bmad/bmm/agents/`
2. **Workflows**: YAML files (`workflow.yaml`) in nested directories under `bmad/bmm/workflows/`
   - Example: `bmad/bmm/workflows/2-plan-workflows/prd/workflow.yaml`
   - **NOT** flat files like `plan-project.md` ❌
3. **Workflow Organization**: By phase subdirectories (1-analysis, 2-plan-workflows, 3-solutioning, 4-implementation)
4. **Variable Syntax**: BMAD uses `{variable}`, MADACE uses `{{variable}}`

**Do NOT reference**:

- ❌ `bmad/bmm/workflows/plan-project.md` (does not exist)
- ❌ Any raw GitHub URLs to `.md` workflow files (workflows are YAML)

**Valid references**:

- ✅ `bmad/bmm/workflows/2-plan-workflows/prd/workflow.yaml`
- ✅ `bmad/bmm/agents/*.md` (markdown agent files)
- ✅ GitHub tree URLs (not raw file URLs)

---

## Executive Summary

**BMAD-METHOD** and **MADACE Method v3.0** are **distinct implementations** of the same conceptual framework (C.O.R.E. philosophy). They are **NOT the same codebase** but share common methodology and should maintain compatibility for:

1. **Agent interoperability** - Agents defined in one system should be usable in the other
2. **Workflow portability** - Workflows should be transferable between systems
3. **Conceptual alignment** - Same terminology, phases, and methodology
4. **Migration paths** - Users should be able to move between systems

---

## Core Comparison Matrix

| Aspect                | BMAD-METHOD (v6 Alpha)                                     | MADACE Method v3.0 (Beta)                       | Compatibility Status   |
| --------------------- | ---------------------------------------------------------- | ----------------------------------------------- | ---------------------- |
| **Philosophy**        | C.O.R.E. (Collaboration, Optimization, Reflection, Engine) | C.O.R.E. (Same)                                 | ✅ **IDENTICAL**       |
| **Primary Interface** | CLI (Claude Code, Cursor, Windsurf, VS Code)               | Web UI + CLI (Browser + Terminal)               | ⚠️ **DIFFERENT**       |
| **Technology Stack**  | Node.js 20+ / JavaScript                                   | Next.js 15 / TypeScript / React 19              | ⚠️ **DIFFERENT**       |
| **Agent Format**      | Markdown (.md files)                                       | YAML (.agent.yaml files)                        | ❌ **INCOMPATIBLE**    |
| **Workflow Format**   | YAML (workflow.yaml)                                       | YAML (.workflow.yaml files)                     | ✅ **COMPATIBLE**      |
| **Data Storage**      | File-based (markdown files)                                | Hybrid (Database + Files)                       | ⚠️ **DIFFERENT**       |
| **Module Names**      | BMM (BMad Method), BMB (Builder), CIS                      | MAM (MADACE Method), MAB (Builder), CIS         | ⚠️ **SIMILAR**         |
| **Installation**      | `npx bmad-method@alpha install`                            | Docker / Web deployment                         | ⚠️ **DIFFERENT**       |
| **Agent Count**       | 12+ specialized agents                                     | 5 core agents (PM, Analyst, Architect, Dev, SM) | ⚠️ **DIFFERENT**       |
| **Workflow Phases**   | 4 phases (Analysis, Planning, Solutioning, Implementation) | Same 4 phases                                   | ✅ **IDENTICAL**       |
| **Scale Adaptation**  | Quick Flow, BMad Method, Enterprise Method                 | Level 0-4 complexity routing                    | ⚠️ **SIMILAR CONCEPT** |
| **Multi-Agent Mode**  | "Party Mode"                                               | Not explicitly implemented                      | ❌ **MISSING**         |

---

## Architecture Comparison

### BMAD-METHOD Architecture (v6)

```
User → IDE (Claude/Cursor/etc.)
         ↓
    BMad-CORE Engine
         ↓
   ┌─────┴─────┐
   │           │
   ▼           ▼
File System  Config
 (agents)   (.bmad/)
   │
   ▼
Markdown Agents → Workflows → Templates
```

**Key Characteristics:**

- Pure CLI-based
- File-centric architecture
- Markdown for agent definitions
- Multi-IDE support
- Installation via npx
- Update-safe customization

### MADACE Method v3.0 Architecture

```
User → Browser (Web UI) OR Terminal (CLI)
           ↓                      ↓
      Next.js App Router    Built-in CLI
           ↓                      ↓
      API Routes (REST)    Business Logic
           ↓                      ↓
      ┌────┴────────────────────┘
      ▼
Business Logic Layer (TypeScript)
      ↓
  ┌───┴───────────┐
  │               │
  ▼               ▼
Prisma ORM    File System
  │               │
  ▼               ▼
PostgreSQL    YAML Files
/SQLite      (agents/workflows)
```

**Key Characteristics:**

- Full-stack web application
- Dual interface (Web + CLI)
- Database-backed state
- YAML for agent/workflow definitions
- Docker deployment
- Real-time collaboration features

---

## Critical Incompatibilities

### 1. Agent File Format ❌ **CRITICAL**

**BMAD-METHOD** (Agents are in Markdown):

```markdown
# PM.md

## Role

Product Manager and Strategic Planning Facilitator

## Identity

I'm your Product Manager...

## Workflows

- \*plan-project - Scale-adaptive project planning
- \*assess-scale - Determine project complexity
```

**BMAD-METHOD** (Workflows are in YAML):

```yaml
# bmad/bmm/workflows/2-plan-workflows/prd/workflow.yaml
name: prd
description: 'Unified PRD workflow for project levels 2-4'
author: BMad
config_source: '{project-root}/bmad/bmm/config.yaml'
project_name: '{config_source}:project_name'
# ... (structured YAML with variable interpolation)
```

**MADACE Method v3.0**:

```yaml
agent:
  metadata:
    id: madace/mam/agents/pm.md
    name: PM
    title: Product Manager - Scale-Adaptive Planning Expert
    icon: 📋
    module: mam
    version: 1.0.0

  persona:
    role: Product Manager and Strategic Planning Facilitator
    identity: |
      I'm your Product Manager...

  menu:
    - trigger: '*plan-project'
      action: 'workflow:plan-project'
      description: Scale-adaptive project planning
```

**Impact**: Agents are NOT directly portable between systems

**Recommendation**: Create bidirectional converters (md ↔ yaml)

### 2. Module Naming ⚠️ **MODERATE**

- BMAD: **BMM** (BMad Method), **BMB** (BMad Builder)
- MADACE: **MAM** (MADACE Method), **MAB** (MADACE Builder)

**Impact**: File paths and references differ

**Recommendation**: Support both naming conventions via aliases

### 3. Technology Stack ⚠️ **MODERATE**

- BMAD: Pure Node.js CLI framework
- MADACE: Next.js full-stack web application

**Impact**: Different deployment and runtime requirements

**Recommendation**: Keep separate but ensure methodology compatibility

---

## Compatibility Opportunities

### ✅ What ALREADY Works

1. **C.O.R.E. Philosophy** - Identical conceptual framework
2. **Workflow Phases** - Same 4-phase methodology
3. **Scale Adaptation** - Both systems adapt to project complexity
4. **Agent Roles** - Similar agent personas (PM, Analyst, Architect, Dev, etc.)
5. **Terminology** - Consistent use of epics, stories, workflows

### 🔧 What Can Be Made Compatible

1. **Agent Definitions** - Create converters for md ↔ yaml formats
2. **Workflow Portability** - Standardize workflow format (prefer YAML)
3. **Configuration** - Support both .bmad/ and madace/ directory structures
4. **CLI Commands** - Align command-line interfaces
5. **Module Aliases** - Support BMM/MAM and BMB/MAB interchangeably

---

## Architectural Recommendations

### Phase 1: Immediate Compatibility Layer (Week 1-2)

#### 1.1 Agent Format Converter

**Create**: `lib/interop/agent-converter.ts`

```typescript
/**
 * Convert BMAD markdown agents to MADACE YAML format
 */
export async function bma dToMADACE(markdownPath: string): Promise<string> {
  // Parse markdown agent file
  // Extract sections: Role, Identity, Workflows, etc.
  // Generate YAML in MADACE format
  // Return YAML string or write to file
}

/**
 * Convert MADACE YAML agents to BMAD markdown format
 */
export async function madaceToBMAD(yamlPath: string): Promise<string> {
  // Parse YAML agent file
  // Generate markdown in BMAD format
  // Return markdown string or write to file
}
```

**CLI Commands**:

```bash
npm run madace convert-agent --from bmad --input agents/pm.md --output madace/mam/agents/pm.agent.yaml
npm run madace convert-agent --from madace --input madace/mam/agents/pm.agent.yaml --output agents/pm.md
```

#### 1.2 Module Alias Support

**Update**: `lib/agents/loader.ts`

```typescript
// Support both MAM and BMM naming
const moduleAliases = {
  bmm: 'mam', // BMAD Method → MADACE Method
  bmb: 'mab', // BMAD Builder → MADACE Builder
  mam: 'mam', // MADACE Method (canonical)
  mab: 'mab', // MADACE Builder (canonical)
};

export function resolveModuleName(name: string): string {
  return moduleAliases[name.toLowerCase()] || name;
}
```

#### 1.3 Directory Structure Compatibility

**Support both**:

```
madace/              # MADACE format (primary)
  mam/
    agents/
    workflows/
  mab/
  cis/
  core/

bmad/                # BMAD format (secondary, imported)
  bmm/
    agents/
    workflows/
  bmb/
  cis/
  core/
```

**Agent loader should scan both**:

```typescript
const agentPaths = [
  'madace/mam/agents', // MADACE primary
  'bmad/bmm/agents', // BMAD compatibility
];
```

### Phase 2: Enhanced Interoperability (Week 3-4)

#### 2.1 Unified Agent Schema

**Create**: `lib/interop/universal-agent.ts`

```typescript
/**
 * Universal agent format that both systems can consume
 *
 * This is an intermediate representation that can be:
 * - Exported to MADACE YAML
 * - Exported to BMAD Markdown
 * - Stored in database (MADACE)
 * - Used directly in runtime
 */
export interface UniversalAgent {
  metadata: {
    id: string;
    name: string;
    title: string;
    icon?: string;
    module: 'mam' | 'mab' | 'cis' | 'bmm' | 'bmb'; // Support both
    version: string;
    source: 'madace' | 'bmad'; // Track origin
  };

  persona: {
    role: string;
    identity: string;
    communication_style: string;
    principles: string[];
  };

  capabilities: {
    workflows: Array<{
      trigger: string;
      action: string;
      description: string;
    }>;
    critical_actions?: string[];
  };

  config: {
    load_always?: string[];
    prompts?: string[];
  };
}
```

**Converters**:

```typescript
export function fromBMADMarkdown(markdown: string): UniversalAgent;
export function fromMADACEYAML(yaml: string): UniversalAgent;
export function toBMADMarkdown(agent: UniversalAgent): string;
export function toMADACEYAML(agent: UniversalAgent): string;
```

#### 2.2 Workflow Format Standardization

**GOOD NEWS**: Both systems already use YAML for workflows!

**BMAD Structure** (Verified 2025-11-05):

- Workflows organized in phase directories: `bmad/bmm/workflows/1-analysis/`, `2-plan-workflows/`, etc.
- Each workflow subdirectory contains `workflow.yaml`
- Example: `bmad/bmm/workflows/2-plan-workflows/prd/workflow.yaml`
- YAML format with variable interpolation: `{project-root}`, `{config_source}`, etc.

**MADACE Structure**:

- Workflows in flat directory: `madace/mam/workflows/*.workflow.yaml`
- Similar YAML format with Handlebars-style variables: `{{project_name}}`

**Recommendation**: MADACE should adopt

```yaml
workflow:
  name: plan-project
  description: Scale-adaptive project planning
  agent: pm
  phase: 2 # Planning phase

  steps:
    - name: assess-complexity
      action: workflow:assess-scale

    - name: create-prd
      action: template:prd-template
      output: docs/PRD.md
```

**Rationale**:

- ✅ YAML is already used by both systems
- ✅ Supports complex workflows with conditions
- ⚠️ Variable syntax differs (BMAD: `{var}`, MADACE: `{{var}}`)
- **Action**: Create workflow converter for variable syntax differences

#### 2.3 CLI Command Alignment

**BMAD Commands** (assumed):

```bash
bmad agent pm
bmad workflow plan-project
bmad status
```

**MADACE Commands** (current):

```bash
npm run madace agents list
npm run madace workflows run plan-project
npm run madace state show
```

**Proposed Unified**:

```bash
# Both systems should support:
madace agent pm           # Or: bmad agent pm
madace workflow run plan-project
madace status

# With aliases:
mam agent pm              # MADACE shorthand
bmm agent pm              # BMAD shorthand
```

### Phase 3: Deep Integration (Month 2)

#### 3.1 BMAD Agent Marketplace Integration

If BMAD develops an agent marketplace, MADACE should:

1. **Import from marketplace**:

   ```bash
   madace import-agent --source bmad-marketplace --id pm-enterprise
   ```

2. **Export to marketplace**:

   ```bash
   madace export-agent --id custom-pm --target bmad-marketplace
   ```

3. **Format conversion**: Automatic during import/export

#### 3.2 Shared Agent Registry

**Proposal**: Maintain a shared registry of community agents

```json
{
  "agents": [
    {
      "id": "pm-core-v1",
      "name": "Product Manager (Core)",
      "compatible_with": ["bmad-v6", "madace-v3"],
      "formats": {
        "bmad": "https://registry/agents/pm-core-v1.md",
        "madace": "https://registry/agents/pm-core-v1.yaml"
      }
    }
  ]
}
```

#### 3.3 Migration Tools

**BMAD → MADACE**:

```bash
madace migrate --from bmad --source ~/bmad-project --target ~/madace-project
```

**Features**:

- Convert all agents (md → yaml)
- Convert workflows
- Preserve configuration
- Import to database (MADACE only)
- Generate migration report

**MADACE → BMAD**:

```bash
bmad import --from madace --source ~/madace-project --target ~/bmad-project
```

**Features**:

- Export agents from database
- Convert to markdown
- Extract workflows to BMAD format
- Preserve configuration

---

## Compatibility Testing Strategy

### Test Suite 1: Agent Compatibility

```typescript
describe('Agent Interoperability', () => {
  it('should convert BMAD agent to MADACE format', async () => {
    const bmadAgent = await readFile('fixtures/bmad/pm.md');
    const madaceYAML = await bmadToMADACE(bmadAgent);
    const parsed = yaml.load(madaceYAML);

    expect(parsed.agent.metadata.name).toBe('PM');
    expect(parsed.agent.persona.role).toContain('Product Manager');
  });

  it('should convert MADACE agent to BMAD format', async () => {
    const madaceAgent = await loadAgent('madace/mam/agents/pm.agent.yaml');
    const bmadMarkdown = await madaceToBMAD(madaceAgent);

    expect(bmadMarkdown).toContain('# PM');
    expect(bmadMarkdown).toContain('## Role');
  });

  it('should maintain agent functionality after round-trip conversion', async () => {
    // BMAD → MADACE → BMAD
    const original = await readFile('fixtures/bmad/pm.md');
    const madaceYAML = await bmadToMADACE(original);
    const converted = await madaceToBMAD(madaceYAML);

    // Semantic comparison (not exact text match)
    expect(extractRole(converted)).toBe(extractRole(original));
    expect(extractWorkflows(converted)).toEqual(extractWorkflows(original));
  });
});
```

### Test Suite 2: Workflow Portability

```typescript
describe('Workflow Portability', () => {
  it('should execute BMAD workflow in MADACE', async () => {
    // Import BMAD workflow
    const bmadWorkflow = await importBMADWorkflow('bmad/workflows/plan-project');

    // Execute in MADACE
    const result = await executeWorkflow(bmadWorkflow);

    expect(result.success).toBe(true);
    expect(result.output).toMatch(/PRD-.*\.md/);
  });

  it('should execute MADACE workflow in BMAD-compatible mode', async () => {
    // Export MADACE workflow to BMAD format
    const madaceWorkflow = await loadWorkflow('madace/mam/workflows/plan-project.workflow.yaml');
    const bmadFormat = await exportToBMADFormat(madaceWorkflow);

    // Verify BMAD compatibility
    expect(bmadFormat).toMatchSchema(BMADWorkflowSchema);
  });
});
```

---

## Implementation Priority

### 🔴 Critical (P0) - Must Have for Compatibility

1. **Agent Format Converter** (md ↔ yaml)
   - Points: 13
   - Timeline: Week 1
   - Blocker for interoperability

2. **Module Name Aliases** (BMM ↔ MAM, BMB ↔ MAB)
   - Points: 5
   - Timeline: Week 1
   - Essential for file path resolution

3. **Universal Agent Schema**
   - Points: 13
   - Timeline: Week 2
   - Foundation for all conversions

### 🟡 Important (P1) - Should Have

4. **Workflow Format Standardization** (recommend YAML to BMAD)
   - Points: 13
   - Timeline: Week 3
   - Improves long-term compatibility

5. **CLI Command Alignment**
   - Points: 8
   - Timeline: Week 3
   - User experience consistency

6. **Directory Structure Compatibility**
   - Points: 5
   - Timeline: Week 2
   - Allows importing BMAD projects

### 🟢 Nice to Have (P2)

7. **Migration Tools** (BMAD ↔ MADACE)
   - Points: 21
   - Timeline: Month 2
   - Enables user migration

8. **Shared Agent Registry**
   - Points: 21
   - Timeline: Month 2-3
   - Community contribution

---

## Risk Assessment

### Technical Risks

| Risk                                            | Impact | Probability | Mitigation                                      |
| ----------------------------------------------- | ------ | ----------- | ----------------------------------------------- |
| **Agent conversion loses fidelity**             | High   | Medium      | Comprehensive test suite, round-trip validation |
| **BMAD changes format unexpectedly**            | High   | Low         | Version detection, format validation            |
| **Performance overhead of dual format support** | Medium | Medium      | Caching, lazy loading                           |
| **Community confusion between systems**         | High   | Medium      | Clear documentation, migration guides           |

### Strategic Risks

| Risk                             | Impact | Probability | Mitigation                              |
| -------------------------------- | ------ | ----------- | --------------------------------------- |
| **Systems diverge over time**    | High   | High        | Regular sync meetings, shared roadmap   |
| **Duplicate effort on features** | Medium | High        | Coordinate feature development          |
| **Brand confusion**              | Medium | Medium      | Clear positioning: BMAD=CLI, MADACE=Web |

---

## Recommendations Summary

### ✅ DO (Immediate Actions)

1. **Create agent format converters** (md ↔ yaml)
2. **Support both module naming conventions** (BMM/MAM, BMB/MAB)
3. **Implement universal agent schema** as intermediate format
4. **Add compatibility tests** to CI/CD pipeline
5. **Document migration paths** for users

### ⚠️ CONSIDER (Medium-term)

1. **Standardize on YAML** for workflows (both systems)
2. **Align CLI commands** for consistent UX
3. **Create shared agent registry** for community
4. **Build migration tools** (automated BMAD ↔ MADACE)
5. **Co-develop features** where possible

### ❌ DON'T (Avoid)

1. **Don't merge codebases** - they serve different use cases
2. **Don't force identical implementations** - embrace different strengths
3. **Don't break existing users** - maintain backward compatibility
4. **Don't ignore version differences** - track compatibility matrix
5. **Don't sacrifice MADACE features** for BMAD parity

---

## Success Metrics

### Compatibility Goals (6 months)

- ✅ **90%+ agent portability** - Agents work in both systems with minimal changes
- ✅ **100% workflow portability** - Workflows execute identically in both
- ✅ **Zero migration friction** - Users can switch systems seamlessly
- ✅ **Shared community** - Agents contributed work in both systems

### Technical Goals

- ✅ **Round-trip conversion fidelity**: 95%+ semantic preservation
- ✅ **Automated conversion**: < 5 seconds per agent
- ✅ **Test coverage**: 90%+ for interop layer
- ✅ **Documentation**: Complete migration guides

---

## Conclusion

**BMAD-METHOD** and **MADACE Method v3.0** are **NOT the same codebase** and should remain distinct:

- **BMAD** = Pure CLI framework (like Git) - for developers who live in terminal
- **MADACE** = Web-first platform (like GitHub) - for teams who want visual UX

However, they **MUST be compatible** at the methodology level:

- ✅ Same C.O.R.E. philosophy
- ✅ Same agent concepts (different formats)
- ✅ Same workflow phases
- ✅ **Workflows already compatible** (both use YAML)
- ⚠️ Agent definitions need conversion (markdown ↔ YAML)
- ⚠️ Variable syntax differs slightly

**Primary Action**: Implement Phase 1 compatibility layer (agent converters + module aliases) within 2 weeks.

**Long-term Vision**: BMAD and MADACE as complementary tools in same ecosystem - users choose based on interface preference, not methodology lock-in.

---

**Document Owner**: MADACE Core Team
**Next Review**: 2025-11-19 (2 weeks)
**Status**: Proposal - Awaiting Implementation
