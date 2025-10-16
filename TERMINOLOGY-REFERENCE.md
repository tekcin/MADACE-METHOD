# MADACE Terminology Reference

**Version:** 1.0 **Last Updated:** 2025-10-15 **Purpose:** Complete reference
for MADACE-METHOD terminology, naming conventions, and rebranding

This document provides a complete reference for MADACE-METHOD terminology,
naming conventions, and rebranding from the original BMAD-METHOD framework.

> **For AI Assistants**: This terminology reference is essential for
> understanding naming patterns across the codebase. See
> [CLAUDE.md](./CLAUDE.md) for architectural context.

---

## Core Branding

### Framework Name

- **MADACE-CORE** = Methodology for AI-Driven Agile Collaboration Engine
- **MADACE-METHOD** = The complete framework including all modules

### Acronym Breakdown

- **M** = Methodology
- **A** = AI-Driven
- **D** = [for]
- **A** = Agile
- **C** = Collaboration
- **E** = Engine

---

## Module Names

### Core Modules

| Module Code | Full Name                   | Description                                              |
| ----------- | --------------------------- | -------------------------------------------------------- |
| **core**    | MADACE Core                 | Core orchestration engine, master agent, workflow system |
| **MAM**     | MADACE Method               | Agile AI-driven software development (formerly BMM)      |
| **MAB**     | MADACE Builder              | Agent/workflow/module creation tools (formerly BoMB/BMB) |
| **CIS**     | Creative Intelligence Suite | Brainstorming and innovation workflows                   |

### Naming Pattern

All MADACE modules use **MA-** prefix:

- **MAM** (MADACE Method)
- **MAB** (MADACE Builder)
- Future examples: **MAT** (MADACE Testing), **MAD** (MADACE DevOps), etc.

---

## Agent Names

### Core Agents

| Agent Name           | Role                                     | Module |
| -------------------- | ---------------------------------------- | ------ |
| **madace-master**    | Core orchestrator and task executor      | core   |
| **web-orchestrator** | Web bundle orchestrator (ChatGPT/Gemini) | core   |

### MAM Agents

| Agent Name         | Role                              | Full Title         |
| ------------------ | --------------------------------- | ------------------ |
| **analyst**        | Analysis and research             | Business Analyst   |
| **pm**             | Planning and product management   | Product Manager    |
| **po**             | Product ownership                 | Product Owner      |
| **architect**      | Architecture and technical design | Solution Architect |
| **game-architect** | Game architecture                 | Game Architect     |
| **sm**             | Scrum master and story creation   | Scrum Master       |
| **dev**            | Development and implementation    | Developer          |
| **sr**             | Senior review                     | Senior Developer   |
| **game-designer**  | Game design                       | Game Designer      |

### MAB Agents

| Agent Name  | Role                           | Full Title     |
| ----------- | ------------------------------ | -------------- |
| **builder** | Agent/workflow/module creation | MADACE Builder |

### CIS Agents

| Agent Name               | Role                       | Full Title           |
| ------------------------ | -------------------------- | -------------------- |
| **innovation-catalyst**  | Innovation facilitation    | Innovation Catalyst  |
| **problem-solver**       | Problem-solving frameworks | Problem Solver       |
| **creative-strategist**  | Creative strategy          | Creative Strategist  |
| **ideation-facilitator** | Ideation guidance          | Ideation Facilitator |
| **insight-generator**    | Insight generation         | Insight Generator    |

---

## File & Folder Naming

### Installation Folder

- **Primary folder**: `madace/` (installed in user projects)
- **Core subfolder**: `madace/core/`
- **Module subfolders**: `madace/mam/`, `madace/mab/`, `madace/cis/`
- **Config folder**: `madace/_cfg/`

### Configuration Files

| File                     | Location           | Purpose                                           |
| ------------------------ | ------------------ | ------------------------------------------------- |
| `config.yaml`            | `madace/core/`     | Core configuration (project name, user, language) |
| `agent-manifest.csv`     | `madace/_cfg/`     | Installed agents tracking                         |
| `workflow-manifest.csv`  | `madace/_cfg/`     | Available workflows tracking                      |
| `task-manifest.csv`      | `madace/_cfg/`     | Available tasks tracking                          |
| `mam-workflow-status.md` | `{output_folder}/` | MAM workflow phase and story tracking             |

### Agent Files

- **Pattern**: `*.agent.yaml`
- **Examples**:
  - `madace-master.agent.yaml`
  - `pm.agent.yaml`
  - `analyst.agent.yaml`
  - `architect.agent.yaml`

### Workflow Files

- **Pattern**: `workflow.yaml` (within workflow directory)
- **Directory structure**:
  ```
  workflow-name/
  ├── workflow.yaml
  ├── templates/
  │   └── output-template.md
  └── README.md
  ```

### Output Documents (MAM)

| File Pattern               | Description                     | Example                        |
| -------------------------- | ------------------------------- | ------------------------------ |
| `PRD.md`                   | Product Requirements Document   | `PRD.md`                       |
| `GDD.md`                   | Game Design Document            | `GDD.md`                       |
| `Epics.md`                 | Epic breakdown with stories     | `Epics.md`                     |
| `tech-spec.md`             | Technical specification         | `tech-spec.md`                 |
| `tech-spec-epic-N.md`      | Epic-specific tech spec         | `tech-spec-epic-1.md`          |
| `epic-stories.md`          | Epic summary with story links   | `epic-stories.md`              |
| `story-{slug}.md`          | User story file                 | `story-user-authentication.md` |
| `story-{slug}-N.md`        | Numbered story file (Level 1)   | `story-user-auth-1.md`         |
| `solution-architecture.md` | Solution architecture with ADRs | `solution-architecture.md`     |
| `mam-workflow-status.md`   | Workflow status tracking        | `mam-workflow-status.md`       |

---

## CLI Commands

### Binary Name

- **CLI binary**: `madace`
- **Package name**: `madace-method`

### Core Commands

```bash
madace install              # Interactive installation
madace status              # Show installation status
madace list                # List available modules
madace uninstall           # Remove installation
madace update              # Update framework/modules
```

### Workflow Invocation Pattern

```bash
madace [agent-name] [workflow-name]
```

**Examples:**

```bash
madace analyst brainstorm-project
madace pm plan-project
madace architect solution-architecture
madace sm create-story
madace dev dev-story
madace builder create-agent
```

### Universal Commands (via madace-master)

```bash
madace master *list-tasks
madace master *list-workflows
madace master *party-mode
```

---

## Workflow Names

### Naming Convention

- **Pattern**: kebab-case
- **Format**: `verb-noun` or `descriptive-name`

### MAM Workflows

#### Phase 1: Analysis

| Workflow             | Command                                | Description                       |
| -------------------- | -------------------------------------- | --------------------------------- |
| `brainstorm-project` | `madace analyst brainstorm-project`    | Software solution exploration     |
| `brainstorm-game`    | `madace game-designer brainstorm-game` | Game concept ideation             |
| `research`           | `madace analyst research`              | Market/technical/deep research    |
| `product-brief`      | `madace analyst product-brief`         | Strategic product planning        |
| `game-brief`         | `madace game-designer game-brief`      | Structured game design foundation |
| `workflow-status`    | `madace analyst workflow-status`       | Universal status checker          |

#### Phase 2: Planning

| Workflow       | Command                          | Description                    |
| -------------- | -------------------------------- | ------------------------------ |
| `plan-project` | `madace pm plan-project`         | Scale-adaptive planning router |
| `plan-game`    | `madace game-designer plan-game` | Game-specific planning         |
| `prd`          | (sub-workflow)                   | Product Requirements Document  |
| `gdd`          | (sub-workflow)                   | Game Design Document           |
| `tech-spec`    | (sub-workflow)                   | Technical specification        |
| `narrative`    | (sub-workflow)                   | Narrative design               |
| `ux`           | (sub-workflow)                   | UX design                      |

#### Phase 3: Solutioning

| Workflow                | Command                                  | Description                    |
| ----------------------- | ---------------------------------------- | ------------------------------ |
| `solution-architecture` | `madace architect solution-architecture` | Overall architecture with ADRs |
| `tech-spec`             | `madace architect tech-spec`             | Epic-specific tech spec (JIT)  |

#### Phase 4: Implementation

| Workflow         | Command                     | Description                      |
| ---------------- | --------------------------- | -------------------------------- |
| `create-story`   | `madace sm create-story`    | Draft story from TODO            |
| `story-ready`    | `madace sm story-ready`     | Approve story for development    |
| `story-context`  | `madace sm story-context`   | Generate expertise injection XML |
| `dev-story`      | `madace dev dev-story`      | Implement story                  |
| `story-approved` | `madace dev story-approved` | Mark story done after DoD        |
| `review-story`   | `madace dev review-story`   | Quality validation               |
| `correct-course` | `madace sm correct-course`  | Handle issues/changes            |
| `retrospective`  | `madace sm retrospective`   | Capture epic learnings           |

### MAB Workflows

| Workflow          | Command                          | Description            |
| ----------------- | -------------------------------- | ---------------------- |
| `create-agent`    | `madace builder create-agent`    | Create custom agent    |
| `create-workflow` | `madace builder create-workflow` | Create custom workflow |
| `create-module`   | `madace builder create-module`   | Scaffold new module    |

### CIS Workflows

| Workflow                     | Command        | Description                 |
| ---------------------------- | -------------- | --------------------------- |
| Various creativity workflows | Via CIS agents | Brainstorming methodologies |

---

## Command Triggers (Menu Items)

### Pattern

- **Format**: `*command-name`
- **Prefix**: Always starts with asterisk (`*`)

### Examples

```
*list-tasks
*list-workflows
*party-mode
*plan-project
*create-story
*dev-story
```

### Usage

Commands are triggered within agent conversations:

```
User: "madace master"
Agent loads...
User: "*list-workflows"
Agent lists all workflows...
```

---

## Configuration Keys

### Naming Convention

- **Pattern**: snake_case
- **Format**: lowercase with underscores

### Core Config Keys

```yaml
project_name: 'String'
output_folder: 'String (path)'
user_name: 'String'
communication_language: "String (e.g., 'English', 'Spanish')"
```

### MAM Module Config Keys

```yaml
tech_docs: 'String (path)'
dev_story_location: 'String (path)'
kb_location: 'String (path)'
desired_mcp_tools: 'Array[String]'
```

---

## Technical Terms

### Scale Levels

- **Level 0**: Single atomic change
- **Level 1**: 1-10 stories, 1 epic
- **Level 2**: 5-15 stories, 1-2 epics
- **Level 3**: 12-40 stories, 2-5 epics
- **Level 4**: 40+ stories, 5+ epics

### Project Types

- **Greenfield**: New project from scratch
- **Brownfield**: Existing codebase

### Story States

- **BACKLOG**: Ordered list of stories to draft
- **TODO**: Single story ready for drafting
- **IN PROGRESS**: Single story approved for development
- **DONE**: Completed stories

### Story Status Values (in story files)

- **Draft**: Story created, awaiting user review
- **Ready**: User approved, ready for implementation
- **In Review**: Implementation complete, awaiting approval
- **Done**: User approved, DoD complete

### Workflow Terms

- **JIT**: Just-In-Time (tech specs per epic during implementation)
- **DoD**: Definition of Done
- **ADR**: Architecture Decision Record
- **PRD**: Product Requirements Document
- **GDD**: Game Design Document
- **Epic**: Large body of work (5-15 stories)
- **Story**: Single unit of work (1-5 days)

---

## NPM Script Names

### Installation & Management

```bash
npm run install:madace      # Install to project
npm run madace:install      # Alias for install
npm run madace:status       # Check installation status
```

### Code Quality

```bash
npm run lint               # Check linting
npm run lint:fix           # Auto-fix linting
npm run format:check       # Check formatting
npm run format:fix         # Auto-fix formatting
```

### Build & Bundle

```bash
npm run bundle             # Bundle all web versions
npm run rebundle           # Rebundle existing bundles
npm run validate:bundles   # Validate bundle integrity
npm run flatten            # Flatten codebase for analysis
```

### Development

```bash
npm run prepare            # Setup Husky hooks
```

---

## Variable Interpolation Patterns

### System Variables

```
{project-root}              # Root directory of target project
{user_name}                 # User's name from config
{communication_language}    # Configured language
{output_folder}             # Configured output folder
{project_name}              # Project name from config
{directory_name}            # Directory basename
{madace-root}               # Root of madace installation folder
{config-path}               # Path to core config.yaml
{date}                      # Current date (YYYY-MM-DD)
{timestamp}                 # Current timestamp (ISO 8601)
```

### Environment Variables

```
$HOME                       # User home directory (Unix/Mac)
%USERPROFILE%               # User profile directory (Windows)
$PROJECT_ROOT               # Custom environment variable
${MADACE_CONFIG}            # Optional config path override
```

### Usage in YAML

```yaml
critical_actions:
  - 'Load into memory {project-root}/madace/core/config.yaml'
  - 'Remember the users name is {user_name}'
  - 'ALWAYS communicate in {communication_language}'
  - "Today's date is {date}"

paths:
  config: '{madace-root}/core/config.yaml'
  output: '{project-root}/{output_folder}'
```

### Template Variable Substitution

In template files (`.md`, `.xml`, etc.), use same syntax:

```markdown
# {project_name}

Created by: {user_name} Date: {date}

Output: {output_folder}
```

### Escaping Variables

To include literal braces in output:

```yaml
# Use double braces
output: '{{not_a_variable}}' # Outputs: {not_a_variable}
```

---

## Comparison Table: BMAD vs MADACE

### Core Terms

| BMAD                   | MADACE                   | Notes                 |
| ---------------------- | ------------------------ | --------------------- |
| BMad-CORE              | MADACE-CORE              | Framework name        |
| BMAD-METHOD            | MADACE-METHOD            | Complete system       |
| BMad Master            | MADACE Master            | Core agent            |
| bmad/                  | madace/                  | Installation folder   |
| bmad-master            | madace-master            | Master agent file     |
| bmad-master.agent.yaml | madace-master.agent.yaml | Agent definition file |

### Modules

| BMAD       | MADACE | Notes          |
| ---------- | ------ | -------------- |
| BMM        | MAM    | MADACE Method  |
| BoMB / BMB | MAB    | MADACE Builder |
| CIS        | CIS    | (Unchanged)    |

### Workflow Status

| BMAD                   | MADACE                 | Notes                |
| ---------------------- | ---------------------- | -------------------- |
| bmm-workflow-status.md | mam-workflow-status.md | Status tracking file |

### CLI Commands

| BMAD                 | MADACE                 | Notes               |
| -------------------- | ---------------------- | ------------------- |
| bmad install         | madace install         | CLI binary          |
| bmad status          | madace status          | Status command      |
| bmad pm plan-project | madace pm plan-project | Workflow invocation |
| bmad list            | madace list            | List modules        |
| bmad uninstall       | madace uninstall       | Remove installation |

### Package Names

| BMAD        | MADACE        | Notes            |
| ----------- | ------------- | ---------------- |
| bmad-method | madace-method | npm package name |

### Config Files

| BMAD                  | MADACE                  | Notes         |
| --------------------- | ----------------------- | ------------- |
| bmad/core/config.yaml | madace/core/config.yaml | Core config   |
| bmad/\_cfg/           | madace/\_cfg/           | Config folder |

### Migration Notes

**Important Incompatibilities:**

- Config file formats may differ (check for migrations)
- Workflow state files are not interchangeable
- Agent definitions have evolved (may need updates)
- Module structure improvements (not backward compatible)

**Migration Recommendations:**

1. ✅ Complete all BMAD projects before migrating
2. ✅ Export/backup all BMAD project data
3. ✅ Install MADACE fresh (don't attempt in-place upgrade)
4. ✅ Manually port custom agents/workflows using MAB
5. ✅ Test thoroughly in new projects first

**Coexistence:**

- ✅ Both systems can coexist on same machine
- ✅ Use different project directories
- ⚠️ Don't mix BMAD and MADACE in same project

---

## File Extensions & Types

### Configuration Files

- `.yaml` - YAML configuration (agents, workflows, configs)
- `.md` - Markdown documentation and outputs
- `.csv` - Manifest files (agents, workflows, tasks)
- `.xml` - Context injection files (story-context)
- `.json` - Package configuration, schemas, lock files

### Agent Files

- Pattern: `*.agent.yaml`
- Location: `madace/{module}/agents/`
- Naming: `{agent-name}.agent.yaml` (e.g., `pm.agent.yaml`,
  `analyst.agent.yaml`)

### Workflow Files

- Pattern: `workflow.yaml`
- Location: `madace/{module}/workflows/{workflow-name}/`
- Always named exactly `workflow.yaml` within workflow directory

### Template Files

- Pattern: `*.md` (usually), but can be `.xml`, `.yaml`, `.json`, etc.
- Location: `madace/{module}/workflows/{workflow-name}/templates/`
- Examples: `PRD.md`, `story-template.md`, `context.xml`

### Output Documents (MAM)

- Pattern: Varies by document type
- Location: `{output_folder}/` (typically `docs/`)
- Types:
  - `PRD.md` - Product Requirements Document
  - `GDD.md` - Game Design Document
  - `Epics.md` - Epic breakdown
  - `tech-spec.md` - Technical specification
  - `story-*.md` - User stories
  - `solution-architecture.md` - Architecture document
  - `mam-workflow-status.md` - Workflow status tracker

### Installer Files

- `install-menu-config.yaml` - Installer Q&A configuration
- `installer.js` - Installer logic
- Located in: `{module}/_module-installer/`

### Manifest Files

- `agent-manifest.csv` - Installed agents registry
- `workflow-manifest.csv` - Available workflows registry
- `task-manifest.csv` - Available tasks registry
- Located in: `madace/_cfg/`

### Log Files

- Pattern: `*.log`
- Location: `madace/logs/` (future)
- Examples: `madace.log`, `mam-state-audit.log`

---

## Environment & Platform Terms

### IDE Names (Supported)

- **Claude Code** - Primary IDE with optional sub-agents
- **Windsurf** - Cascade-specific optimizations
- **Cursor** - Platform-specific injections
- **Cline** - Compatible configuration
- **Qwen** - Multi-language support

### Platform Types

- **Local**: IDE-based installation (full functionality)
- **Web**: ChatGPT/Gemini bundles (limited functionality, no file system access)
- **Hybrid**: Combination of web and local (e.g., web for planning, local for
  implementation)

### Platform-Specific Features

- **Claude Code**: Sub-agent system, Task tool, advanced workflows
- **Windsurf**: Cascade integration, specialized prompting
- **Cursor**: Context awareness, inline suggestions
- **All IDEs**: Core agent system, workflow execution, configuration management

### MCP Tools (Optional Integrations)

**Research & Web:**

- Chrome Official MCP
- Playwright
- Tavily
- Perplexity

**Context & Knowledge:**

- Context 7

**Project Management:**

- Jira
- Trello
- GitHub Projects

**Future Integrations (Planned):**

- Linear
- Asana
- Monday.com
- Notion

### Operating Systems

- **macOS** - Primary development platform
- **Linux** - Fully supported
- **Windows** - Fully supported (requires cross-platform path handling)

### Node.js Versions

- **Minimum**: v20.0.0
- **Recommended**: Latest LTS
- **Tested**: v20.x, v21.x, v22.x

---

## Branding Guidelines

### When to Use MADACE

- ✅ Framework name
- ✅ CLI binary
- ✅ Installation folder
- ✅ Master agent name
- ✅ Module prefixes (MAM, MAB)
- ✅ Package names

### When to Use Full Names

- ✅ Documentation titles
- ✅ Marketing materials
- ✅ User-facing descriptions
- ✅ README headers

### Formatting

- **MADACE-CORE**: All caps with hyphen (framework)
- **MADACE-METHOD**: All caps with hyphen (complete system)
- **madace**: Lowercase (CLI binary, folder names)
- **MAM/MAB/CIS**: All caps (module codes)
- **MADACE Master**: Title case (agent titles)

### Common Mistakes to Avoid

- ❌ `MADACE_METHOD` (underscore)
- ❌ `MadaceMethod` (camelCase)
- ❌ `madace-method` (lowercase with hyphen for framework name)
- ✅ `MADACE-METHOD` (correct for framework)
- ✅ `madace-method` (correct for npm package name only)

---

## Versioning Convention

### Version Format

- **Pattern**: `vX.Y.Z` or `vX.Y.Z-stage`
- **Examples**:
  - `v1.0.0-alpha`
  - `v1.0.0-beta`
  - `v1.0.0` (stable)
  - `v1.1.0` (minor version bump)
  - `v2.0.0` (major version bump)

### Release Stages

- **alpha**: Early testing, unstable, frequent breaking changes
- **beta**: Feature-complete, stabilizing, minimal breaking changes
- **stable** (or no suffix): Production-ready, semantic versioning

### Semantic Versioning (Post-v1.0)

- **Major (X.0.0)**: Breaking changes, incompatible API changes
- **Minor (1.X.0)**: New features, backward-compatible
- **Patch (1.0.X)**: Bug fixes, backward-compatible

### Branch Names

- **main**: Stable releases
- **next**: Beta/testing releases
- **develop**: Integration branch (if used)
- **feature/{name}**: Feature branches (e.g., `feature/brownfield-analysis`)
- **fix/{name}**: Bug fix branches (e.g., `fix/state-machine-validation`)
- **docs/{name}**: Documentation updates
- **refactor/{name}**: Code refactoring

### Commit Message Convention (Conventional Commits)

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring (no functional changes)
- `test`: Test additions or changes
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `style`: Code style changes (formatting, etc.)
- `ci`: CI/CD changes
- `build`: Build system changes

**Examples:**

```
feat(mam): add brownfield analysis workflow
fix(core): resolve state machine race condition
docs(readme): update installation instructions
refactor(workflows): simplify template loading
```

---

## Development Status Indicators

Use these indicators in documentation to show feature maturity:

| Indicator | Meaning            | Usage                                       |
| --------- | ------------------ | ------------------------------------------- |
| ✅        | Complete           | Feature is fully implemented and tested     |
| ⏳        | In Progress        | Feature is currently being developed        |
| 🎯        | Planned            | Feature is planned for upcoming release     |
| ⚠️        | Experimental       | Feature exists but may change significantly |
| 🔧        | In Development     | CLI/tooling feature being built             |
| 📝        | Documentation Only | Documented but not yet implemented          |

### Examples

```markdown
- ✅ Scale-adaptive planning (Level 0-4)
- ⏳ Web bundles (experimental)
- 🎯 Community module repository
- 🔧 CLI commands (in active development)
```

---

## Summary Quick Reference

```
FRAMEWORK:    MADACE-CORE / MADACE-METHOD
MODULES:      MAM (Method), MAB (Builder), CIS (Creative)
CLI BINARY:   madace
FOLDER:       madace/
MASTER AGENT: madace-master
CONFIG:       madace/core/config.yaml
MANIFESTS:    madace/_cfg/*.csv
STATUS FILE:  mam-workflow-status.md

COMMAND:      madace [agent] [workflow]
EXAMPLE:      madace pm plan-project

SCALE:        Level 0-4
PHASES:       1-Analysis, 2-Planning, 3-Solutioning, 4-Implementation
STATES:       BACKLOG → TODO → IN PROGRESS → DONE

PRIORITY:     P0 (Critical), P1 (High), P2 (Medium), P3 (Low)
RELEASES:     v1.0-alpha (current), v1.0-beta (Q2 2026), v1.0 (Q3 2026)
```

---

## Related Documentation

- 📚 [README.md](./README.md) - Project overview and getting started
- 🤖 [CLAUDE.md](./CLAUDE.md) - Guide for AI assistants (architecture, patterns)
- 📋 [PRD-MADACE-CORE.md](./PRD-MADACE-CORE.md) - Complete product requirements
- 🚀 [PRD-MADACE-FEATURES-TO-MERGE.md](./PRD-MADACE-FEATURES-TO-MERGE.md) -
  Feature roadmap
- 📖 [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
- 📜 [CHANGELOG.md](./CHANGELOG.md) - Version history and changes

---

_This terminology reference is maintained as part of the MADACE-METHOD
documentation._ _Last reviewed: 2025-10-15 | Next review: With each major
release_
