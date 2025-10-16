# Product Requirements Document: MADACE-CORE Framework

**Document Version:** 1.0 **Last Updated:** 2025-10-15 **Project Code:**
MADACE-CORE **Scope Level:** Level 4 (40+ stories, enterprise-scale)

---

## Executive Summary

MADACE-CORE (Methodology for AI-Driven Agile Collaboration Engine) is a
universal human-AI collaboration framework that orchestrates specialized AI
agents through guided workflows to amplify human capabilities rather than
replace them. The framework uses natural language configuration
(Markdown/YAML/XML) exclusively—no executable code in core framework
definitions—enabling a modular architecture where domain-specific modules extend
the core engine.

**Key Innovation:** Unlike traditional AI tools that provide direct answers,
MADACE-CORE agents act as expert facilitators, asking questions, providing
frameworks, and guiding reflective processes to bring out the best thinking in
both humans and AI.

---

## 1. Product Vision & Goals

### 1.1 Vision Statement

Create a universal platform that transforms how humans collaborate with AI by
shifting from "AI does the work" to "AI amplifies human potential through guided
facilitation and structured reflection."

### 1.2 Core Objectives

1. **Human Amplification**: Enable AI agents to act as expert coaches, mentors,
   and facilitators rather than task executors
2. **Universal Applicability**: Support any domain through modular architecture
   (software development, game design, creative work, etc.)
3. **Scale Adaptability**: Automatically adjust workflows and documentation to
   project complexity (Level 0-4)
4. **Developer Experience**: Provide seamless installation across multiple IDEs
   with natural language configuration
5. **Extensibility**: Enable community-created modules, agents, and workflows
   through standardized patterns

### 1.3 Success Metrics

- **Adoption**: 10,000+ installations within 6 months post-beta
- **Module Ecosystem**: 15+ community-contributed modules within 12 months
- **User Satisfaction**: 85%+ report improved thinking/productivity vs
  traditional AI tools
- **Multi-IDE Support**: 5+ IDE integrations with platform-specific
  optimizations
- **Documentation Coverage**: 100% of workflows and agents have comprehensive
  READMEs

---

## 2. Target Users & Personas

### 2.1 Primary Personas

**1. Solo Developer (Individual Contributor)**

- Needs structured methodology for planning and building projects
- Values guidance and reflection over direct code generation
- Wants to learn best practices through guided workflows
- Uses Claude Code, Cursor, or Windsurf

**2. Development Team Lead**

- Manages 3-8 developers on agile projects
- Needs consistent methodology across team members
- Values scale-adaptive workflows that prevent over-documentation
- Requires integration with existing tools (Jira, Trello)

**3. Game Developer/Designer**

- Building indie or small studio games
- Needs specialized workflows for GDD (Game Design Documents)
- Values creative brainstorming and structured design processes
- Works across narrative, UX, and technical architecture

**4. AI Enthusiast/Power User**

- Wants to customize agents and create domain-specific workflows
- Needs tools to build custom modules for niche use cases
- Values extensibility and documentation
- Contributes to open-source ecosystem

### 2.2 Secondary Personas

**5. Enterprise Architect**

- Oversees large-scale projects (Level 4: 40+ stories)
- Needs enterprise PRD and architectural documentation
- Values ADR (Architecture Decision Records) and compliance

**6. Creative Professional**

- Uses AI for brainstorming, problem-solving, innovation
- Not necessarily technical
- Values structured creativity frameworks

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
MADACE-CORE Framework
├── Core Engine
│   ├── MADACE Master Agent (orchestrator)
│   ├── Agent Loading System
│   ├── Workflow Execution Engine
│   └── Configuration Management
├── Module System
│   ├── MAM (MADACE Method - Agile Development)
│   ├── MAB (MADACE Builder - Agent/Workflow Creation)
│   ├── CIS (Creative Intelligence Suite)
│   └── [Future Modules...]
├── CLI & Installation
│   ├── Interactive Installer
│   ├── Platform Detection
│   ├── IDE-Specific Injections
│   └── Manifest Management
└── Build Tools
    ├── Web Bundler (ChatGPT/Gemini integration)
    ├── Code Flattener (for analysis)
    └── Validation Tools
```

### 3.2 Core Components

#### 3.2.1 MADACE Master Agent

- **Purpose**: Central orchestrator for all agent operations
- **Responsibilities**:
  - Load and manage specialized agents at runtime
  - Execute tasks and workflows
  - Maintain project configuration (config.yaml)
  - Provide universal commands (`*list-tasks`, `*list-workflows`, `*party-mode`)
- **Configuration**: YAML-based agent definition with persona, critical actions,
  menu items

#### 3.2.2 Agent System

- **Agent Definition Schema**:
  ```yaml
  agent:
    metadata:
      id: 'path/to/agent.md'
      name: 'Agent Name'
      title: 'Full Title'
      icon: '🎯'
    persona:
      role: 'Primary role'
      identity: 'Detailed expertise'
      communication_style: 'How agent speaks'
      principles: 'Core operating principles'
    critical_actions:
      - 'Action on load'
    menu:
      - trigger: '*command-name'
        action: 'what happens'
        description: 'Menu text'
    prompts: []
  ```
- **Agent Types**:
  1. **Module Agents**: Part of installed modules (PM, Analyst, Architect, etc.)
  2. **Standalone Agents**: Specialized tiny agents for specific tasks
  3. **Core Agents**: MADACE Master, Web Orchestrator

#### 3.2.3 Workflow System

- **Structure**: YAML configuration + supporting templates
- **Components**:
  - `workflow.yaml`: Execution configuration
  - `templates/`: Output templates for documents
  - `README.md`: Usage documentation
- **Features**:
  - Sub-workflow support
  - Multi-workflow orchestration (coming)
  - Context injection (story-context)
  - State machine support (Phase 4 implementation)

#### 3.2.4 Module System

- **Module Structure**:
  ```
  module-name/
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
- **Installation**: Modules install to single `madace/` folder with manifest
  tracking
- **Sharing**: Modules can reference components from other modules (e.g., MAM
  uses CIS brainstorming)

### 3.3 Data Flow

```
User → CLI/IDE → MADACE Master → Load Agent → Execute Workflow
                      ↓
                 Load config.yaml
                      ↓
            Update manifests (agents, workflows, tasks)
                      ↓
              Generate artifacts (PRD, stories, etc.)
                      ↓
           Update workflow status (mam-workflow-status.md)
```

---

## 4. Feature Requirements

### 4.1 Core Framework Features

#### F1: Agent Management System

**Priority:** P0 (Critical) **Description:** Runtime loading and execution of
YAML-defined AI agents

**Requirements:**

- Parse YAML agent definitions with validation
- Load agents on-demand (never pre-load)
- Support persona-based behavior configuration
- Execute critical actions on agent load
- Support multi-language communication (configurable per user)
- Menu system with command triggers (`*command-name`)
- Variable interpolation (`{user_name}`, `{project-root}`, etc.)

**Acceptance Criteria:**

- Agent loads in <2 seconds with full persona context
- Commands execute workflows or actions correctly
- Agent speaks in configured language
- Invalid YAML provides clear error messages

---

#### F2: Workflow Execution Engine

**Priority:** P0 (Critical) **Description:** Execute multi-step YAML-configured
workflows with template generation

**Requirements:**

- Parse workflow.yaml configuration
- Execute sequential and parallel steps
- Support conditional routing (scale levels, project type)
- Generate documents from templates with variable substitution
- Track workflow state in status files
- Support sub-workflows and orchestration
- Maintain workflow manifests (CSV)

**Acceptance Criteria:**

- Workflows execute all defined steps in order
- Templates generate with correct variable substitution
- State persists across sessions
- Errors halt execution with clear messages

---

#### F3: Configuration Management

**Priority:** P0 (Critical) **Description:** Project-level and module-level
configuration system

**Requirements:**

- Core config.yaml with:
  - `project_name`
  - `output_folder`
  - `user_name`
  - `communication_language`
- Module-specific configs (e.g., `tech_docs`, `dev_story_location`)
- Manifest files:
  - `agent-manifest.csv`
  - `workflow-manifest.csv`
  - `task-manifest.csv`
- Config validation on load
- Default values with user prompts during installation

**Acceptance Criteria:**

- Config loads successfully on every agent load
- Variables accessible throughout workflows
- Manifests update atomically on module install/uninstall

---

#### F4: CLI Installation System

**Priority:** P0 (Critical) **Description:** Interactive installer with IDE
detection and module selection

**Requirements:**

- Commands:
  - `madace install`: Interactive installation
  - `madace status`: Show installation status
  - `madace list`: List available modules
  - `madace uninstall`: Remove installation
  - `madace update`: Update framework/modules
- Installation flow:
  1. Detect/prompt for target project directory
  2. Prompt for user name and language
  3. Module selection (multi-select)
  4. IDE selection with platform-specific injections
  5. Generate config files and manifests
  6. Copy module files to `madace/` folder
- Support creating target directory if non-existent
- Validate Node.js version (>=20.0.0)

**Acceptance Criteria:**

- Installer completes in <60 seconds for 3 modules
- All files copy correctly to destination
- Config files contain correct values
- IDE-specific files inject properly (Claude Code, Windsurf, etc.)
- Status command shows accurate installation state

---

#### F5: Module Installer Framework

**Priority:** P0 (Critical) **Description:** Standardized module installation
with Q&A configuration

**Requirements:**

- Each module has `_module-installer/`:
  - `install-menu-config.yaml`: Questions and defaults
  - `installer.js`: Installation logic
  - `platform-specifics/`: IDE-specific injections
- Support question types:
  - Text input with defaults
  - Multi-select
  - Confirmation
- Variable interpolation (`{directory_name}`, `{project-root}`)
- Platform-specific code injection (e.g., Claude Code sub-agents)

**Acceptance Criteria:**

- Module installs with custom configuration
- Questions display correctly with defaults
- Platform-specific features install only for selected IDE
- Configuration persists to module config files

---

### 4.2 MAM (MADACE Method) Module Features

#### F6: Scale-Adaptive Planning System

**Priority:** P0 (Critical) **Description:** Automatically route projects
through appropriate workflows based on complexity

**Requirements:**

- **Scale Levels**:
  - Level 0: Single atomic change → tech-spec + 1 story
  - Level 1: 1-10 stories → tech-spec + epic + 2-3 stories
  - Level 2: 5-15 stories → Focused PRD + tech-spec
  - Level 3: 12-40 stories → Full PRD + Epics → Solutioning
  - Level 4: 40+ stories → Enterprise PRD + Epics → Solutioning
- **Routing Logic**:
  - Detect project type (web, mobile, backend, game, etc.)
  - Assess complexity via PM Q&A
  - Check greenfield vs brownfield
  - Route to appropriate sub-workflow
- **Outputs by Level**:
  - Level 0: `tech-spec.md`, `story-{slug}.md`
  - Level 1: `tech-spec.md`, `epic-stories.md`, `story-{slug}-N.md`
  - Level 2-4: `PRD.md`, `Epics.md`, `tech-spec.md` (conditionally)
  - Game: `GDD.md`
- Generate `mam-workflow-status.md` tracking file

**Acceptance Criteria:**

- PM asks appropriate questions for complexity assessment
- Correct level assigned based on answers
- Correct sub-workflow executes
- All specified artifacts generate
- Status file created with phase tracking

---

#### F7: Four-Phase Workflow System

**Priority:** P0 (Critical) **Description:** Complete software development
lifecycle with four distinct phases

**Requirements:**

**Phase 1: Analysis (Optional)**

- Workflows: `brainstorm-project`, `research`, `product-brief`, `game-brief`
- Agents: Analyst, Researcher, Game Designer
- Outputs: Briefs, research documents

**Phase 2: Planning (Required)**

- Workflows: `plan-project` (scale-adaptive router)
- Sub-workflows: `prd`, `gdd`, `tech-spec`, `narrative`, `ux`
- Agent: PM
- Outputs: PRD.md, GDD.md, tech-spec.md, Epics.md

**Phase 3: Solutioning (Levels 3-4 Only)**

- Workflows: `solution-architecture`, `tech-spec` (per epic, JIT)
- Agent: Architect
- Outputs: `solution-architecture.md`, `tech-spec-epic-N.md`
- **Just-In-Time Tech Specs**: Create one per epic during implementation

**Phase 4: Implementation (Iterative)**

- Workflows: `create-story`, `story-ready`, `story-context`, `dev-story`,
  `story-approved`, `review-story`, `correct-course`, `retrospective`
- Agents: SM (Scrum Master), DEV
- State Machine: BACKLOG → TODO → IN PROGRESS → DONE
- Outputs: Story files, context XMLs, implemented code

**Acceptance Criteria:**

- Each phase completes before next begins
- Phase transitions update status file
- Workflows access correct artifacts from previous phases
- State machine tracks stories accurately

---

#### F8: Story State Machine (Phase 4)

**Priority:** P0 (Critical) **Description:** Four-state lifecycle management for
user stories

**Requirements:**

- **States in mam-workflow-status.md**:
  - **BACKLOG**: Ordered list of stories to draft (ID, title, filename)
  - **TODO**: Single story ready for drafting
  - **IN PROGRESS**: Single story approved for development
  - **DONE**: Completed stories with dates and points
- **State Transitions**:
  - Phase 2/3 → Phase 4: Populate BACKLOG, initialize TODO
  - `create-story`: Drafts story in TODO (status = "Draft")
  - `story-ready`: TODO → IN PROGRESS, BACKLOG → TODO (status = "Ready")
  - `dev-story`: Implements story from IN PROGRESS
  - `story-approved`: IN PROGRESS → DONE (status = "Done")
- **Story File Status Values**: Draft → Ready → In Review → Done
- **No Search Required**: Agents read exact story from status file sections

**Acceptance Criteria:**

- Status file maintains accurate state for all stories
- Only one story in TODO and IN PROGRESS at a time
- Transitions update both status file and story file status field
- Agents never search—always read from status file

---

#### F9: Story Context Injection

**Priority:** P1 (High) **Description:** Generate targeted expertise XML per
story for enhanced implementation

**Requirements:**

- `story-context` workflow generates XML with:
  - Relevant architectural decisions
  - Related tech spec sections
  - Previously completed story patterns
  - Domain-specific expertise
- Replace generic `devLoadAlways` list with dynamic context
- Context injected into DEV agent before `dev-story` execution
- Support various context types (frontend, backend, database, API, etc.)

**Acceptance Criteria:**

- Context XML generates for every story
- Context contains relevant technical information
- DEV agent uses context during implementation
- No generic file lists in prompts

---

#### F10: Workflow Status Tracking

**Priority:** P0 (Critical) **Description:** Universal entry point and status
checker for all MAM workflows

**Requirements:**

- `workflow-status` workflow:
  - Check for existing status file
  - Display current phase and progress
  - Show Phase 4 state machine (BACKLOG/TODO/IN PROGRESS/DONE)
  - Recommend next action
  - Offer workflow navigation
- No status file behavior:
  - Ask about project context (greenfield vs brownfield)
  - Offer analysis options
  - Guide to appropriate first workflow
- All agents (madace-master, analyst, pm) check on load

**Acceptance Criteria:**

- Status displays correctly for all phases
- Recommendations are actionable and accurate
- New projects receive appropriate guidance
- Status file versioning works (v1, v2, etc.)

---

### 4.3 MAB (MADACE Builder) Module Features

#### F11: Agent Creation Workflow

**Priority:** P1 (High) **Description:** Guided workflow for creating custom AI
agents

**Requirements:**

- `create-agent` workflow with Q&A:
  - Agent name, title, icon
  - Role and identity
  - Communication style
  - Principles
  - Menu commands
  - Agent type (module, standalone, core)
- Generate `.agent.yaml` file
- Documentation generation
- Validation of YAML structure

**Acceptance Criteria:**

- Valid agent YAML generates from user inputs
- Agent loads successfully in MADACE Master
- Documentation includes usage examples
- Validation catches schema errors

---

#### F12: Workflow Creation Workflow

**Priority:** P1 (High) **Description:** Tools for building custom workflows

**Requirements:**

- `create-workflow` workflow with:
  - Workflow name and description
  - Step definition
  - Template creation
  - Sub-workflow linking
- Generate `workflow.yaml`
- Create `templates/` directory structure
- Generate README.md

**Acceptance Criteria:**

- Valid workflow YAML generates
- Templates work with variable substitution
- Workflow executes successfully
- README documents all steps

---

#### F13: Module Creation Workflow

**Priority:** P2 (Medium) **Description:** Scaffold new modules with standard
structure

**Requirements:**

- `create-module` workflow:
  - Module code and name
  - Default selection preference
  - Installation questions
  - Initial agents and workflows
- Generate full module structure:
  - `_module-installer/`
  - `agents/`
  - `workflows/`
  - `README.md`
- Create installer config and logic

**Acceptance Criteria:**

- Module structure matches conventions
- Module installs via CLI
- README documents purpose and usage
- Installer Q&A works correctly

---

### 4.4 CIS (Creative Intelligence Suite) Features

#### F14: Brainstorming Workflows

**Priority:** P2 (Medium) **Description:** Structured creativity frameworks for
ideation

**Requirements:**

- 5 specialized agents with workflows:
  1. Innovation Catalyst
  2. Problem Solver
  3. Creative Strategist
  4. Ideation Facilitator
  5. Insight Generator
- Each workflow uses proven methodologies:
  - SCAMPER
  - Six Thinking Hats
  - Mind Mapping
  - Design Thinking
  - Jobs-to-be-Done
- Outputs: Structured idea documents, concept proposals

**Acceptance Criteria:**

- Each agent guides through respective methodology
- Outputs are well-structured and actionable
- Workflows are standalone (usable outside MAM)
- Other modules can reference CIS workflows (e.g., MAM brainstorming)

---

### 4.5 Build & Distribution Features

#### F15: Web Bundler

**Priority:** P2 (Medium) **Description:** Generate ChatGPT/Gemini-compatible
agent bundles

**Requirements:**

- Commands:
  - `npm run bundle`: Bundle all web versions
  - `npm run rebundle`: Rebundle existing bundles
- Bundle format:
  - Single markdown file per agent
  - Includes persona, instructions, workflows
  - Platform-specific formatting (ChatGPT vs Gemini)
- Validation:
  - `npm run validate:bundles`: Check integrity
- Output to `bundles/` directory

**Acceptance Criteria:**

- Bundles generate successfully for all agents
- ChatGPT custom GPTs work with bundles
- Gemini Gems work with bundles
- Validation catches formatting errors

---

#### F16: Code Flattener

**Priority:** P3 (Low) **Description:** Flatten codebase into single markdown
for analysis

**Requirements:**

- Command: `npm run flatten`
- Flatten entire codebase with:
  - Directory structure
  - File contents with syntax highlighting
  - Respect `.gitignore` patterns
- Output: `flattened-codebase.md`

**Acceptance Criteria:**

- Flattened output contains all relevant files
- Markdown formatting is correct
- Large codebases flatten in <5 minutes

---

### 4.6 Code Quality & Developer Experience

#### F17: Linting & Formatting

**Priority:** P1 (High) **Description:** Automated code quality enforcement

**Requirements:**

- ESLint for JavaScript (`.js`, `.cjs`, `.mjs`) and YAML
- Prettier for all formats (JS, YAML, JSON, MD)
- Pre-commit hooks via Husky:
  - Run `lint:fix` on staged JS files
  - Run `format:fix` on staged files
- Commands:
  - `npm run lint`: Check linting
  - `npm run lint:fix`: Auto-fix linting
  - `npm run format:check`: Check formatting
  - `npm run format:fix`: Auto-fix formatting
- Max warnings: 0 (fail on warnings)

**Acceptance Criteria:**

- Pre-commit hooks block bad commits
- Auto-fix resolves 95%+ of issues
- Configuration covers all file types
- CI/CD integration ready

---

#### F18: IDE Platform Support

**Priority:** P0 (Critical) **Description:** Multi-IDE support with
platform-specific optimizations

**Requirements:**

- **Supported IDEs**:
  1. Claude Code (primary)
  2. Windsurf
  3. Cursor
  4. Cline
  5. Qwen
- **Platform-Specific Features**:
  - Claude Code: Sub-agent installation (optional)
  - Windsurf: Cascade-specific configurations
  - Each IDE: Custom injection patterns
- **Installation Detection**:
  - Prompt user for IDE selection
  - Inject IDE-specific code into workflows
  - Store selection in config

**Acceptance Criteria:**

- All 5 IDEs install successfully
- Platform-specific features work correctly
- No IDE-specific code breaks other platforms
- Documentation covers each IDE

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Agent loading: <2 seconds
- Workflow execution: <5 seconds for simple workflows
- CLI installation: <60 seconds for 3 modules
- Bundle generation: <30 seconds for all agents
- Status checks: <1 second

### 5.2 Scalability

- Support projects with 100+ stories (Level 4)
- Handle 50+ modules in ecosystem
- Manifest files scale to 500+ entries
- Large PRD/GDD documents (50+ pages)

### 5.3 Reliability

- 99.5% uptime for core features
- Atomic file operations (no partial writes)
- Graceful degradation on errors
- State recovery after crashes

### 5.4 Usability

- Installation requires <5 user inputs
- Workflows provide clear next steps
- Error messages actionable and user-friendly
- Documentation coverage: 100%

### 5.5 Maintainability

- All configuration in YAML/Markdown (no code)
- Modular architecture (easy to extend)
- Conventional commits for git history
- Automated testing for core features

### 5.6 Security

- No credential storage in configs
- Validate all user inputs
- Sanitize file paths (prevent directory traversal)
- No arbitrary code execution

### 5.7 Compatibility

- Node.js >=20.0.0
- MacOS, Linux, Windows
- Git required for installation
- All UTF-8 text files

---

## 6. Technical Constraints

### 6.1 Technology Stack

- **Runtime**: Node.js 20+
- **Configuration**: YAML (js-yaml parser), Markdown, XML
- **CLI Framework**: Commander.js
- **Interactive Prompts**: Inquirer.js
- **File Operations**: fs-extra
- **Linting**: ESLint 9.x with yaml-eslint-parser
- **Formatting**: Prettier 3.x
- **Git Hooks**: Husky + lint-staged

### 6.2 File Structure Conventions

- All modules install to `madace/` folder
- Agent files: `*.agent.yaml`
- Workflow configs: `workflow.yaml`
- Templates in `templates/` subdirectories
- Documentation: `README.md` per workflow/module

### 6.3 Naming Conventions

- Workflows: kebab-case (`brainstorm-project`)
- Agents: role names (`pm`, `analyst`, `architect`)
- Commands: asterisk prefix (`*plan-project`)
- Config keys: snake_case (`project_name`)

---

## 7. User Stories (Epics Summary)

### Epic 1: Core Framework Foundation

- **Stories**: 12
- **Scope**: Agent system, workflow engine, configuration management
- **Priority**: P0

### Epic 2: CLI & Installation System

- **Stories**: 8
- **Scope**: Interactive installer, module management, platform detection
- **Priority**: P0

### Epic 3: MAM Phase 1-2 (Analysis & Planning)

- **Stories**: 10
- **Scope**: Brainstorming, research, scale-adaptive planning
- **Priority**: P0

### Epic 4: MAM Phase 3-4 (Solutioning & Implementation)

- **Stories**: 15
- **Scope**: Architecture, JIT tech specs, story state machine
- **Priority**: P0

### Epic 5: MAB (Agent & Workflow Creation)

- **Stories**: 8
- **Scope**: Create-agent, create-workflow, create-module
- **Priority**: P1

### Epic 6: CIS (Creative Intelligence Suite)

- **Stories**: 6
- **Scope**: 5 creativity agents and workflows
- **Priority**: P2

### Epic 7: Build & Distribution Tools

- **Stories**: 5
- **Scope**: Web bundler, flattener, validation
- **Priority**: P2

### Epic 8: Code Quality & DevEx

- **Stories**: 4
- **Scope**: Linting, formatting, pre-commit hooks, IDE support
- **Priority**: P1

### Epic 9: Documentation & Community

- **Stories**: 6
- **Scope**: README files, contribution guide, Discord integration
- **Priority**: P1

**Total Estimated Stories:** 74 (Level 4 project)

---

## 8. Dependencies & Integrations

### 8.1 External Dependencies

- **Node.js Packages**:
  - `@kayvan/markdown-tree-parser`: Parse markdown trees
  - `boxen`, `chalk`, `figlet`, `ora`: CLI UI
  - `cli-table3`: Table formatting
  - `commander`: CLI framework
  - `csv-parse`: Manifest parsing
  - `fs-extra`: File operations
  - `glob`: File pattern matching
  - `ignore`: .gitignore parsing
  - `inquirer`: Interactive prompts
  - `js-yaml`: YAML parsing
  - `semver`: Version management
  - `wrap-ansi`: Text wrapping
  - `xml2js`: XML parsing

### 8.2 Optional Integrations (via MCP Tools)

- Chrome Official MCP
- Playwright
- Context 7
- Tavily (search)
- Perplexity (research)
- Jira (project management)
- Trello (project management)

### 8.3 IDE Integrations

- Claude Code (official support)
- Windsurf
- Cursor
- Cline
- Qwen

---

## 9. Risks & Mitigations

### 9.1 Technical Risks

| Risk                                      | Impact | Probability | Mitigation                                            |
| ----------------------------------------- | ------ | ----------- | ----------------------------------------------------- |
| YAML parsing errors break workflows       | High   | Medium      | Comprehensive schema validation, clear error messages |
| Large context windows overwhelm AI models | High   | Medium      | Story-context reduces context size, JIT tech specs    |
| File system race conditions               | Medium | Low         | Atomic writes, file locking patterns                  |
| Cross-platform path issues                | Medium | Medium      | Use `path.join()`, test on all OSes                   |
| Module conflicts (name collisions)        | Medium | Low         | Namespace modules, version manifests                  |

### 9.2 User Experience Risks

| Risk                                   | Impact | Probability | Mitigation                                                |
| -------------------------------------- | ------ | ----------- | --------------------------------------------------------- |
| Users skip documentation and fail      | High   | High        | workflow-status as universal entry point, inline guidance |
| Installer too complex                  | Medium | Medium      | Default values, contextual help, validation               |
| Brownfield projects lack documentation | High   | Medium      | Brownfield-analysis workflow (Phase 2 validation)         |
| State machine confusion                | Medium | Medium      | Clear status displays, single source of truth             |
| Module incompatibilities               | Medium | Low         | Versioning, compatibility matrix                          |

### 9.3 Ecosystem Risks

| Risk                                | Impact | Probability | Mitigation                                                |
| ----------------------------------- | ------ | ----------- | --------------------------------------------------------- |
| Community modules low quality       | Medium | Medium      | Review process, quality guidelines, examples              |
| Competing frameworks fragment users | Low    | High        | Focus on unique value (human amplification)               |
| AI model changes break prompts      | High   | Medium      | Version prompts, test across models, graceful degradation |

---

## 10. Success Criteria & KPIs

### 10.1 Launch Criteria (Beta Release)

- [ ] All P0 features complete and tested
- [ ] 3 modules installed successfully (Core, MAM, MAB)
- [ ] 5 IDE platforms supported
- [ ] 100% documentation coverage for core workflows
- [ ] Zero critical bugs in last 2 weeks
- [ ] 10+ alpha testers provide positive feedback
- [ ] Pre-commit hooks working across platforms

### 10.2 Post-Launch KPIs (6 months)

- **Adoption**: 5,000+ npm downloads
- **Engagement**: 500+ Discord members
- **Quality**: <5% installation failure rate
- **Documentation**: 90%+ users rate docs "helpful" or "very helpful"
- **Community**: 5+ community-contributed modules
- **Retention**: 60%+ of installers use framework 30+ days later

### 10.3 Long-Term KPIs (12 months)

- **Market Leadership**: Top 3 human-AI collaboration framework on GitHub
  (stars)
- **Ecosystem**: 15+ modules, 50+ community agents
- **Enterprise**: 10+ companies using in production
- **Education**: 3+ universities teaching with MADACE-CORE
- **Platform Support**: 8+ IDE integrations

---

## 11. Release Plan

### 11.1 v1.0-alpha (Q1 2026)

- **Focus**: Core framework, MAM, MAB, CIS basic functionality
- **Audience**: Early adopters, testers
- **Features**: All P0 + select P1
- **Known Issues**: Web bundles not fully functional, sub-agents experimental
- **Duration**: 6-8 weeks

### 11.2 v1.0-beta (Q2 2026)

- **Focus**: Stability, documentation, web bundles
- **Audience**: General developers
- **Features**: All P0, P1, select P2
- **Improvements**:
  - Fully functional web bundles
  - Stable sub-agent system
  - Brownfield-analysis workflow
  - Multi-workflow orchestration
  - Progress dashboards
- **Duration**: 8-12 weeks

### 11.3 v1.0 (Stable - Q3 2026)

- **Focus**: Production-ready, ecosystem launch
- **Audience**: All users, enterprises
- **Features**: All P0, P1, P2
- **New**:
  - Community module repository
  - Enterprise features (team coordination)
  - Advanced integrations (Jira, etc.)
  - AI-assisted retrospectives
  - Automated story sizing

---

## 12. Open Questions

### 12.1 Technical

1. **Brownfield Analysis**: What specific codebase analysis techniques for
   undocumented projects?
2. **Multi-Workflow Orchestration**: Should it be fully automated or
   user-guided?
3. **Web Bundle Limitations**: What features are fundamentally IDE-only?
4. **Cross-Project Learning**: How to share patterns between projects/teams?

### 12.2 User Experience

1. **Default Language**: Should installer default to system locale?
2. **Party Mode**: Is group chat the best UX for multi-agent scenarios?
3. **Story Approval**: Should users approve every story or batch approve?
4. **Epic Sizing**: Should AI predict epic size or require user input?

### 12.3 Ecosystem

1. **Module Licensing**: Should modules be MIT or allow other licenses?
2. **Version Compatibility**: How to handle breaking changes across modules?
3. **Quality Standards**: What are minimum requirements for community modules?
4. **Monetization**: Should there be a premium module marketplace?

---

## 13. Terminology & Branding

### 13.1 MADACE Acronym

**MADACE** = **M**ethodology for **A**I-**D**riven **A**gile **C**ollaboration
**E**ngine

### 13.2 Module Naming

- **MAM**: MADACE Method (Agile Development Module)
- **MAB**: MADACE Builder (Agent/Workflow Creation Module)
- **CIS**: Creative Intelligence Suite (Brainstorming & Innovation Module)

### 13.3 File & Folder Conventions

- Installation folder: `madace/`
- Core agent: `madace-master.agent.yaml`
- Workflow status: `mam-workflow-status.md`
- CLI binary: `madace`
- Package name: `madace-method`

### 13.4 Command Patterns

- Install: `madace install`
- Status: `madace status`
- Workflows: `madace [agent] [workflow-name]`
- Examples:
  - `madace pm plan-project`
  - `madace analyst brainstorm-project`
  - `madace architect solution-architecture`

---

## 14. Appendices

### Appendix A: Glossary

- **MADACE-CORE**: Methodology for AI-Driven Agile Collaboration Engine
  (framework name)
- **Module**: Self-contained package of agents, workflows, tasks
- **Agent**: YAML-defined AI persona with role, behaviors, commands
- **Workflow**: YAML-configured multi-step process with templates
- **Scale Level**: Complexity rating (0-4) determining documentation needs
- **JIT**: Just-In-Time (create tech specs per epic during implementation)
- **State Machine**: Four-state story lifecycle (BACKLOG/TODO/IN PROGRESS/DONE)
- **MADACE Master**: Core orchestrator agent
- **Party Mode**: Group chat simulation with multiple agents
- **MAM**: MADACE Method (agile development module)
- **MAB**: MADACE Builder (agent/workflow creation module)

### Appendix B: Key Architecture Patterns

**Human Amplification Philosophy:**

- AI agents as facilitators, not executors
- Questions over answers
- Frameworks over solutions
- Reflection over direct action
- Guided discovery over instruction

**Scale-Adaptive Approach:**

- Level 0-1: Minimal documentation (tech-spec only)
- Level 2: Focused PRD
- Level 3-4: Full enterprise documentation
- Prevents over-engineering on small projects
- Ensures rigor on large projects

**Just-In-Time Design:**

- Architecture created once upfront (Phase 3)
- Tech specs created per epic during implementation
- Incorporates learnings from previous epics
- Reduces waste from over-planning

**Story State Machine:**

- Single source of truth (workflow status file)
- No searching for "next story"
- Clear state transitions
- Atomic updates

### Appendix C: Technology Decisions

**Why YAML for Configuration:**

- Human-readable and editable
- Standardized parsing (js-yaml)
- Natural for nested structures
- IDE support for validation

**Why Natural Language (Markdown/XML):**

- AI models excel at natural language
- Human-friendly for customization
- Version control friendly
- No compilation step

**Why Node.js:**

- Universal platform (CLI + potential web)
- Rich ecosystem for file operations
- JavaScript familiarity for contributors
- Async/await for workflow orchestration

**Why Module Architecture:**

- Separates concerns by domain
- Enables community contributions
- Allows selective installation
- Supports cross-module references

### Appendix D: Migration from Existing Systems

**For Teams Using BMAD-METHOD:** MADACE-METHOD is a spiritual successor but not
directly compatible. Key differences:

- Rebranded terminology (MADACE vs BMAD, MAM vs BMM, etc.)
- Fresh codebase architecture
- Enhanced module system
- Improved CLI experience

**Migration Path:**

1. Complete current BMAD projects before switching
2. Install MADACE in new project directories
3. Manually port custom agents/workflows using MAB tools
4. Both systems can coexist on same machine

---

## Document Control

**Approval Chain:**

1. Product Owner: [Name]
2. Tech Lead: [Name]
3. Architect: [Name]
4. Stakeholders: [Names]

**Change Log:** | Version | Date | Author | Changes |
|---------|------|--------|---------| | 1.0 | 2025-10-15 | Claude Code | Initial
PRD for MADACE-CORE framework |

**Next Reviews:**

- Technical Review: [Date]
- User Testing Plan Review: [Date]
- Architecture Review: [Date]
- Final Approval: [Date]

---

_This PRD is a living document and will be updated as the MADACE-METHOD project
evolves through alpha and beta phases._
