# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Quick Command Reference

### Essential Development Commands

```bash
# Code Quality (Run before commits)
npm run lint:fix           # Auto-fix ESLint issues
npm run format:fix         # Auto-format with Prettier

# Testing
npm test                   # Run alpha test suite (test-alpha.mjs)
                          # 12 tests covering agents, workflows, templates

# Build & Distribution
npm run bundle             # Generate web bundles (ChatGPT/Gemini)
npm run rebundle           # Regenerate existing bundles
npm run validate:bundles   # Validate bundle integrity
npm run flatten            # Flatten codebase for analysis

# Setup
npm install               # Install dependencies + setup Husky hooks
```

### Git Workflow

Pre-commit hooks automatically run `lint:fix` and `format:fix` on staged files.

**Conventional Commits Required:**

```bash
feat(scope):      # New features
fix(scope):       # Bug fixes
docs(scope):      # Documentation
refactor(scope):  # Code refactoring
test(scope):      # Tests
chore(scope):     # Maintenance
```

**Examples:**

```bash
git commit -m "feat(mam): add story state validation"
git commit -m "fix(core): resolve path handling on Windows"
git commit -m "docs(readme): update installation guide"
```

---

## Project Overview

**MADACE-METHOD** (Methodology for AI-Driven Agile Collaboration Engine) is a
universal human-AI collaboration framework that orchestrates specialized AI
agents through guided workflows.

**Core Philosophy:** Human amplification, not replacement. AI agents facilitate
thinking rather than do the work.

**Key Innovation:** Natural language configuration (YAML/Markdown/XML only - no
executable code).

---

## Architecture: The Big Picture

### Core System Flow

```
User Command → CLI (madace.js)
    ↓
Agent Runtime (agent-runtime.js)
    ↓
├─ Load Agent (agent-loader.js) ──→ Parse YAML + Validate Schema
├─ Build Context (config-manager.js) ──→ Merge Variables
├─ Execute Critical Actions ──→ Validate Installation
└─ Execute Command
    ↓
Workflow Engine (workflow-engine.js)
    ↓
├─ Load Workflow YAML
├─ Execute Steps Sequentially
└─ For Each Step:
    ├─ Template Engine (template-engine.js) ──→ Render with Variables
    ├─ State Machine (state-machine.js) ──→ Update Status Files
    └─ Manifest Manager (manifest-manager.js) ──→ Track Components
```

### Critical Component Relationships

**1. Context Flow Across Layers**

The execution context is built once in `agent-runtime.js` and flows through:

- Workflow Engine → receives full agent context
- Template Engine → merges workflow + agent context
- Sub-workflows → inherit parent context + add their own

**Key Insight:** Variables defined at agent load (`{user_name}`,
`{project_name}`) are available in templates nested 3+ levels deep in
sub-workflows.

**2. State Machine Integration Points**

`state-machine.js` is NOT standalone - it integrates with:

- **Workflow Engine**: Workflows call `todoToInProgress()`, `inProgressToDone()`
- **Config Manager**: Paths resolved via `output_folder` config
- **Template Engine**: Status file uses mustache `{{variable}}` pattern

**Key Insight:** Never directly edit `mam-workflow-status.md`. Always use state
transition methods to ensure atomic updates and validation.

**3. Template Variable Resolution Priority**

Templates support 5 patterns, resolved in this order:

1. `{variable}` - Single brace (workflow.yaml default)
2. `{{variable}}` - Mustache (Markdown templates)
3. `${variable}` - Dollar brace (code contexts)
4. `%VARIABLE%` - Percent (Windows)
5. `$variable` - Dollar (shell)

**Key Insight:** Use `{variable}` in `workflow.yaml`, but `{{variable}}` in
`.md` template files.

**4. Agent-Workflow Binding**

Agents (`*.agent.yaml`) define menu items that trigger workflows:

```yaml
menu:
  - trigger: '*create-story'
    action: 'workflow:create-story'
```

The workflow engine resolves `create-story` by:

1. Checking manifest (`workflow-manifest.csv`)
2. Loading from `modules/{module}/workflows/create-story/workflow.yaml`
3. Executing with agent's execution context

**Key Insight:** Menu actions can be `workflow:<name>`, `elicit:<prompt>`,
`guide:<text>`, or custom strings.

---

## Module System Architecture

### Module Structure (All Install to `madace/`)

```
modules/{module-name}/
├── _module-installer/           # Installation logic
│   ├── install-menu-config.yaml # Interactive Q&A
│   ├── installer.js             # Installation script
│   └── platform-specifics/      # IDE-specific features
├── agents/
│   └── *.agent.yaml             # Agent definitions
└── workflows/
    └── {workflow-name}/
        ├── workflow.yaml        # Workflow definition
        ├── templates/           # Output templates
        └── README.md
```

### Three Core Modules

**1. Core (`modules/core/`)** - Always installed

- MADACE Master orchestrator
- Universal agent/workflow system

**2. MAM (`modules/mam/`)** - Agile Development

- 5 Agents: PM, Analyst, Architect, SM (Scrum Master), DEV
- Scale-Adaptive Planning: Routes Level 0-4 based on complexity
- Story State Machine: BACKLOG → TODO → IN PROGRESS → DONE
- 17 workflows including `plan-project`, `create-story`, `dev-story`

**3. MAB (`modules/mab/`)** - Agent/Workflow Builder

- Builder agent for creating custom agents/workflows/modules

**4. CIS (`modules/cis/`)** - Creative Intelligence

- Creativity agent with brainstorming workflows (SCAMPER, Six Hats, etc.)

### Cross-Module References

Modules can invoke each other's workflows:

- MAM's `brainstorm` workflow uses CIS workflows
- Custom modules can use MAM's state machine
- All modules use Core's template engine

---

## Critical Implementation Patterns

### 1. Cross-Platform Path Handling

**Always use:**

```javascript
import path from 'path';

const filePath = path.join(projectRoot, 'docs', 'story.md'); // ✅
const resolved = path.resolve(projectRoot, relativePath); // ✅
```

**Never use:**

```javascript
const bad = projectRoot + '/docs/story.md'; // ❌ Breaks on Windows
const worse = `${projectRoot}\\docs\\story.md`; // ❌ Breaks on Unix
```

All 8 core scripts follow this pattern. Check `config-manager.js` for reference
implementation.

### 2. YAML Schema Validation (Agent Files)

`agent-loader.js` enforces strict schema:

```yaml
agent:
  metadata: # Required
    id: string # Required - unique identifier
    name: string # Required - short name
    title: string # Required - full title
    icon: string # Optional - emoji
  persona: # Required
    role: string # Required
    identity: string # Required
  critical_actions: # Optional - array of actions
  menu: # Optional - array of menu items
```

Missing required fields throw validation errors. See `agent-loader.js:76-94` for
validation logic.

### 3. Workflow Step Types

`workflow-engine.js` supports these action types:

- `elicit` - Ask user for input
- `reflect` - Prompt reflection
- `guide` - Provide guidance
- `template` - Render template file
- `validate` - Apply validation rules
- `sub-workflow` - Execute nested workflow

**Backward Compatibility:** Both `action:` and `type:` fields are supported.

### 4. State Machine Transition Rules

`state-machine.js` enforces these rules:

- **Only ONE story in TODO** at any time
- **Only ONE story in IN PROGRESS** at any time
- Transitions must be atomic: BACKLOG → TODO → IN PROGRESS → DONE
- No skipping states (e.g., BACKLOG → DONE is invalid)

Violations throw errors. See `state-machine.js:validate()` method.

---

## Common Development Scenarios

### Adding a New Agent

**Files to modify:**

1. Create `modules/{module}/agents/{name}.agent.yaml`
2. Add entry to `madace/_cfg/agent-manifest.csv` (via installer)
3. Test: `npm test` should load and validate it

**Key code locations:**

- Validation: `agent-loader.js:76-94`
- Registration: `manifest-manager.js:addAgent()`

### Adding a New Workflow Step Type

**Files to modify:**

1. Add case in `workflow-engine.js` → `_executeStepAction()` (around line 150)
2. Update workflow validation if needed
3. Add example in module's workflow

**Example:**

```javascript
case 'api-call':
  result.type = 'api_call';
  result.endpoint = step.endpoint;
  await makeApiCall(step);
  break;
```

### Modifying State Machine Behavior

**Files to modify:**

1. `state-machine.js` - Update transition methods
2. `state-machine.js` - Update `validate()` rules
3. Test with `modules/mam/workflows/*/workflow.yaml` files

**Critical:** Always maintain atomicity - use temp files if needed.

### Adding a New Template Variable Pattern

**Files to modify:**

1. `template-engine.js` - Add pattern to `patterns` object (line ~30)
2. Update priority in `render()` method
3. Document in ARCHITECTURE.md

---

## Key Configuration Files

### Core Configuration (`madace/core/config.yaml`)

```yaml
project_name: string # Required - project name
output_folder: string # Required - where outputs go
user_name: string # Required - how agents address you
communication_language: string # Required - UI language (e.g., "English")
```

Auto-detected locations (in order):

1. `./madace/core/config.yaml`
2. `../madace/core/config.yaml`
3. `$MADACE_CONFIG` environment variable
4. `~/.madace/config.yaml`

See `config-manager.js:loadConfig()` for resolution logic.

### Manifest Files (CSV Format)

**Agent Manifest** (`madace/_cfg/agent-manifest.csv`):

```csv
agent_id,name,module,type,file_path,installed_at
```

**Workflow Manifest** (`madace/_cfg/workflow-manifest.csv`):

```csv
workflow_id,name,module,workflow_path,installed_at
```

Managed by `manifest-manager.js` - never edit manually.

---

## Testing Strategy

### Current Test Suite (`test-alpha.mjs`)

**12 tests covering:**

- Agent loading (master, PM, multiple agents)
- Template engine (variable substitution, path variables)
- Workflow engine (load workflow)
- Module validation (CIS, MAB agents exist)
- File existence (templates, build tools)
- State machine module loading

**Run with:** `npm test`

**Current status:** 100% pass rate (12/12 tests)

### Adding New Tests

Add test cases to `test-alpha.mjs`:

```javascript
try {
  // Your test code
  logTest('Test Name', condition === expected);
} catch (error) {
  logTest('Test Name', false, error);
}
```

---

## Scale-Adaptive Planning (MAM Key Feature)

Projects route through different workflows based on complexity:

- **Level 0**: 1 story → Quick tech-spec
- **Level 1**: 2-10 stories → Tech-spec + Epic
- **Level 2**: 5-15 stories → Focused PRD
- **Level 3**: 12-40 stories → Full PRD + Solutioning phase
- **Level 4**: 40+ stories → Enterprise PRD + Architecture

**Routing Logic:**

1. PM agent runs `assess-scale` workflow
2. Asks user questions about complexity
3. Detects project type (web, mobile, backend, game)
4. Routes to appropriate sub-workflow

See `modules/mam/workflows/plan-project/workflow.yaml` for router logic.

---

## Story State Machine (MAM Key Feature)

### Four States

```
BACKLOG (ordered list)
    ↓
TODO (single story - Draft status)
    ↓
IN PROGRESS (single story - Ready status)
    ↓
DONE (completed - Done status + date + points)
```

### Transitions

- **BACKLOG → TODO**: `sm create-story` workflow
- **TODO → IN PROGRESS**: `sm story-ready` workflow (auto-moves next BACKLOG →
  TODO)
- **IN PROGRESS → DONE**: `sm story-approved` workflow

### Critical Rule

**Single source of truth:** `{output_folder}/mam-workflow-status.md`

Agents NEVER search for stories. They ALWAYS read the exact story from the
status file sections.

See `state-machine.js` for implementation.

---

## Common Pitfalls to Avoid

### 1. Path Handling

❌ Hardcoded slashes: `'path/to/file'` or `'path\\to\\file'` ✅ Use
`path.join()`: `path.join(base, 'to', 'file')`

### 2. State Machine

❌ Multiple stories in TODO/IN PROGRESS simultaneously ✅ Only ONE story per
state (enforced by validation)

❌ Manually editing `mam-workflow-status.md` ✅ Use state transition methods in
workflows

### 3. Template Variables

❌ Using `{variable}` in `.md` templates ✅ Use `{{variable}}` (mustache) in
Markdown templates

❌ Using `{{variable}}` in `workflow.yaml` ✅ Use `{variable}` (single brace) in
YAML files

### 4. Agent/Workflow Registration

❌ Creating agent file without manifest entry ✅ Use installer to register in
`agent-manifest.csv`

❌ Manual CSV editing ✅ Use `manifest-manager.js` methods

---

## Important Acronyms

- **MADACE**: Methodology for AI-Driven Agile Collaboration Engine
- **MAM**: MADACE Method (Agile Development Module)
- **MAB**: MADACE Builder (Agent/Workflow Creation Module)
- **CIS**: Creative Intelligence Suite (Brainstorming Module)
- **JIT**: Just-In-Time (per-epic tech specs created during implementation)
- **ADR**: Architecture Decision Record

---

## Current Status: v1.0-alpha.2

**What's Functional:**

- ✅ Core engine (8 core scripts)
- ✅ MAM, MAB, CIS modules complete
- ✅ CLI basics (`madace.js`)
- ✅ Web bundling (experimental)
- ✅ 100% test pass rate (12/12)

**In Development:**

- 🔧 Advanced CLI commands (`install`, `status`, `list`, `uninstall`)
- 🔧 Comprehensive test infrastructure

**See Full Roadmap:** `PRD-MADACE-CORE.md` (74 stories across 9 epics)

---

## Technology Stack

**Runtime:** Node.js v20+ (ES modules, no TypeScript)

**Key Dependencies:**

- `js-yaml` - YAML parsing
- `commander` - CLI framework
- `inquirer` - Interactive prompts
- `fs-extra` - File operations
- `chalk`, `boxen`, `ora` - CLI UI
- `csv-parse`, `csv-stringify` - Manifest operations

**Code Quality:**

- ESLint 9.x (with `yaml-eslint-parser` and `eslint-plugin-yml`)
- Prettier 3.x
- Husky + lint-staged (pre-commit hooks)

---

## Key Files Reference

### Core Engine (`scripts/core/`)

- `agent-loader.js` - YAML parsing, schema validation
- `agent-runtime.js` - Execution context, critical actions, menu system
- `workflow-engine.js` - Workflow loading, step execution, state persistence
- `template-engine.js` - Variable substitution with 5 patterns
- `state-machine.js` - Story lifecycle management (BACKLOG/TODO/IN
  PROGRESS/DONE)
- `config-manager.js` - Configuration loading, path resolution
- `manifest-manager.js` - CSV manifest operations (agents/workflows/tasks)
- `platform-injections.js` - IDE-specific optimizations

### CLI (`scripts/cli/`)

- `madace.js` - Main CLI entry point
- `installer.js` - Interactive installation (in development)

### Build Tools (`scripts/build/`)

- `bundler.js` - Generate web bundles
- `validator.js` - Validate bundle integrity
- `flattener.js` - Flatten codebase for analysis

### Documentation

- `CLAUDE.md` (this file) - AI assistant development guide
- `ARCHITECTURE.md` - Detailed technical architecture
- `README.md` - Project overview and user guide
- `PRD-MADACE-CORE.md` - Complete product requirements
- `TERMINOLOGY-REFERENCE.md` - Naming conventions and glossary

---

## Development Guidelines

### Configuration Philosophy

- **Natural language only**: YAML/Markdown/XML (no executable code)
- **Human-readable**: Editable by non-programmers
- **AI-optimizable**: Designed for LLM comprehension

### Code Conventions

- Use ES modules (`import`/`export`)
- Always use `path.join()` for cross-platform paths
- Validate inputs before operations
- Return user-friendly error messages
- Log detailed errors for debugging

### PR Guidelines

- Keep PRs under 800 lines (ideal: 200-400)
- Use conventional commits with scopes
- Run `npm run lint:fix` and `npm run format:fix`
- Update documentation
- Add tests for new features

---

## Getting Help

### Documentation Resources

- **README.md** - User guide and overview
- **CLAUDE.md** (this file) - Development guide for AI assistants
- **ARCHITECTURE.md** - Detailed technical specifications
- **PRD-MADACE-CORE.md** - Complete product requirements (74 stories)
- **TERMINOLOGY-REFERENCE.md** - Complete glossary

### For AI Assistants

When working on this codebase:

1. Focus on implementation based on existing PRD and docs
2. Maintain natural language configuration (no code in configs)
3. Follow cross-platform best practices (`path.join()`, no hardcoded slashes)
4. Keep PRs focused and under 800 lines
5. Use conventional commits with scopes
6. Add tests as you implement features

---

## Quick Start for Development

```bash
# 1. Clone and setup
git clone https://github.com/tekcin/MADACE-METHOD.git
cd MADACE-METHOD
npm install

# 2. Review documentation
cat README.md              # Project overview
cat ARCHITECTURE.md        # Technical details
cat PRD-MADACE-CORE.md     # Requirements

# 3. Run tests
npm test                   # Should pass 12/12 tests

# 4. Before committing
npm run lint:fix           # Fix linting
npm run format:fix         # Format code
git commit -m "feat(scope): description"  # Hooks run automatically
```

---

**Document Version:** 2.0 **Last Updated:** 2025-10-17 **For:** MADACE-METHOD
v1.0-alpha.2
