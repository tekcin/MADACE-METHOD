# MADACE-METHOD v1.0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org)

## 🚀 The Universal Human-AI Collaboration Platform

**MADACE-CORE** (Methodology for AI-Driven Agile Collaboration Engine) is a
revolutionary framework that brings out the best in you through AI agents
designed to enhance human thinking rather than replace it.

Unlike traditional AI tools that do the work for you, MADACE-CORE's specialized
agents guide you through facilitated collaborative reflective workflows to
unlock your full potential across any domain.

---

## What Makes MADACE Different

**Traditional AI**: Does the thinking for you, providing average, bland answers
and solutions

**MADACE-CORE**: Brings out the best thinking in you and the AI through guided
collaboration, elicitation, and facilitation

---

## Core Philosophy: Human Amplification, Not Replacement

MADACE-Core's AI agents act as expert coaches, mentors, and collaborators who:

- ✨ Ask the right questions to stimulate your thinking
- 📋 Provide structured frameworks for complex problems
- 🧠 Guide you through reflective processes to discover insights
- 🎓 Help you develop mastery in your chosen domains
- 🚀 Amplify your natural abilities rather than substituting for them

---

## The C.O.R.E. System

At the heart of MADACE lies the **Collaboration Optimized Reflection Engine**:

- **Collaboration**: Human-AI partnership where both contribute unique strengths
- **Optimized**: The collaborative process has been refined for maximum
  effectiveness
- **Reflection**: Guided thinking that helps you discover better solutions and
  insights
- **Engine**: The powerful framework that orchestrates specialized agents and
  workflows

---

## Universal Domain Coverage Through Modules

MADACE-CORE works in ANY domain through specialized modules:

### Available Modules

#### 🎯 MADACE Core (core)

Included with every installation. Powers all modules with:

- MADACE Master orchestrator for local environments
- Web orchestrator for ChatGPT/Gemini integration
- Universal agent loading system
- Workflow execution engine

#### 🏗️ MADACE Method (MAM)

Agile AI-driven software development with revolutionary features:

- **Scale-Adaptive Planning**: Level 0-4 routing based on project complexity
- **Just-In-Time Tech Specs**: Create architecture per epic during
  implementation
- **Four-Phase Workflow**: Analysis → Planning → Solutioning → Implementation
- **Story State Machine**: BACKLOG → TODO → IN PROGRESS → DONE
- **Dynamic Context Injection**: Targeted expertise per story

[See MAM Documentation](./docs/modules/mam/README.md)

#### 🛠️ MADACE Builder (MAB)

Your Custom Agent, Workflow, and Module authoring tool:

- Create custom AI agents with guided workflows
- Build domain-specific workflows with templates
- Scaffold new modules with standard structure
- Three agent types: Module, Standalone, Core

[See MAB Documentation](./docs/modules/mab/README.md)

#### 💡 Creative Intelligence Suite (CIS)

Unlock innovation, problem-solving, and creative thinking:

- 5 specialized creativity agents
- Proven methodologies (SCAMPER, Six Thinking Hats, Design Thinking, etc.)
- Standalone workflows usable across modules
- Powers brainstorming for MAM and other modules

[See CIS Documentation](./docs/modules/cis/README.md)

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org) v20+ required
- Git (for version control)
- One of the supported IDEs: Claude Code, Windsurf, Cursor, Cline, or Qwen

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/MADACE-METHOD.git
cd MADACE-METHOD

# Install dependencies
npm install

# Install MADACE to your project
npm run install:madace
```

> **Note**: The installer is currently in development. For the latest
> installation instructions, check the documentation.

Follow the interactive installer prompts:

1. **Destination**: Enter full path to your project folder
2. **Your Name**: How agents will address you
3. **Language**: Communication language for all agents
4. **Modules**: Select which modules to install (Core always included)
5. **IDE**: Choose your IDE for platform-specific optimizations

The installer creates a `madace/` folder in your project with:

- Agent configurations
- Workflow definitions
- Configuration files
- Manifest tracking

---

## Core Commands

```bash
# Installation & Management
madace install          # Interactive installation (in development)
madace status          # Show installation status (in development)
madace list            # List available modules (in development)
madace uninstall       # Remove installation (in development)
madace update          # Update framework/modules (in development)

# Development
npm run lint           # Check code quality
npm run lint:fix       # Auto-fix linting issues
npm run format:check   # Check formatting
npm run format:fix     # Auto-format code
npm run bundle         # Generate web bundles
npm run rebundle       # Rebundle existing bundles
npm run validate:bundles  # Validate bundle integrity
npm run flatten        # Flatten codebase for analysis
```

> **Note**: CLI commands are in active development for v1.0-alpha release.

---

## Usage Examples

### MAM (MADACE Method) Workflows

```bash
# Phase 1: Analysis (Optional)
madace analyst brainstorm-project
madace analyst research
madace analyst product-brief

# Phase 2: Planning (Required)
madace pm plan-project

# Phase 3: Solutioning (Levels 3-4)
madace architect solution-architecture
madace architect tech-spec

# Phase 4: Implementation
madace sm create-story
madace sm story-ready
madace sm story-context
madace dev dev-story
madace dev story-approved
madace sm retrospective
```

### MAB (MADACE Builder) Workflows

```bash
# Create custom agents
madace builder create-agent

# Create custom workflows
madace builder create-workflow

# Create new modules
madace builder create-module
```

### Universal Commands

```bash
# Check workflow status (Start here!)
madace analyst workflow-status
madace pm workflow-status

# List available tasks and workflows
madace master *list-tasks
madace master *list-workflows

# Multi-agent collaboration
madace master *party-mode
```

---

## Key Innovations

### 1. Scale-Adaptive Planning

Projects automatically route through different workflows based on complexity:

- **Level 0**: Single atomic change → tech-spec + 1 story
- **Level 1**: 1-10 stories → tech-spec + epic + 2-3 stories
- **Level 2**: 5-15 stories → Focused PRD + tech-spec
- **Level 3**: 12-40 stories → Full PRD + Epics → Solutioning
- **Level 4**: 40+ stories → Enterprise PRD + Epics → Solutioning

### 2. Just-In-Time Design

Technical specifications are created one epic at a time during implementation,
not all upfront:

- Incorporates learnings as the project evolves
- Prevents over-engineering
- Reduces waste from outdated specs

### 3. Story State Machine

Four-state lifecycle eliminates searching:

- **BACKLOG**: Ordered list of stories to draft
- **TODO**: Single story ready for drafting
- **IN PROGRESS**: Single story approved for development
- **DONE**: Completed stories with dates and points

Agents never search—they always read the exact story from the status file.

### 4. Dynamic Expertise Injection

Story-context workflows provide targeted technical guidance per story:

- Relevant architectural decisions
- Related tech spec sections
- Previously completed story patterns
- Domain-specific expertise

Replaces static documentation with contextual expertise.

---

## Architecture Overview

```
MADACE-CORE Framework
├── Core Engine
│   ├── MADACE Master Agent (orchestrator)
│   ├── Agent Loading System
│   ├── Workflow Execution Engine
│   └── Configuration Management
├── Module System
│   ├── MAM (MADACE Method)
│   ├── MAB (MADACE Builder)
│   ├── CIS (Creative Intelligence Suite)
│   └── [Community Modules...]
├── CLI & Installation
│   ├── Interactive Installer
│   ├── Platform Detection
│   ├── IDE-Specific Injections
│   └── Manifest Management
└── Build Tools
    ├── Web Bundler
    ├── Code Flattener
    └── Validation Tools
```

---

## Supported IDEs

MADACE-CORE provides first-class support for:

- ✅ **Claude Code** (Primary - with optional sub-agents)
- ✅ **Windsurf** (Cascade-specific optimizations)
- ✅ **Cursor** (Platform-specific injections)
- ✅ **Cline** (Compatible configuration)
- ✅ **Qwen** (Multi-language support)

Platform-specific features are automatically injected during installation based
on your IDE selection.

---

## Web Bundles

Generate ChatGPT/Gemini-compatible agent bundles:

```bash
# Bundle all agents for web platforms
npm run bundle

# Rebundle existing bundles
npm run rebundle

# Validate bundle integrity
npm run validate:bundles
```

Use the generated bundles to create:

- **ChatGPT Custom GPTs**: Upload bundle markdown
- **Gemini Gems**: Import bundle configuration
- **Other Platforms**: Any system that accepts markdown prompts

---

## Module Development

Create your own MADACE modules using MAB:

```bash
# Start the module creation workflow
madace builder create-module
```

Module structure:

```
your-module/
├── _module-installer/
│   ├── install-menu-config.yaml
│   ├── installer.js
│   └── platform-specifics/
├── agents/
│   └── *.agent.yaml
├── workflows/
│   └── workflow-name/
│       ├── workflow.yaml
│       ├── templates/
│       └── README.md
└── README.md
```

All modules install to a single `madace/` folder with manifest tracking.

---

## Configuration

MADACE uses natural language configuration (YAML/Markdown/XML) exclusively:

**Core Config** (`madace/core/config.yaml`):

```yaml
project_name: 'Your Project'
output_folder: 'docs'
user_name: 'Your Name'
communication_language: 'English'
```

**Agent Definition** (`.agent.yaml`):

```yaml
agent:
  metadata:
    id: 'madace/module/agents/agent-name.md'
    name: 'Agent Name'
    title: 'Full Agent Title'
    icon: '🎯'
  persona:
    role: 'Primary role description'
    identity: 'Detailed identity and expertise'
    communication_style: 'How agent communicates'
    principles: 'Core operating principles'
  critical_actions:
    - 'Action executed on agent load'
  menu:
    - trigger: '*command-name'
      action: 'what happens'
      description: 'Menu item text'
  prompts: []
```

**Workflow Definition** (`workflow.yaml`):

```yaml
workflow:
  name: 'Workflow Name'
  description: 'What this workflow does'
  steps:
    - name: 'Step 1'
      action: 'action-type'
      template: 'templates/output.md'
```

---

## Documentation

- 📚 [Full Documentation](./docs/README.md)
- 🤖 [CLAUDE.md](./CLAUDE.md) - Guide for AI assistants working with this
  codebase
- 📋 [Core PRD](./PRD-MADACE-CORE.md) - Complete product requirements
- 🚀 [Features to Merge](./PRD-MADACE-FEATURES-TO-MERGE.md) - Roadmap features
  (v1.0-beta to stable)
- 📖 [Terminology Reference](./TERMINOLOGY-REFERENCE.md) - Complete terminology
  guide
- 🏗️ [MAM Workflows Guide](./docs/modules/mam/workflows/README.md)
- 🛠️ [Agent Creation Guide](./docs/modules/mab/create-agent/README.md)
- 📦 [Module Structure Guide](./docs/modules/mab/create-module/README.md)
- 🎨 [CIS Creativity Guide](./docs/modules/cis/README.md)

---

## Contributing

We welcome contributions and new module development!

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run linting: `npm run lint:fix`
5. Run formatting: `npm run format:fix`
6. Commit using conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
7. Push and create a Pull Request

### PR Guidelines

- Keep PRs under 800 lines (ideal: 200-400)
- Include tests for new features
- Update documentation
- Follow existing code style
- Add entry to CHANGELOG.md

For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md)

### For AI-Assisted Development

If you're using Claude Code or another AI coding assistant, see
[CLAUDE.md](./CLAUDE.md) for:

- Architecture overview and key patterns
- Development guidelines and conventions
- Common pitfalls to avoid
- Essential commands and workflows

---

## Community & Support

- 💬 **Discord Community**: [Join here](https://discord.gg/your-invite) _(Coming
  soon)_
- 🐛 **Issue Tracker**:
  [Report bugs](https://github.com/your-org/MADACE-METHOD/issues) _(Coming
  soon)_
- 💡 **Discussions**:
  [Share ideas](https://github.com/your-org/MADACE-METHOD/discussions) _(Coming
  soon)_
- 📖 **Documentation**: [Read the docs](./docs/README.md)
- 🤖 **For AI Assistants**: See [CLAUDE.md](./CLAUDE.md) for development
  guidance

---

## Roadmap

### v1.0-alpha.2 (Released - 2025-10-17)

**Latest stable alpha release**

- ✅ Core framework with agent system (100% complete)
- ✅ MAM module complete with all 5 agents (PM, Analyst, Architect, SM, DEV)
- ✅ MAB (MADACE Builder) and CIS (Creative Intelligence Suite) modules
- ✅ 5 IDE integrations (100% complete)
- ✅ Scale-adaptive planning Level 0-4 (100% complete)
- ✅ Web bundles (experimental - bundler functional)
- ✅ 74/74 stories complete across 9 epics
- ✅ Code quality enforced (ESLint 9.x + Prettier 3.x)
- ✅ Pre-commit hooks (Husky + lint-staged)
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Comprehensive documentation
- ✅ 100% alpha test pass rate (12/12 tests)

**What's New in alpha.2:**

- Fixed missing MAM agent definitions (5 agents)
- Workflow engine accepts both 'type' and 'action' fields
- Template engine supports single-brace {variable} pattern
- All alpha test failures resolved

### v1.0-beta (Q2 2026) - Focus: Stability & Production Readiness

**Core Stability Features (P0):**

- State machine validation & recovery
- YAML schema validation system
- Cross-platform path handling
- Error handling & logging framework
- Config migration system
- File operation safety & atomicity

**Brownfield Support (P0):**

- Codebase analysis workflow
- Retroactive story generation
- Incremental adoption support
- Technical debt tracking

**Web Bundle Completion (P1):**

- Fully functional ChatGPT Custom GPTs
- Gemini Gems integration
- Web bundle parity matrix
- Hybrid workflow (web + IDE)

**Orchestration & Progress (P1):**

- Workflow dependencies
- Workflow composition & orchestration
- Progress dashboard
- Story progress tracking

### v1.0 Stable (Q3 2026) - Focus: Ecosystem & Enterprise

**Community Ecosystem (P1):**

- Community module repository
- Module quality standards
- Module templates & scaffolding
- Module versioning & compatibility
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
- CI/CD integration
- Telemetry & analytics (opt-in)

[View Detailed Feature Roadmap](./PRD-MADACE-FEATURES-TO-MERGE.md)

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Trademark Notice

MADACE™ and MADACE-METHOD™ are trademarks. All rights reserved.

---

## Acknowledgments

MADACE-METHOD is inspired by proven agile methodologies and modern AI
collaboration patterns. Special thanks to:

- The open-source AI community
- Early alpha testers and contributors
- Claude Code, Windsurf, Cursor, Cline, Qwen, and other IDE teams
- The Node.js and JavaScript ecosystem

## Migration from BMAD-METHOD

MADACE-METHOD is the evolved successor to BMAD-METHOD with improved architecture
and rebranding:

- **BMAD** → **MADACE** (framework name)
- **BMM** → **MAM** (agile development module)
- **BoMB/BMB** → **MAB** (builder module)
- `bmad/` → `madace/` (installation folder)

Systems are not directly compatible. Complete existing BMAD projects before
migrating. See [TERMINOLOGY-REFERENCE.md](./TERMINOLOGY-REFERENCE.md) for
complete comparison.

---

## Quick Reference

### Terminology

- **MADACE**: Methodology for AI-Driven Agile Collaboration Engine
- **MAM**: MADACE Method (Agile Development Module)
- **MAB**: MADACE Builder (Agent/Workflow Creation Module)
- **CIS**: Creative Intelligence Suite (Brainstorming Module)
- **JIT**: Just-In-Time (per-epic tech specs)
- **State Machine**: BACKLOG → TODO → IN PROGRESS → DONE

### Essential Files

- `madace/core/config.yaml` - Core configuration
- `madace/_cfg/agent-manifest.csv` - Installed agents
- `madace/_cfg/workflow-manifest.csv` - Available workflows
- `mam-workflow-status.md` - Phase & story tracking (MAM projects)
- `CLAUDE.md` - Guide for AI assistants (architecture, patterns, conventions)

### Common Commands

```bash
madace install              # Install to project
madace status              # Check installation
madace analyst workflow-status  # Check project status
madace pm plan-project     # Start planning phase
madace sm create-story     # Create user story
madace dev dev-story       # Implement story
```

---

<sub>Built with ❤️ for the human-AI collaboration community</sub>
