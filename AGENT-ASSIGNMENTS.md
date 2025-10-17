# MADACE-METHOD: Agent Assignments & Component Breakdown

**Project:** MADACE-METHOD Framework Implementation **Scale Level:** Level 4 (74
stories across 9 epics) **Document Version:** 2.0 **Created:** 2025-10-15 **Last
Updated:** 2025-10-17 **Status:** ✅ v1.0-alpha.1 COMPLETE (100%)

---

## Project Overview

This document defines the component breakdown and specialized sub-agent
assignments for implementing the MADACE-METHOD framework. Following the MADACE
Method principles, we're organizing this Level 4 project into manageable epics,
each handled by a specialized sub-agent with domain expertise.

## Implementation Progress

**Overall Status:** 74/74 stories complete (100%) ✅

**v1.0-alpha.1 Released:** 2025-10-17

**Completed Epics (9/9):**

- ✅ Epic 1: Core Framework Foundation (12/12 stories) - Complete 2025-10-17
- ✅ Epic 2: CLI & Installation System (8/8 stories) - Complete 2025-10-17
- ✅ Epic 3: MAM Phase 1-2 - Analysis & Planning (10/10 stories) - Complete
  2025-10-17
- ✅ Epic 4: MAM Phase 3-4 - Solutioning & Implementation (15/15 stories) -
  Complete 2025-10-17
- ✅ Epic 5: MAB - Agent & Workflow Creation (8/8 stories) - Complete 2025-10-17
- ✅ Epic 6: CIS - Creative Intelligence Suite (6/6 stories) - Complete
  2025-10-17
- ✅ Epic 7: Build & Distribution Tools (5/5 stories) - Complete 2025-10-17
- ✅ Epic 8: Code Quality & DevEx (4/4 stories) - Complete 2025-10-17
- ✅ Epic 9: Documentation & Community (6/6 stories) - Complete 2025-10-17

**All Features Implemented:**

- Core agent loading and workflow execution engine
- Interactive CLI installer with module selection
- Scale-adaptive planning (Level 0-4)
- Story state machine (BACKLOG → TODO → IN PROGRESS → DONE)
- Dynamic context injection (XML-based)
- Agent, workflow, and module creation tools (MAB)
- 5 creativity frameworks (CIS)
- Web bundle generation (experimental)
- Code quality enforcement (ESLint 9.x + Prettier 3.x)
- Pre-commit hooks (Husky + lint-staged)
- CI/CD pipeline (GitHub Actions)
- Comprehensive documentation

---

## Epic Breakdown & Agent Assignments

### Epic 1: Core Framework Foundation (12 stories) ✅ COMPLETE

**Priority:** P0 (Critical) **Estimated Story Points:** 60 **Agent:** **Core
Framework Specialist** **Status:** COMPLETE (2025-10-17)

#### Responsibilities:

- Agent loading system (YAML parsing, validation, runtime loading)
- Workflow execution engine (YAML workflows, template processing, state
  tracking)
- Configuration management (config.yaml, variable interpolation, validation)
- Manifest system (agent-manifest.csv, workflow-manifest.csv, task-manifest.csv)

#### Key Technologies:

- js-yaml (YAML parsing)
- Node.js fs-extra (file operations)
- Template variable substitution
- CSV parsing (csv-parse)

#### Stories:

1. F1: Agent YAML parser and validator
2. F2: Agent runtime loading system
3. F3: Agent persona execution context
4. F4: Workflow YAML parser and executor
5. F5: Template rendering engine with variable substitution
6. F6: Configuration loading and validation system
7. F7: Manifest management (create, read, update)
8. F8: Variable interpolation system ({user_name}, {project-root}, etc.)
9. F9: Critical actions execution on agent load
10. F10: Menu system with command triggers
11. F11: Sub-workflow support
12. F12: Workflow state persistence

#### Key Files:

- `scripts/core/agent-loader.js`
- `scripts/core/workflow-engine.js`
- `scripts/core/config-manager.js`
- `scripts/core/manifest-manager.js`
- `scripts/core/template-engine.js`

---

### Epic 2: CLI & Installation System (8 stories) ✅ COMPLETE

**Priority:** P0 (Critical) **Estimated Story Points:** 40 **Agent:** **CLI &
Installer Specialist** **Status:** COMPLETE (2025-10-17)

#### Responsibilities:

- Interactive CLI installer with Inquirer.js prompts
- Module selection and installation logic
- Platform detection (MacOS, Linux, Windows)
- IDE-specific feature injection
- Module manifest tracking
- Uninstallation and update logic

#### Key Technologies:

- commander (CLI framework)
- inquirer (interactive prompts)
- chalk, boxen, ora (CLI UI)
- fs-extra (file copying)
- Platform detection

#### Stories:

1. F13: CLI binary setup with commander
2. F14: Interactive installer with module selection
3. F15: Platform detection and validation
4. F16: IDE selection and platform-specific injection
5. F17: Module copying and file structure creation
6. F18: Config generation from user prompts
7. F19: Status command (show installation state)
8. F20: Uninstall and update commands

#### Key Files:

- `scripts/cli/madace.js`
- `scripts/cli/installer.js`
- `scripts/cli/platform-detector.js`
- `scripts/cli/module-installer.js`

#### Commands to Implement:

```bash
madace install
madace status
madace list
madace uninstall
madace update
```

---

### Epic 3: MAM Phase 1-2 (Analysis & Planning) (10 stories) ✅ COMPLETE

**Priority:** P0 (Critical) **Estimated Story Points:** 50 **Agent:** **Planning
& Analysis Specialist** **Status:** COMPLETE (2025-10-17)

#### Responsibilities:

- Scale-adaptive planning router (Level 0-4 detection)
- PRD/GDD generation workflows
- Tech-spec generation
- Epic breakdown
- Project type detection (web, mobile, game, backend)
- Greenfield vs brownfield detection

#### Key Technologies:

- Markdown template generation
- YAML workflow execution
- Interactive Q&A prompts

#### Stories:

1. F21: Scale level assessment Q&A workflow
2. F22: Project type detection
3. F23: PRD template and generation (Level 2-4)
4. F24: GDD template and generation (game projects)
5. F25: Tech-spec template and generation
6. F26: Epic breakdown from requirements
7. F27: Story scaffolding from epics
8. F28: Workflow-status.md initialization
9. F29: Level 0-1 fast-track workflows
10. F30: Brainstorming and research workflows

#### Key Files:

- `madace/mam/workflows/plan-project/workflow.yaml`
- `madace/mam/workflows/plan-project/templates/PRD.md`
- `madace/mam/workflows/plan-project/templates/GDD.md`
- `madace/mam/workflows/plan-project/templates/tech-spec.md`
- `madace/mam/workflows/plan-project/templates/Epics.md`

#### Output Documents:

- PRD.md (Product Requirements Document)
- GDD.md (Game Design Document)
- tech-spec.md
- Epics.md
- mam-workflow-status.md (initialized)

---

### Epic 4: MAM Phase 3-4 (Solitioning & Implementation) (15 stories) ✅ COMPLETE

**Priority:** P0 (Critical) **Estimated Story Points:** 75 **Agent:**
**Implementation & State Machine Specialist** **Status:** COMPLETE (2025-10-17)

#### Responsibilities:

- Story state machine (BACKLOG → TODO → IN PROGRESS → DONE)
- Story creation and drafting
- Story state transitions
- Story context generation (XML)
- Architecture workflow (solution-architecture)
- JIT tech-spec generation (per epic)
- Retrospective workflow

#### Key Technologies:

- State file parsing and updates
- XML generation (context injection)
- Atomic file operations
- Story template rendering

#### Stories:

1. F31: Story state machine implementation
2. F32: BACKLOG population from Epics
3. F33: TODO story selection logic (one at a time)
4. F34: Create-story workflow (draft from TODO)
5. F35: Story-ready workflow (TODO → IN PROGRESS)
6. F36: Story status validation
7. F37: Story-context workflow (XML generation)
8. F38: Dev-story workflow integration
9. F39: Story-approved workflow (IN PROGRESS → DONE)
10. F40: Solution-architecture workflow
11. F41: JIT tech-spec workflow (per epic)
12. F42: Retrospective workflow
13. F43: Workflow-status display and navigation
14. F44: Story file template and rendering
15. F45: State machine validation and recovery

#### Key Files:

- `scripts/core/state-machine.js`
- `madace/mam/workflows/create-story/workflow.yaml`
- `madace/mam/workflows/story-ready/workflow.yaml`
- `madace/mam/workflows/story-context/workflow.yaml`
- `madace/mam/workflows/story-approved/workflow.yaml`
- `madace/mam/workflows/solution-architecture/workflow.yaml`

#### Critical Rules:

- Only ONE story in TODO at a time
- Only ONE story in IN PROGRESS at a time
- Never search for stories—read from status file
- Atomic state transitions

---

### Epic 5: MAB (Agent & Workflow Creation) (8 stories) ✅ COMPLETE

**Priority:** P1 (High) **Estimated Story Points:** 40 **Agent:** **Builder &
Scaffolding Specialist** **Status:** COMPLETE (2025-10-17)

#### Responsibilities:

- Create-agent workflow (YAML agent generation)
- Create-workflow workflow (workflow scaffolding)
- Create-module workflow (module structure)
- Template generation for agents and workflows
- Validation of created components
- Documentation generation

#### Key Technologies:

- YAML generation
- Template scaffolding
- File structure creation
- Interactive Q&A

#### Stories:

1. F46: Agent YAML template and generator
2. F47: Create-agent Q&A workflow
3. F48: Agent validation after creation
4. F49: Workflow YAML template and generator
5. F50: Create-workflow scaffolding
6. F51: Module structure template
7. F52: Create-module workflow
8. F53: README generation for agents/workflows/modules

#### Key Files:

- `madace/mab/workflows/create-agent/workflow.yaml`
- `madace/mab/workflows/create-workflow/workflow.yaml`
- `madace/mab/workflows/create-module/workflow.yaml`
- `madace/mab/templates/agent-template.yaml`
- `madace/mab/templates/workflow-template.yaml`

---

### Epic 6: CIS (Creative Intelligence Suite) (6 stories) ✅ COMPLETE

**Priority:** P2 (Medium) **Estimated Story Points:** 30 **Agent:** **Creativity
& Brainstorming Specialist** **Status:** COMPLETE (2025-10-17)

#### Responsibilities:

- 5 creativity agent definitions
- Brainstorming workflow templates
- Structured creativity frameworks (SCAMPER, Six Thinking Hats, etc.)
- Integration with MAM brainstorming
- Standalone workflow support

#### Key Technologies:

- Agent YAML definitions
- Brainstorming templates
- Framework-specific workflows

#### Stories:

1. F54: Innovation Catalyst agent and workflows
2. F55: Problem Solver agent and workflows
3. F56: Creative Strategist agent and workflows
4. F57: Ideation Facilitator agent and workflows
5. F58: Insight Generator agent and workflows
6. F59: Cross-module workflow integration

#### Key Files:

- `madace/cis/agents/innovation-catalyst.agent.yaml`
- `madace/cis/agents/problem-solver.agent.yaml`
- `madace/cis/agents/creative-strategist.agent.yaml`
- `madace/cis/agents/ideation-facilitator.agent.yaml`
- `madace/cis/agents/insight-generator.agent.yaml`

---

### Epic 7: Build & Distribution Tools (5 stories) ✅ COMPLETE

**Priority:** P2 (Medium) **Estimated Story Points:** 25 **Agent:** **Build &
Bundle Specialist** **Status:** COMPLETE (2025-10-17)

#### Responsibilities:

- Web bundle generation (ChatGPT/Gemini)
- Code flattening for analysis
- Bundle validation
- Markdown formatting for bundles
- Version tracking in bundles

#### Key Technologies:

- Markdown generation
- File concatenation
- Bundle formatting
- Validation logic

#### Stories:

1. F60: Bundle generation logic
2. F61: ChatGPT-specific bundle formatting
3. F62: Gemini-specific bundle formatting
4. F63: Bundle validation system
5. F64: Code flattener implementation

#### Key Files:

- `scripts/build/bundler.js`
- `scripts/build/flattener.js`
- `scripts/build/validator.js`

#### Commands to Implement:

```bash
npm run bundle
npm run rebundle
npm run validate:bundles
npm run flatten
```

---

### Epic 8: Code Quality & DevEx (4 stories) ✅ COMPLETE

**Priority:** P1 (High) **Estimated Story Points:** 20 **Agent:** **Quality &
Tooling Specialist** **Status:** COMPLETE (2025-10-17)

#### Responsibilities:

- ESLint configuration and rules
- Prettier configuration
- Husky pre-commit hooks
- Lint-staged configuration
- IDE-specific integrations
- YAML linting

#### Key Technologies:

- ESLint 9.x with yaml-eslint-parser
- Prettier 3.x
- Husky
- lint-staged

#### Stories:

1. F65: ESLint configuration for JS and YAML
2. F66: Prettier configuration
3. F67: Husky and lint-staged setup
4. F68: IDE-specific configuration files

#### Key Files:

- `.eslintrc.js` or `eslint.config.js`
- `.prettierrc`
- `.husky/pre-commit`
- `.lintstagedrc`

---

### Epic 9: Documentation & Community (6 stories) ✅ COMPLETE

**Priority:** P1 (High) **Estimated Story Points:** 30 **Agent:**
**Documentation Specialist** **Status:** COMPLETE (2025-10-17)

#### Responsibilities:

- README maintenance
- CLAUDE.md updates
- PRD maintenance
- Terminology reference
- CONTRIBUTING.md
- CHANGELOG.md
- Module-specific documentation

#### Key Technologies:

- Markdown
- Documentation structure
- Examples and tutorials

#### Stories:

1. F69: README.md comprehensive guide
2. F70: CLAUDE.md for AI assistants
3. F71: TERMINOLOGY-REFERENCE.md
4. F72: Module documentation templates
5. F73: CONTRIBUTING.md guidelines
6. F74: CHANGELOG.md automation

#### Key Files:

- `README.md`
- `CLAUDE.md`
- `TERMINOLOGY-REFERENCE.md`
- `PRD-MADACE-CORE.md`
- `PRD-MADACE-FEATURES-TO-MERGE.md`
- `CONTRIBUTING.md`
- `CHANGELOG.md`

---

## Sub-Agent Coordination Strategy

### Master Coordinator Agent

**Role:** Orchestrates all sub-agents and ensures consistency

**Responsibilities:**

- Coordinates work across all epics
- Ensures architectural consistency
- Manages dependencies between epics
- Reviews cross-epic integrations
- Maintains overall project coherence

### Epic Dependencies

```
Epic 1 (Core Framework) ← Must complete FIRST
    ↓
Epic 2 (CLI & Installer) ← Depends on Epic 1
    ↓
Epic 3 (MAM Phase 1-2) ← Depends on Epic 1
    ↓
Epic 4 (MAM Phase 3-4) ← Depends on Epic 3
    ↓
Epic 5 (MAB) ← Depends on Epic 1
    ↓
Epic 6 (CIS) ← Depends on Epic 1
    ↓
Epic 7 (Build Tools) ← Depends on Epic 1, 3, 4, 5, 6
    ↓
Epic 8 (Code Quality) ← Parallel with all
    ↓
Epic 9 (Documentation) ← Continuous throughout
```

### Communication Protocol

**Sub-Agent Check-Ins:**

1. **Daily Status**: Each sub-agent reports progress on assigned stories
2. **Blocker Reporting**: Immediate escalation if blocked by another epic
3. **Integration Points**: Coordinate when epics intersect
4. **Code Reviews**: Cross-review between related epics (e.g., Epic 1 ↔ Epic 2)

**Handoff Protocol:**

- Epic 1 → Epic 2: Core framework APIs documented
- Epic 3 → Epic 4: Workflow status file format finalized
- Epic 1 → Epic 5: Agent/workflow schemas documented
- All → Epic 7: Bundle requirements defined

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-3)

**Focus:** Epic 1 (Core Framework Foundation) **Agent:** Core Framework
Specialist **Goal:** Functional agent loading and workflow execution

**Deliverables:**

- Agent YAML parser working
- Workflow execution engine functional
- Configuration system complete
- Basic manifest management

### Phase 2: CLI & Planning (Weeks 4-6)

**Focus:** Epic 2 (CLI) + Epic 3 (MAM Phase 1-2) **Agents:** CLI Specialist +
Planning Specialist **Goal:** Installable system with planning workflows

**Deliverables:**

- `madace install` command working
- PRD/GDD generation functional
- Scale-adaptive routing working
- Epic breakdown operational

### Phase 3: Implementation Workflows (Weeks 7-9)

**Focus:** Epic 4 (MAM Phase 3-4) **Agent:** Implementation & State Machine
Specialist **Goal:** Complete story lifecycle management

**Deliverables:**

- Story state machine functional
- Story creation workflows working
- Context injection operational
- Retrospective workflow complete

### Phase 4: Builder & Extensions (Weeks 10-11)

**Focus:** Epic 5 (MAB) + Epic 6 (CIS) **Agents:** Builder Specialist +
Creativity Specialist **Goal:** Module creation and creativity tools

**Deliverables:**

- Agent creation workflow
- Workflow scaffolding
- Module creation
- Creativity agents defined

### Phase 5: Build & Quality (Week 12)

**Focus:** Epic 7 (Build Tools) + Epic 8 (Code Quality) **Agents:** Build
Specialist + Quality Specialist **Goal:** Production-ready distribution

**Deliverables:**

- Web bundles generating
- Code quality enforced
- Pre-commit hooks working
- Bundle validation passing

### Phase 6: Documentation & Polish (Ongoing)

**Focus:** Epic 9 (Documentation) **Agent:** Documentation Specialist **Goal:**
Comprehensive documentation

**Deliverables:**

- All documentation up-to-date
- Examples tested and working
- Contributing guidelines clear
- Changelog maintained

---

## Sub-Agent Task Assignments

### Week 1-2: Sprint 1

**Core Framework Specialist:**

- Story F1: Agent YAML parser
- Story F2: Agent runtime loading
- Story F3: Agent persona execution

### Week 3-4: Sprint 2

**Core Framework Specialist:**

- Story F4: Workflow YAML parser
- Story F5: Template rendering
- Story F6: Configuration system

**CLI Specialist:** (Starting Week 4)

- Story F13: CLI binary setup
- Story F14: Interactive installer

### Week 5-6: Sprint 3

**Core Framework Specialist:**

- Story F7-F12: Manifests, variables, sub-workflows

**CLI Specialist:**

- Story F15-F20: Platform detection, module installation, commands

**Planning Specialist:** (Starting Week 5)

- Story F21-F23: Scale assessment, PRD generation

### Week 7-8: Sprint 4

**Planning Specialist:**

- Story F24-F30: GDD, tech-spec, epic breakdown

**Implementation Specialist:** (Starting Week 7)

- Story F31-F35: State machine, story creation

### Week 9-10: Sprint 5

**Implementation Specialist:**

- Story F36-F45: Story workflows, context, architecture

### Week 11: Sprint 6

**Builder Specialist:**

- Story F46-F53: Agent/workflow/module creation

**Creativity Specialist:**

- Story F54-F59: CIS agents and workflows

### Week 12: Sprint 7

**Build Specialist:**

- Story F60-F64: Bundling and validation

**Quality Specialist:**

- Story F65-F68: Linting, formatting, hooks

**Documentation Specialist:** (Continuous)

- Story F69-F74: All documentation

---

## Success Metrics

### Per Epic:

- All stories completed and tested
- Integration tests passing
- Documentation complete
- Code review approved by Master Coordinator

### Overall Project:

- 74 stories completed across 9 epics
- All workflows functional end-to-end
- Installation success rate >95%
- Documentation coverage 100%
- Zero critical bugs
- Ready for v1.0-alpha release

---

## Next Steps

1. **Assign Sub-Agents:** Recruit/configure specialized sub-agents for each epic
2. **Set Up Coordination:** Establish daily check-in protocol
3. **Begin Sprint 1:** Core Framework Specialist starts on Epic 1
4. **Track Progress:** Use mam-workflow-status.md for this project itself
5. **Review & Adjust:** Weekly reviews with Master Coordinator

---

## Agent Contact Matrix

| Epic   | Agent                          | Primary Focus           | Communication Channel |
| ------ | ------------------------------ | ----------------------- | --------------------- |
| Epic 1 | Core Framework Specialist      | Agent/Workflow Engine   | #core-framework       |
| Epic 2 | CLI & Installer Specialist     | Installation System     | #cli-install          |
| Epic 3 | Planning & Analysis Specialist | PRD/Planning Workflows  | #planning             |
| Epic 4 | Implementation Specialist      | Story State Machine     | #implementation       |
| Epic 5 | Builder Specialist             | Agent/Workflow Creation | #builder              |
| Epic 6 | Creativity Specialist          | CIS Agents              | #creativity           |
| Epic 7 | Build Specialist               | Web Bundles             | #build-tools          |
| Epic 8 | Quality Specialist             | Linting/Formatting      | #code-quality         |
| Epic 9 | Documentation Specialist       | All Documentation       | #documentation        |
| -      | Master Coordinator             | Overall Orchestration   | #coordination         |

---

_This document follows the MADACE Method for Level 4 project organization. Each
epic is sized for manageable implementation by a specialized sub-agent while
maintaining overall project coherence through the Master Coordinator._

**Status:** Ready for sub-agent assignment and Sprint 1 kickoff
