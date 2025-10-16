# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

MADACE-METHOD (Methodology for AI-Driven Agile Collaboration Engine) is a
universal human-AI collaboration framework that orchestrates specialized AI
agents through guided workflows. Unlike traditional AI tools that provide direct
answers, MADACE agents act as expert facilitators, asking questions and guiding
reflective processes to amplify human potential.

**Key Philosophy:** Human amplification, not replacement. AI agents facilitate
thinking rather than do the work.

## Architecture

### Core Components

1. **MADACE Core Engine**
   - Agent loading system (YAML-defined agents with personas)
   - Workflow execution engine (orchestrates multi-step processes)
   - Configuration management (natural language configs: YAML/Markdown/XML)
   - MADACE Master agent (central orchestrator)

2. **Module System**
   - **MAM (MADACE Method)**: Agile software development with scale-adaptive
     planning (Level 0-4)
   - **MAB (MADACE Builder)**: Tools for creating custom agents, workflows, and
     modules
   - **CIS (Creative Intelligence Suite)**: Brainstorming and innovation
     workflows
   - All modules install to single `madace/` folder with manifest tracking

3. **Installation System**
   - Interactive CLI installer with module selection
   - IDE-specific optimizations (Claude Code, Windsurf, Cursor, Cline, Qwen)
   - Platform detection and injection

### Key Architectural Patterns

**Scale-Adaptive Planning (MAM):**

- Level 0: Single atomic change → tech-spec + 1 story
- Level 1: 1-10 stories → tech-spec + epic
- Level 2: 5-15 stories → Focused PRD
- Level 3: 12-40 stories → Full PRD + Solutioning
- Level 4: 40+ stories → Enterprise PRD + Architecture

**Just-In-Time Design:**

- Architecture created once upfront (Phase 3)
- Tech specs created per epic during implementation (not all upfront)
- Reduces waste from over-planning

**Story State Machine (Phase 4):**

```
BACKLOG → TODO → IN PROGRESS → DONE
```

- Single source of truth: `mam-workflow-status.md`
- Only one story in TODO, one in IN PROGRESS at a time
- No searching for "next story"—always read from status file

**Natural Language Configuration:**

- No executable code in core framework definitions
- All configs in YAML/Markdown/XML
- Human-readable and AI-optimizable

## Key Concepts

### Scale Levels

Projects automatically route through different workflows based on complexity:

- **Level 0**: Single atomic change → tech-spec + 1 story
- **Level 1**: 1-10 stories → tech-spec + epic + 2-3 stories
- **Level 2**: 5-15 stories → Focused PRD + tech-spec
- **Level 3**: 12-40 stories → Full PRD + Epics → Solutioning phase
- **Level 4**: 40+ stories → Enterprise PRD + Epics → Solutioning phase

**Routing Logic:**

- PM agent assesses complexity via Q&A
- Detects project type (web, mobile, backend, game, etc.)
- Checks greenfield vs brownfield
- Routes to appropriate sub-workflow

### Four-Phase Workflow (MAM)

1. **Analysis (Optional)**: Brainstorming, research, briefs
   - Agents: Analyst, Researcher, Game Designer
   - Workflows: `brainstorm-project`, `research`, `product-brief`, `game-brief`

2. **Planning (Required)**: Scale-adaptive PRD/GDD/tech-spec generation
   - Agent: PM (Product Manager)
   - Primary workflow: `plan-project` (scale-adaptive router)
   - Outputs: PRD.md, GDD.md, tech-spec.md, Epics.md

3. **Solutioning (Levels 3-4 Only)**: Architecture and per-epic JIT tech specs
   - Agent: Architect
   - Workflows: `solution-architecture`, `tech-spec` (per epic)
   - Outputs: solution-architecture.md, tech-spec-epic-N.md

4. **Implementation (Iterative)**: Story creation, context injection,
   development, approval
   - Agents: SM (Scrum Master), DEV (Developer)
   - Workflows: `create-story`, `story-ready`, `story-context`, `dev-story`,
     `story-approved`, `retrospective`
   - Uses Story State Machine (see below)

### Story State Machine

Four-state lifecycle that eliminates searching:

- **BACKLOG**: Ordered list of stories to draft (ID, title, filename)
- **TODO**: Single story ready for drafting (status: "Draft")
- **IN PROGRESS**: Single story approved for development (status: "Ready")
- **DONE**: Completed stories with dates and points (status: "Done")

**State Transitions:**

- Phase 2/3 → Phase 4: Populate BACKLOG, initialize TODO
- `create-story`: Drafts story in TODO
- `story-ready`: TODO → IN PROGRESS, next BACKLOG → TODO
- `dev-story`: Implements story from IN PROGRESS
- `story-approved`: IN PROGRESS → DONE

**Critical Rules:**

- Only ONE story in TODO at a time
- Only ONE story in IN PROGRESS at a time
- Agents never search—they always read the exact story from
  `mam-workflow-status.md`
- Single source of truth for all story state

### Dynamic Context Injection

`story-context` workflow generates targeted expertise XML per story:

- Relevant architectural decisions (from solution-architecture.md)
- Related tech spec sections
- Previously completed story patterns
- Domain-specific expertise (frontend, backend, database, API)

**Purpose:**

- Replaces static `devLoadAlways` lists with dynamic, targeted context
- Provides just-in-time knowledge relevant to current story
- Reduces cognitive load and context switching

### Brownfield vs Greenfield

- **Greenfield**: New project from scratch
  - Start with Phase 1 (Analysis) or Phase 2 (Planning)
  - No existing codebase to analyze

- **Brownfield**: Existing codebase
  - Requires `brownfield-analysis` workflow (planned for v1.0-beta)
  - Generates: codebase-analysis.md, existing-features.md, technical-debt.md
  - Supports retroactive story generation for existing features
  - Enables incremental adoption of MADACE

## File Structure

```
MADACE-METHOD/
├── madace/                      # Installed in user projects
│   ├── core/
│   │   ├── config.yaml          # Core configuration
│   │   └── agents/
│   │       └── madace-master.agent.yaml
│   ├── _cfg/
│   │   ├── agent-manifest.csv   # Installed agents
│   │   ├── workflow-manifest.csv
│   │   └── task-manifest.csv
│   ├── mam/                     # MADACE Method module
│   │   ├── agents/
│   │   │   ├── pm.agent.yaml
│   │   │   ├── analyst.agent.yaml
│   │   │   ├── architect.agent.yaml
│   │   │   ├── sm.agent.yaml
│   │   │   └── dev.agent.yaml
│   │   └── workflows/
│   │       ├── plan-project/
│   │       ├── create-story/
│   │       └── dev-story/
│   ├── mab/                     # MADACE Builder module
│   │   └── agents/
│   │       └── builder.agent.yaml
│   └── cis/                     # Creative Intelligence Suite
│       └── agents/
├── bundles/                     # Web bundles (ChatGPT/Gemini)
├── docs/                        # Documentation
├── scripts/                     # CLI and utilities
└── {output_folder}/
    ├── PRD.md
    ├── GDD.md
    ├── Epics.md
    ├── tech-spec.md
    ├── story-*.md
    └── mam-workflow-status.md   # Phase and story tracking
```

## Important Files

### Configuration

- `madace/core/config.yaml` - Core config (project_name, output_folder,
  user_name, communication_language)
- `madace/_cfg/agent-manifest.csv` - Registry of installed agents
- `madace/_cfg/workflow-manifest.csv` - Registry of available workflows

### MAM Tracking

- `mam-workflow-status.md` - Phase tracking and story state machine
  (BACKLOG/TODO/IN PROGRESS/DONE)
- Entry point for checking project status

### Module Structure

Each module includes:

- `_module-installer/` - Installation configuration and logic
- `agents/*.agent.yaml` - Agent definitions
- `workflows/*/workflow.yaml` - Workflow configurations
- `workflows/*/templates/` - Output templates

## Naming Conventions

### Files

- Agent files: `*.agent.yaml`
- Workflows: kebab-case (`plan-project`, `create-story`)
- Config keys: snake_case (`project_name`, `output_folder`)
- Commands: asterisk prefix (`*list-tasks`, `*plan-project`)

### Stories

- Pattern: `story-{slug}.md` or `story-{slug}-N.md`
- Example: `story-user-authentication.md`, `story-user-auth-1.md`

### Tech Specs

- Single: `tech-spec.md`
- Per-epic (JIT): `tech-spec-epic-1.md`, `tech-spec-epic-2.md`

## Development Commands

> **Note**: This is a documentation-first project. Most of the CLI commands are
> still in development for v1.0-alpha.

### Installation & Management (In Development)

```bash
madace install              # Interactive installation
madace status              # Show installation status
madace list                # List available modules
madace uninstall           # Remove installation
madace update              # Update framework/modules
```

### Code Quality (Available Now)

```bash
npm run lint               # Check code quality (ESLint)
npm run lint:fix           # Auto-fix linting issues
npm run format:check       # Check formatting (Prettier)
npm run format:fix         # Auto-format code
```

**Pre-commit hooks**: Automatically run `lint:fix` and `format:fix` on staged
files via Husky.

### Build & Distribution (In Development)

```bash
npm run bundle             # Generate web bundles (ChatGPT/Gemini)
npm run rebundle           # Rebundle existing bundles
npm run validate:bundles   # Validate bundle integrity
npm run flatten            # Flatten codebase for analysis
```

### Git Workflow

```bash
# Conventional commits enforced via pre-commit hooks
feat(scope):      # New features
fix(scope):       # Bug fixes
docs(scope):      # Documentation changes
refactor(scope):  # Code refactoring
test(scope):      # Test additions/changes
chore(scope):     # Maintenance tasks
```

**Examples:**

```bash
git commit -m "feat(mam): add brownfield analysis workflow"
git commit -m "fix(core): resolve state machine race condition"
git commit -m "docs(readme): update installation instructions"
```

## Workflow Invocation

### Pattern

```bash
madace [agent-name] [workflow-name]
```

### Common Workflows

**Phase 1 - Analysis (Optional):**

```bash
madace analyst workflow-status      # Universal entry point
madace analyst brainstorm-project   # Explore solution
madace analyst research             # Conduct research
madace analyst product-brief        # Strategic planning
```

**Phase 2 - Planning (Required):**

```bash
madace pm plan-project              # Scale-adaptive router
```

**Phase 3 - Solutioning (Levels 3-4):**

```bash
madace architect solution-architecture  # Overall architecture + ADRs
madace architect tech-spec              # Per-epic JIT tech spec
```

**Phase 4 - Implementation (Iterative):**

```bash
madace sm create-story              # Draft story from TODO
madace sm story-ready               # Approve story (TODO → IN PROGRESS)
madace sm story-context             # Generate expertise injection XML
madace dev dev-story                # Implement story
madace dev story-approved           # Mark done (IN PROGRESS → DONE)
madace sm retrospective             # Capture epic learnings
```

**Module Creation (MAB):**

```bash
madace builder create-agent         # Create custom agent
madace builder create-workflow      # Create custom workflow
madace builder create-module        # Scaffold new module
```

## Technology Stack

### Runtime

- **Node.js** v20+ (required)
- **JavaScript** (no TypeScript - intentional simplicity)

### Key Dependencies

- `js-yaml` - YAML parsing
- `commander` - CLI framework
- `inquirer` - Interactive prompts
- `fs-extra` - File operations
- `chalk`, `boxen`, `ora` - CLI UI
- `csv-parse` - Manifest parsing

### Code Quality

- **ESLint** 9.x with `yaml-eslint-parser`
- **Prettier** 3.x
- **Husky** + lint-staged for pre-commit hooks

### Platform Support

- MacOS, Linux, Windows
- 5 IDE integrations: Claude Code, Windsurf, Cursor, Cline, Qwen

## Development Guidelines

### Configuration Philosophy

- **Natural language only**: YAML/Markdown/XML (no executable code in configs)
- **Human-readable**: Configs should be editable by non-programmers
- **AI-optimizable**: Designed for LLM comprehension

### Agent Design

- Agents are **facilitators**, not executors
- Ask questions, provide frameworks, guide reflection
- Use personas with role, identity, communication_style, principles
- Critical actions run on agent load
- Menu items trigger commands (`*command-name`)

### Workflow Design

- Multi-step processes defined in `workflow.yaml`
- Support templates with variable substitution (`{user_name}`, `{project-root}`)
- Sub-workflows for modularity
- State tracking in status files

### File Operations

- Always use `path.join()` and `path.resolve()` (cross-platform)
- No hardcoded paths with `/` or `\`
- Handle spaces in paths with proper quoting
- Validate paths before operations
- Atomic writes (planned for v1.0-beta):
  - Write to temporary file first
  - Rename to target on success
  - Rollback on failure
- File locking for concurrent write prevention
- Checksum verification for integrity
- Safe deletion: move to `madace/.trash/` (7-day retention)

### Error Handling

- User-friendly error messages with resolution steps
- Link to documentation or suggest commands
- Never expose stack traces to users (log only)
- Centralized error handling system (planned for v1.0-beta):
  - Error types: USER_ERROR, CONFIG_ERROR, SYSTEM_ERROR, VALIDATION_ERROR
  - Severity levels: DEBUG, INFO, WARN, ERROR, FATAL
  - Structured logging to `madace/logs/madace.log`
  - Log rotation: 10MB max, 5 files retained
  - Debug mode: `MADACE_DEBUG=1` for verbose logging

### Module Development

- Standard structure: `_module-installer/`, `agents/`, `workflows/`
- Installation via `install-menu-config.yaml` with Q&A
- Platform-specific features via `platform-specifics/`
- Cross-module references allowed (e.g., MAM uses CIS brainstorming)

## Testing Approach

> **Current Status**: Test infrastructure is planned for v1.0-beta. The project
> is currently in documentation-first phase.

### Pre-Commit Validation (Active)

- Linting runs on staged JS files (ESLint 9.x with yaml-eslint-parser)
- Formatting runs on staged files (Prettier 3.x)
- Max warnings: 0 (fail on warnings)
- Configured via Husky + lint-staged
- Pre-commit hooks auto-install on `npm install`

### Cross-Platform Testing (Planned for v1.0-beta)

- Test on Mac, Windows, Linux
- Path handling critical (use `path.join()` and `path.resolve()`)
- Environment variable expansion ($HOME, %USERPROFILE%)
- Automated CI/CD tests

### Workflow Validation (Planned for v1.0-beta)

- YAML schema validation (JSON Schema definitions)
- Template variable substitution
- State machine transitions
- Manifest consistency
- Bundle integrity validation

### Testing Commands (When Available)

```bash
npm test                   # Run all tests
npm run test:unit          # Run unit tests
npm run test:integration   # Run integration tests
npm run test:watch         # Watch mode
npm run test:coverage      # Generate coverage report
```

### Testing Requirements (From PRD)

- Installation success rate >95% across platforms
- Zero data loss in stress tests
- Error rate <5% of workflow executions
- Clear error messages in 95%+ of failures

## Common Pitfalls

### YAML Configuration

- ❌ Executable code in YAML
- ❌ Hardcoded paths (use variables: `{project-root}`, `{output_folder}`)
- ❌ Missing variable declarations
- ❌ Invalid schema (will be caught by validator in v1.0-beta)
- ✅ Natural language definitions only
- ✅ Cross-platform paths with variables
- ✅ Variable interpolation: `{user_name}`, `{project-root}`, `{date}`
- ✅ Validate with `madace validate` (when available)

### State Machine

- ❌ Multiple stories in TODO/IN PROGRESS (violates single-story rule)
- ❌ Searching for "next story" (always read from status file)
- ❌ Direct state transitions that skip states (BACKLOG → DONE)
- ❌ Manual status file editing (use workflows)
- ✅ Single source of truth (`mam-workflow-status.md`)
- ✅ Read exact story from status file sections
- ✅ Atomic state transitions via workflows
- ✅ State validation and recovery (coming in v1.0-beta)

### File Operations

- ❌ Hardcoded slashes: `path/to/file` or `path\to\file`
- ❌ Assume single OS: `~/projects` (won't work on Windows)
- ❌ Direct writes without error handling (race conditions)
- ❌ No path validation (security risk)
- ❌ Permanent deletion (no recovery)
- ✅ Use `path.join()`: `path.join(base, 'file')`
- ✅ Use `path.resolve()` for absolute paths
- ✅ Expand env vars: `$HOME`, `%USERPROFILE%`, `${MADACE_CONFIG}`
- ✅ Atomic writes (temp + rename, coming in v1.0-beta)
- ✅ Safe deletion: move to `madace/.trash/` (coming in v1.0-beta)

### Manifest Management

- ❌ Orphaned manifest entries (files deleted but entries remain)
- ❌ Unregistered files (files exist but not in manifest)
- ❌ Manual manifest editing (error-prone)
- ✅ Use installer/uninstaller for all module operations
- ✅ Run `madace verify manifests` after changes (when available)
- ✅ Let system maintain manifest consistency

### Error Handling

- ❌ Silent failures (no user feedback)
- ❌ Cryptic error messages ("Error: undefined")
- ❌ Stack traces shown to users
- ❌ No recovery suggestions
- ✅ User-friendly messages with context
- ✅ Suggest resolution steps ("Try: madace validate config")
- ✅ Link to relevant documentation
- ✅ Log detailed errors for debugging

## Terminology

### Acronyms

- **MADACE** = Methodology for AI-Driven Agile Collaboration Engine
- **MAM** = MADACE Method (Agile Development Module)
- **MAB** = MADACE Builder (Agent/Workflow Creation Module)
- **CIS** = Creative Intelligence Suite (Brainstorming Module)
- **JIT** = Just-In-Time (per-epic tech specs created during implementation)
- **ADR** = Architecture Decision Record
- **PRD** = Product Requirements Document
- **GDD** = Game Design Document
- **DoD** = Definition of Done

### Priority Levels (From PRD)

- **P0** = Critical (must have for release)
- **P1** = High (important for release)
- **P2** = Medium (nice to have)
- **P3** = Low (future consideration)

### Project States

- **Greenfield**: New project from scratch
- **Brownfield**: Existing codebase (requires `brownfield-analysis` workflow)

### Story Status (in story files)

- **Draft**: Created, awaiting user review
- **Ready**: Approved, ready for implementation
- **In Review**: Implementation complete, awaiting approval
- **Done**: Approved after DoD complete

### State Machine States (in mam-workflow-status.md)

- **BACKLOG**: Ordered list of stories to draft
- **TODO**: Single story ready for drafting
- **IN PROGRESS**: Single story being implemented
- **DONE**: Completed stories with dates and points

### Release Stages

- **alpha**: Early testing, unstable, frequent breaking changes
- **beta**: Feature-complete, stabilizing, minimal breaking changes
- **stable**: Production-ready, semantic versioning

For complete terminology reference, see TERMINOLOGY-REFERENCE.md

## Migration from BMAD-METHOD

This is a rebrand and refactor from BMAD-METHOD:

- **BMAD** → **MADACE** (framework)
- **BMM** → **MAM** (agile module)
- **BoMB/BMB** → **MAB** (builder module)
- `bmad/` → `madace/` (folder)
- `bmad-master` → `madace-master` (agent)
- `bmm-workflow-status.md` → `mam-workflow-status.md`

Systems are not directly compatible—complete BMAD projects before switching.

## Roadmap Context

### v1.0-alpha (Current - Q1 2026)

- ✅ Core framework with agent system
- ✅ MAM, MAB, CIS modules
- ✅ 5 IDE integrations
- ✅ Scale-adaptive planning (Level 0-4)
- ⏳ Web bundles (experimental)

### v1.0-beta (Q2 2026) - Focus: Stability & Production Readiness

**Core Stability Features (P0):**

- State machine validation & recovery
- YAML schema validation system
- Cross-platform path handling
- Error handling & logging framework
- Config migration system
- File operation safety & atomicity
- Manifest consistency enforcement
- Graceful degradation & fallbacks

**Brownfield Support (P0):**

- Codebase analysis workflow
- Retroactive story generation
- Incremental adoption support
- Technical debt tracking

**Web Bundle Completion (P1):**

- Fully functional ChatGPT Custom GPTs
- Gemini Gems integration
- Web bundle parity matrix
- Web bundle auto-generator
- Hybrid workflow (web + IDE)

**Orchestration & Progress (P1):**

- Workflow dependencies
- Workflow composition & orchestration
- Workflow templates with variables
- Progress dashboard
- Story progress tracking
- Notification system
- Time tracking & estimates

### v1.0 Stable (Q3 2026) - Focus: Ecosystem & Enterprise

**Community Ecosystem (P1):**

- Community module repository
- Module quality standards
- Module templates & scaffolding
- Module versioning & compatibility
- Contribution guidelines & governance
- Documentation hub

**Enterprise Features (P2):**

- Team collaboration support
- Advanced Jira integration
- GitHub Project integration
- Enterprise configuration management
- Compliance & reporting

**Advanced Integrations (P2):**

- MCP tools auto-discovery
- AI model selection
- CI/CD integration (GitHub Actions, GitLab CI, Jenkins)
- Telemetry & analytics (opt-in)

**Total Estimated Stories:** 74 (Level 4 project scope)

## Contributing

### PR Guidelines

- Keep PRs under 800 lines (ideal: 200-400)
- Use conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`)
- Run `npm run lint:fix` and `npm run format:fix`
- Update documentation
- Add entry to CHANGELOG.md

### Module Contributions

- Use MAB to scaffold: `madace builder create-module`
- Follow standard structure
- Include comprehensive README
- Test cross-platform
- Submit for community review

## Key Principles

1. **Human Amplification**: AI facilitates thinking, doesn't replace it
2. **Scale Adaptive**: Documentation matches project complexity
3. **Just-In-Time**: Create what's needed when it's needed
4. **Natural Language**: Configs readable by humans and AI
5. **Single Source of Truth**: State machine eliminates searching
6. **Context Over Documentation**: Dynamic expertise injection vs static docs

## Current Development Status

**Phase**: Documentation-First (v1.0-alpha preparation)

**What Exists:**

- ✅ Complete product requirements documentation (PRD-MADACE-CORE.md)
- ✅ Detailed feature roadmap (PRD-MADACE-FEATURES-TO-MERGE.md - 39 features, 74
  stories)
- ✅ Comprehensive terminology reference (TERMINOLOGY-REFERENCE.md)
- ✅ Architecture and design specifications
- ✅ Module and workflow definitions (YAML/Markdown)
- ✅ Code quality tooling (ESLint 9.x, Prettier 3.x, Husky)
- ✅ Project documentation (README.md, CLAUDE.md)

**What's In Development (v1.0-alpha):**

- 🔧 CLI installer and commands (`madace install`, `madace status`, etc.)
- 🔧 Agent loading and execution system
- 🔧 Workflow execution engine
- 🔧 Configuration management system
- 🔧 Web bundle generation (experimental)
- 🔧 Test infrastructure

**Planned for v1.0-beta (Q2 2026):**

- 8 Core Stability features (state validation, YAML schemas, error handling,
  etc.)
- 4 Brownfield Support features (codebase analysis, retroactive stories, etc.)
- 5 Web Bundle Completion features (ChatGPT/Gemini integration)
- 7 Orchestration & Progress features (dependencies, dashboards, tracking)

**Planned for v1.0 Stable (Q3 2026):**

- 6 Community Ecosystem features (module repository, quality standards, docs
  hub)
- 5 Enterprise Features (team collaboration, Jira/GitHub integration,
  compliance)
- 4 Advanced Integrations (MCP auto-discovery, AI model selection, CI/CD,
  telemetry)

**When Working on This Codebase:**

- Focus on implementation based on existing PRD and documentation
- Maintain natural language configuration philosophy (no executable code in
  configs)
- Follow cross-platform best practices (use `path.join()`, no hardcoded slashes)
- Ensure YAML/config files are human-readable and AI-optimizable
- Add tests as you implement features (test coverage goal: >70%)
- Keep PRs under 800 lines (ideal: 200-400)
- Use conventional commits with scopes

## Getting Help

### Documentation Resources

- **README.md** - Project overview, installation, usage examples
- **CLAUDE.md** (this file) - AI assistant guide, architecture, patterns
- **PRD-MADACE-CORE.md** - Complete product requirements (74 stories across 9
  epics)
- **PRD-MADACE-FEATURES-TO-MERGE.md** - Feature roadmap (39 features for
  v1.0-beta and v1.0)
- **TERMINOLOGY-REFERENCE.md** - Complete terminology, naming conventions, BMAD
  migration

### Community & Support (Coming Soon)

- **Discord Community**: [Join here](https://discord.gg/your-invite) _(Coming
  soon)_
- **Issue Tracker**:
  [Report bugs](https://github.com/your-org/MADACE-METHOD/issues) _(Coming
  soon)_
- **Discussions**:
  [Share ideas](https://github.com/your-org/MADACE-METHOD/discussions) _(Coming
  soon)_

### For Contributors

- **CONTRIBUTING.md** - Contribution guidelines (when available)
- **CHANGELOG.md** - Version history and changes (when available)

## Quick Start for Development

1. **Clone and Install Dependencies:**

   ```bash
   git clone <repository-url>
   cd MADACE-METHOD
   npm install
   ```

2. **Review Documentation:**
   - Start with README.md for project overview
   - Read PRD-MADACE-CORE.md for detailed requirements
   - Check TERMINOLOGY-REFERENCE.md for naming conventions

3. **Set Up Development Environment:**
   - Pre-commit hooks auto-install via Husky
   - Use supported IDE (Claude Code, Windsurf, Cursor, Cline, or Qwen)
   - Node.js v20+ required

4. **Before Committing:**
   ```bash
   npm run lint:fix      # Fix linting issues
   npm run format:fix    # Format code
   git commit           # Hooks will run automatically
   ```
