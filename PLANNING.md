# MADACE-METHOD v2.0 - Modularization Planning

**Version:** v2.0-planning **Last Updated:** 2025-10-17 **Document Type:**
Product Requirements Document (PRD) **Project Scale:** Level 4 (50-80+ stories)
**Phase:** Planning (Phase 2)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Vision](#project-vision)
3. [Scale Assessment](#scale-assessment)
4. [Architecture Overview](#architecture-overview)
5. [Package Structure](#package-structure)
6. [Epics](#epics)
7. [Story Breakdown](#story-breakdown)
8. [Dependencies](#dependencies)
9. [Migration Strategy](#migration-strategy)
10. [Success Criteria](#success-criteria)
11. [Timeline](#timeline)

---

## Executive Summary

### What We're Building

MADACE-METHOD v2.0 is a complete architectural transformation from a monolithic
framework to a **modular, package-based ecosystem**. This refactoring enables:

- **Independent package versioning** - Each module evolves at its own pace
- **Selective installation** - Users install only what they need
- **Third-party extensions** - Community can publish compatible packages
- **Better testing** - Isolated test suites per package
- **Clearer boundaries** - Well-defined interfaces between components
- **npm ecosystem integration** - Standard package management

### Why Now?

Current v1.0-alpha architecture has grown to include:

- 7 core components (agent-loader, agent-runtime, workflow-engine, etc.)
- 4 modules (Core, MAM, MAB, CIS)
- 5+ agents per module
- 25+ workflows
- Build tools, CLI, installer systems

This complexity warrants modularization to:

1. **Reduce coupling** - Core changes shouldn't break MAM/MAB/CIS
2. **Enable ecosystem** - Community modules as independent packages
3. **Improve maintainability** - Smaller, focused codebases
4. **Support enterprise use** - Private package hosting
5. **Accelerate development** - Parallel work on independent packages

### Project Type

**Architectural Refactoring** - Greenfield package structure with brownfield
code migration

### Scale Level: 4

- **Estimated Stories**: 50-80+
- **Estimated Duration**: 12-16 weeks (Q2-Q3 2026)
- **Team Size**: 2-4 developers
- **Complexity**: High (breaking changes, dependency management, migration)

---

## Project Vision

### North Star

> "MADACE-METHOD v2.0 is a composable, package-based framework where every
> component is independently installable, versionable, and extensible."

### Core Principles

1. **Composability** - Packages work together but don't require each other
2. **Independence** - Each package has its own repo, tests, and versioning
3. **Backward Compatibility** - v1.x users can migrate incrementally
4. **Standard Practices** - Follow npm ecosystem conventions
5. **Clear Contracts** - Well-defined APIs between packages

### User Stories

**As a framework user**, I want to install only the packages I need, so I don't
bloat my project with unused code.

**As a module developer**, I want to publish my custom module as an npm package,
so others can easily install it.

**As a core maintainer**, I want to version packages independently, so bug fixes
don't require releasing the entire framework.

**As an enterprise user**, I want to host private MADACE packages, so I can
customize the framework without forking.

**As a CI/CD engineer**, I want packages with clear dependencies, so I can cache
and optimize builds effectively.

---

## Scale Assessment

### Assessment Process (MAM Methodology)

Following the MADACE-Method scale-adaptive planning:

**Questions Asked:**

1. Is this a new project or existing codebase? → **Existing (brownfield
   refactoring)**
2. How many features/changes? → **10+ major architectural changes**
3. Team size? → **2-4 developers**
4. Time constraints? → **12-16 weeks target**
5. Architectural changes? → **Complete restructuring**

**Complexity Indicators:**

- ✅ Multiple subsystems affected (core, modules, CLI, build)
- ✅ Breaking changes to public APIs
- ✅ Cross-package dependency graph
- ✅ Migration tooling required
- ✅ Documentation overhaul needed
- ✅ Backward compatibility considerations

### Level 4 Justification

**Story Count**: 50-80+ stories

- Epic 1: Package Infrastructure (8-10 stories)
- Epic 2: Core Packages (12-15 stories)
- Epic 3: Module Packages (10-12 stories)
- Epic 4: CLI & Tooling (8-10 stories)
- Epic 5: Migration Tools (6-8 stories)
- Epic 6: Testing & CI/CD (8-10 stories)
- Epic 7: Documentation (6-8 stories)
- Epic 8: Community Ecosystem (4-6 stories)

**Timeline**: 12-16 weeks (enterprise-level refactoring)

**Documentation Needed**:

- Full PRD (this document)
- Architecture Decision Records (ADRs)
- Migration guide
- Package dependency graph
- API documentation per package
- Community contribution guide

---

## Architecture Overview

### Current Architecture (v1.0-alpha)

```
MADACE-METHOD/
├── scripts/core/              # Core engine (monolithic)
├── modules/                   # Modules (monolithic)
│   ├── core/
│   ├── mam/
│   ├── mab/
│   └── cis/
├── scripts/cli/               # CLI (monolithic)
└── scripts/build/             # Build tools (monolithic)
```

**Problems:**

- Everything in one repository
- No independent versioning
- Tight coupling between layers
- Can't selectively install modules
- Hard to test in isolation
- Community can't publish extensions easily

### Target Architecture (v2.0)

```
@madace/core              # Core framework
@madace/agent-system      # Agent loading & runtime
@madace/workflow-engine   # Workflow execution
@madace/template-engine   # Template rendering
@madace/state-machine     # Story lifecycle
@madace/config-manager    # Configuration
@madace/manifest-manager  # Component registry
@madace/cli               # CLI framework
@madace/installer         # Interactive installer

@madace/module-mam        # MAM module
@madace/module-mab        # MAB module
@madace/module-cis        # CIS module

@madace/agent-pm          # PM agent (standalone)
@madace/agent-sm          # SM agent (standalone)
@madace/agent-dev         # DEV agent (standalone)
@madace/agent-architect   # Architect agent (standalone)
@madace/agent-analyst     # Analyst agent (standalone)

@madace/build-bundler     # Web bundle generator
@madace/build-validator   # Validation tools
@madace/build-flattener   # Code flattener

@madace/create-agent      # Agent scaffolding (like create-react-app)
@madace/create-workflow   # Workflow scaffolding
@madace/create-module     # Module scaffolding

madace                    # Meta-package (all-in-one installer)
```

**Benefits:**

- Independent versioning per package
- Selective installation (`npm install @madace/module-mam`)
- Clear dependency boundaries
- Easier testing (isolated test suites)
- Community can publish `@community/madace-module-*` packages
- Standard npm tooling (npm, yarn, pnpm)

### Dependency Graph

```
@madace/core
  └─ (no dependencies, base package)

@madace/agent-system
  ├─ @madace/core
  └─ @madace/config-manager

@madace/workflow-engine
  ├─ @madace/core
  ├─ @madace/template-engine
  └─ @madace/state-machine

@madace/cli
  ├─ @madace/core
  ├─ @madace/agent-system
  ├─ @madace/workflow-engine
  └─ @madace/installer

@madace/module-mam
  ├─ @madace/core
  ├─ @madace/agent-system
  ├─ @madace/workflow-engine
  └─ @madace/state-machine

@madace/agent-pm (standalone agent)
  ├─ @madace/core
  └─ @madace/agent-system

madace (meta-package)
  ├─ @madace/cli
  ├─ @madace/module-mam
  ├─ @madace/module-mab
  └─ @madace/module-cis
```

---

## Package Structure

### Package Categories

#### 1. Core Packages (Foundation)

**@madace/core**

- **Purpose**: Base utilities, types, constants
- **Dependencies**: None (zero dependencies)
- **Exports**:
  - `MADACE_VERSION`
  - Error classes
  - Logger interface
  - Path utilities
  - Validation helpers

**@madace/config-manager**

- **Purpose**: Configuration loading and validation
- **Dependencies**: `@madace/core`
- **Exports**:
  - `autoLoadConfig()`
  - `validateConfig()`
  - `resolveP aths()`

**@madace/manifest-manager**

- **Purpose**: Component registry (CSV manifests)
- **Dependencies**: `@madace/core`
- **Exports**:
  - `addAgent()`, `removeAgent()`, `listAgents()`
  - `addWorkflow()`, `removeWorkflow()`, `listWorkflows()`
  - `getStats()`

#### 2. Engine Packages (Core Functionality)

**@madace/agent-system**

- **Purpose**: Agent loading and runtime
- **Dependencies**: `@madace/core`, `@madace/config-manager`
- **Exports**:
  - `AgentLoader`
  - `AgentRuntime`
  - Critical actions registry

**@madace/workflow-engine**

- **Purpose**: Workflow execution
- **Dependencies**: `@madace/core`, `@madace/template-engine`,
  `@madace/state-machine`
- **Exports**:
  - `WorkflowEngine`
  - Step action types
  - State persistence

**@madace/template-engine**

- **Purpose**: Template rendering with variable substitution
- **Dependencies**: `@madace/core`
- **Exports**:
  - `TemplateEngine`
  - Interpolation patterns
  - Context building

**@madace/state-machine**

- **Purpose**: Story lifecycle management
- **Dependencies**: `@madace/core`
- **Exports**:
  - `StateMachine`
  - State transitions (BACKLOG → TODO → IN PROGRESS → DONE)
  - Status file parser/generator

#### 3. Module Packages (Feature Modules)

**@madace/module-mam**

- **Purpose**: MAM (MADACE Method) - Agile development workflows
- **Dependencies**: `@madace/core`, `@madace/agent-system`,
  `@madace/workflow-engine`, `@madace/state-machine`
- **Contents**:
  - 5 agents (PM, SM, DEV, Architect, Analyst)
  - 15+ workflows
  - Templates for PRD, GDD, stories, tech-specs

**@madace/module-mab**

- **Purpose**: MAB (MADACE Builder) - Agent/workflow creation
- **Dependencies**: `@madace/core`, `@madace/agent-system`,
  `@madace/workflow-engine`
- **Contents**:
  - Builder agent
  - 3 workflows (create-agent, create-workflow, create-module)
  - Templates for agents, workflows, modules

**@madace/module-cis**

- **Purpose**: CIS (Creative Intelligence Suite) - Brainstorming
- **Dependencies**: `@madace/core`, `@madace/agent-system`,
  `@madace/workflow-engine`
- **Contents**:
  - Creativity agent
  - 5 workflows (SCAMPER, Six Hats, Design Thinking, Mind Map, Innovation
    Challenge)
  - Creativity templates

#### 4. Standalone Agent Packages (Optional)

**@madace/agent-pm**, **@madace/agent-sm**, **@madace/agent-dev**, etc.

- **Purpose**: Individual agents as standalone packages
- **Dependencies**: `@madace/core`, `@madace/agent-system`
- **Use Case**: Users can install just the agents they need
- **Example**: `npm install @madace/agent-pm` for just the PM agent

#### 5. CLI & Tooling Packages

**@madace/cli**

- **Purpose**: Command-line interface
- **Dependencies**: `@madace/core`, `@madace/agent-system`,
  `@madace/workflow-engine`, `@madace/installer`
- **Exports**:
  - `madace` CLI binary
  - Commands: status, list, agent, workflow, dev

**@madace/installer**

- **Purpose**: Interactive installation wizard
- **Dependencies**: `@madace/core`, `@madace/config-manager`,
  `@madace/manifest-manager`
- **Exports**:
  - Interactive installer
  - Module selection
  - Platform detection

**@madace/create-agent**, **@madace/create-workflow**, **@madace/create-module**

- **Purpose**: Scaffolding tools (like create-react-app)
- **Dependencies**: `@madace/core`
- **Usage**: `npx @madace/create-agent my-agent`

#### 6. Build & Distribution Packages

**@madace/build-bundler**

- **Purpose**: Web bundle generation (ChatGPT/Gemini)
- **Dependencies**: `@madace/core`
- **Exports**: `generateBundle()`, `validateBundle()`

**@madace/build-validator**

- **Purpose**: YAML schema validation, integrity checks
- **Dependencies**: `@madace/core`
- **Exports**: `validateAgent()`, `validateWorkflow()`, `validateModule()`

**@madace/build-flattener**

- **Purpose**: Code flattening for analysis
- **Dependencies**: `@madace/core`
- **Exports**: `flattenCodebase()`

#### 7. Meta-Package

**madace**

- **Purpose**: All-in-one installer (convenience package)
- **Dependencies**: All `@madace/*` packages
- **Usage**: `npm install madace` to get everything
- **Exports**: Re-exports from all packages

---

## Epics

### Epic 1: Package Infrastructure Setup

**Priority:** P0 **Stories:** 8-10 **Duration:** 2 weeks

**Goal:** Establish monorepo structure, tooling, and CI/CD pipeline.

**Stories:**

1. Set up monorepo structure (Lerna or Turborepo or pnpm workspaces)
2. Configure package.json for each package with correct dependencies
3. Set up shared build configuration (tsconfig, eslint, prettier)
4. Create CI/CD pipeline for multi-package testing
5. Set up semantic versioning and changelog generation
6. Configure npm publishing workflow (scoped packages @madace/\*)
7. Create dependency graph visualization
8. Set up package-level test infrastructure
9. Configure code coverage tracking per package
10. Create monorepo documentation (CONTRIBUTING.md for package structure)

**Acceptance Criteria:**

- All packages build independently
- Dependency graph is acyclic (no circular dependencies)
- CI runs tests for all packages
- Semantic versioning enforced
- Ready for npm publication (dry-run successful)

---

### Epic 2: Core Package Extraction

**Priority:** P0 **Stories:** 12-15 **Duration:** 3 weeks

**Goal:** Extract core functionality into independent packages.

**Stories:**

1. Extract @madace/core base package (utilities, types, constants)
2. Extract @madace/config-manager from scripts/core/config-manager.js
3. Extract @madace/manifest-manager from scripts/core/manifest-manager.js
4. Extract @madace/agent-system (agent-loader.js + agent-runtime.js)
5. Extract @madace/workflow-engine from scripts/core/workflow-engine.js
6. Extract @madace/template-engine from scripts/core/template-engine.js
7. Extract @madace/state-machine from scripts/core/state-machine.js
8. Define clear public APIs for each package (index.js exports)
9. Write unit tests for @madace/core
10. Write unit tests for @madace/config-manager
11. Write unit tests for @madace/manifest-manager
12. Write unit tests for @madace/agent-system
13. Write unit tests for @madace/workflow-engine
14. Write unit tests for @madace/template-engine
15. Write unit tests for @madace/state-machine

**Acceptance Criteria:**

- Each package has 70%+ test coverage
- Packages can be imported independently
- No circular dependencies
- Public APIs documented with JSDoc
- Breaking changes from v1.0 documented in ADRs

---

### Epic 3: Module Package Extraction

**Priority:** P0 **Stories:** 10-12 **Duration:** 2.5 weeks

**Goal:** Convert modules (MAM, MAB, CIS) into standalone packages.

**Stories:**

1. Extract @madace/module-mam from modules/mam/
2. Migrate MAM agents to @madace/module-mam
3. Migrate MAM workflows to @madace/module-mam
4. Migrate MAM templates to @madace/module-mam
5. Extract @madace/module-mab from modules/mab/
6. Migrate MAB agent and workflows to @madace/module-mab
7. Extract @madace/module-cis from modules/cis/
8. Migrate CIS agent and workflows to @madace/module-cis
9. Create module installation hooks (post-install scripts)
10. Write integration tests for @madace/module-mam
11. Write integration tests for @madace/module-mab
12. Write integration tests for @madace/module-cis

**Acceptance Criteria:**

- Modules install independently (`npm install @madace/module-mam`)
- Modules register themselves with manifest system
- Module dependencies clearly defined
- Integration tests pass for each module
- Module documentation complete (README per module)

---

### Epic 4: CLI & Installer Refactoring

**Priority:** P0 **Stories:** 8-10 **Duration:** 2 weeks

**Goal:** Refactor CLI and installer as standalone packages with plugin
architecture.

**Stories:**

1. Extract @madace/cli from scripts/cli/madace.js
2. Implement CLI plugin system for modules
3. Extract @madace/installer from scripts/cli/installer.js
4. Create interactive module selection in installer
5. Implement npm-based module installation (vs file copying)
6. Add CLI commands for package management (madace add mam, madace remove cis)
7. Create @madace/create-agent scaffolding tool
8. Create @madace/create-workflow scaffolding tool
9. Create @madace/create-module scaffolding tool
10. Write CLI integration tests

**Acceptance Criteria:**

- CLI works with modular package system
- Modules can register CLI commands dynamically
- Installer installs packages via npm
- Scaffolding tools work (npx @madace/create-agent my-agent)
- CLI tests cover all commands

---

### Epic 5: Migration Tools & Backward Compatibility

**Priority:** P1 **Stories:** 6-8 **Duration:** 1.5 weeks

**Goal:** Create tools to migrate v1.x users to v2.0 with minimal disruption.

**Stories:**

1. Create migration script (v1 monolith → v2 packages)
2. Build compatibility shim (@madace/compat) for v1.x APIs
3. Create migration guide documentation
4. Implement version detection in CLI (warn if using v1.x structure)
5. Create automated migration testing suite
6. Build migration verification tool (check for breaking changes)
7. Create rollback mechanism (v2 → v1 if needed)
8. Write migration case studies for common scenarios

**Acceptance Criteria:**

- Migration script converts v1.x projects to v2.0
- Compatibility shim allows gradual migration
- Migration guide tested with real v1.x projects
- Rollback mechanism works
- Migration tool has 90%+ success rate

---

### Epic 6: Testing & CI/CD Infrastructure

**Priority:** P0 **Stories:** 8-10 **Duration:** 2 weeks

**Goal:** Comprehensive testing strategy across all packages.

**Stories:**

1. Set up Jest for unit testing across packages
2. Configure integration tests for cross-package scenarios
3. Set up end-to-end tests for full workflows
4. Implement visual regression testing for CLI output
5. Create performance benchmarking suite
6. Set up automated cross-platform testing (macOS/Linux/Windows)
7. Configure code coverage aggregation across packages
8. Set up automated security scanning (npm audit, Snyk)
9. Create pre-release testing checklist
10. Implement canary deployment strategy

**Acceptance Criteria:**

- Overall test coverage >70%
- All packages tested on 3 platforms
- E2E tests cover main user workflows
- Performance benchmarks established
- Security scanning integrated in CI

---

### Epic 7: Documentation Overhaul

**Priority:** P1 **Stories:** 6-8 **Duration:** 1.5 weeks

**Goal:** Comprehensive documentation for modular architecture.

**Stories:**

1. Create package-level READMEs for all @madace/\* packages
2. Write API documentation (JSDoc → markdown)
3. Create architecture decision records (ADRs) for major decisions
4. Update main README.md for package-based installation
5. Create package dependency visualization
6. Write community module development guide
7. Create troubleshooting guide for common issues
8. Update CLAUDE.md for new architecture

**Acceptance Criteria:**

- Every package has README with usage examples
- API documentation generated and published
- ADRs document all breaking changes
- Community can publish compatible modules
- Documentation site deployed (if applicable)

---

### Epic 8: Community Ecosystem & Publishing

**Priority:** P2 **Stories:** 4-6 **Duration:** 1 week

**Goal:** Enable community contributions and third-party packages.

**Stories:**

1. Create module registry (list of community modules)
2. Define module quality standards and certification
3. Set up automated module validation pipeline
4. Create "verified module" badge system
5. Build module discovery CLI command (madace discover)
6. Create contribution templates for community modules

**Acceptance Criteria:**

- Community modules can be published to npm
- Module quality standards documented
- Validation pipeline catches common issues
- Verified modules displayed in registry
- Discovery command finds compatible modules

---

## Story Breakdown

### Sample Stories (Epic 2: Core Package Extraction)

#### Story: Extract @madace/core Base Package

**Epic:** Epic 2 **Priority:** P0 **Points:** 8 **Type:** Refactoring

**Description:** Extract base utilities, types, and constants into
`@madace/core` package with zero dependencies.

**Acceptance Criteria:**

- [ ] Package structure created: `packages/core/`
- [ ] `package.json` configured with correct metadata
- [ ] Exports: MADACE_VERSION, error classes, logger interface, path utilities,
      validation helpers
- [ ] Zero external dependencies
- [ ] Unit tests for all utilities
- [ ] README.md with usage examples
- [ ] Package builds successfully
- [ ] Published to npm (dry-run)

**Technical Notes:**

- Use ES modules throughout
- Export both named exports and default
- Include TypeScript type definitions (.d.ts)
- Follow semantic versioning from start

**Dependencies:**

- Requires Epic 1 Story 1 (monorepo setup)

---

#### Story: Extract @madace/agent-system Package

**Epic:** Epic 2 **Priority:** P0 **Points:** 13 **Type:** Refactoring

**Description:** Extract agent loading and runtime from
`scripts/core/agent-loader.js` and `scripts/core/agent-runtime.js` into
`@madace/agent-system`.

**Acceptance Criteria:**

- [ ] Package structure created: `packages/agent-system/`
- [ ] Dependencies: `@madace/core`, `@madace/config-manager`
- [ ] Exports: `AgentLoader`, `AgentRuntime`, critical actions registry
- [ ] All existing agent loading tests passing
- [ ] New tests for edge cases (70%+ coverage)
- [ ] Public API documented (JSDoc)
- [ ] Migration guide for breaking changes
- [ ] Package builds and publishes

**Technical Notes:**

- Maintain backward compatibility where possible
- Use plugin system for critical actions
- Expose hooks for agent lifecycle events

**Dependencies:**

- Requires @madace/core (Epic 2 Story 1)
- Requires @madace/config-manager (Epic 2 Story 2)

---

### Sample Stories (Epic 4: CLI & Installer Refactoring)

#### Story: Extract @madace/cli Package

**Epic:** Epic 4 **Priority:** P0 **Points:** 13 **Type:** Refactoring

**Description:** Extract CLI from `scripts/cli/madace.js` into `@madace/cli`
with plugin architecture for modules.

**Acceptance Criteria:**

- [ ] Package structure created: `packages/cli/`
- [ ] Binary: `bin/madace`
- [ ] Plugin system for module commands
- [ ] All existing commands working (status, list, agent, workflow, dev)
- [ ] New commands: add, remove, discover
- [ ] Integration tests for all commands
- [ ] CLI help documentation
- [ ] Package published with binary

**Technical Notes:**

- Use Commander.js for CLI framework
- Plugin discovery via package.json metadata
- Support both global and local installation

**Dependencies:**

- Requires all core packages (Epic 2)
- Requires @madace/installer (Epic 4 Story 3)

---

#### Story: Create @madace/create-agent Scaffolding Tool

**Epic:** Epic 4 **Priority:** P1 **Points:** 8 **Type:** Feature

**Description:** Create scaffolding tool for generating new agents (like
create-react-app).

**Acceptance Criteria:**

- [ ] Package structure created: `packages/create-agent/`
- [ ] Usage: `npx @madace/create-agent my-agent`
- [ ] Interactive prompts for agent configuration
- [ ] Generates valid agent YAML file
- [ ] Generates agent directory structure
- [ ] Generates sample workflows
- [ ] Generates unit test template
- [ ] README with usage guide

**Technical Notes:**

- Use Inquirer.js for interactive prompts
- Template-based generation
- Validate generated output automatically

**Dependencies:**

- Requires @madace/core
- Requires @madace/agent-system (for validation)

---

## Dependencies

### Package Dependency Matrix

| Package                  | Dependencies                                                                       | Dependents                                  |
| ------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------- |
| @madace/core             | None                                                                               | All packages                                |
| @madace/config-manager   | @madace/core                                                                       | @madace/agent-system, @madace/cli           |
| @madace/manifest-manager | @madace/core                                                                       | @madace/cli, @madace/installer              |
| @madace/agent-system     | @madace/core, @madace/config-manager                                               | @madace/module-\*, @madace/cli              |
| @madace/workflow-engine  | @madace/core, @madace/template-engine, @madace/state-machine                       | @madace/module-\*, @madace/cli              |
| @madace/template-engine  | @madace/core                                                                       | @madace/workflow-engine                     |
| @madace/state-machine    | @madace/core                                                                       | @madace/workflow-engine, @madace/module-mam |
| @madace/module-mam       | @madace/core, @madace/agent-system, @madace/workflow-engine, @madace/state-machine | madace (meta)                               |
| @madace/module-mab       | @madace/core, @madace/agent-system, @madace/workflow-engine                        | madace (meta)                               |
| @madace/module-cis       | @madace/core, @madace/agent-system, @madace/workflow-engine                        | madace (meta)                               |
| @madace/cli              | @madace/core, @madace/agent-system, @madace/workflow-engine, @madace/installer     | madace (meta)                               |
| @madace/installer        | @madace/core, @madace/config-manager, @madace/manifest-manager                     | @madace/cli                                 |
| @madace/create-agent     | @madace/core                                                                       | None (standalone tool)                      |
| @madace/create-workflow  | @madace/core                                                                       | None (standalone tool)                      |
| @madace/create-module    | @madace/core                                                                       | None (standalone tool)                      |
| madace (meta-package)    | All @madace/\* packages                                                            | End users                                   |

### Epic Dependencies

```
Epic 1: Package Infrastructure
  └─ No dependencies (foundation)

Epic 2: Core Package Extraction
  ├─ Depends on: Epic 1 (infrastructure)
  └─ Blocks: Epic 3, Epic 4, Epic 6

Epic 3: Module Package Extraction
  ├─ Depends on: Epic 2 (core packages)
  └─ Blocks: Epic 7 (documentation)

Epic 4: CLI & Installer Refactoring
  ├─ Depends on: Epic 2 (core packages)
  └─ Blocks: Epic 5 (migration tools)

Epic 5: Migration Tools
  ├─ Depends on: Epic 2, Epic 3, Epic 4
  └─ Blocks: None (parallel with Epic 6, 7)

Epic 6: Testing & CI/CD
  ├─ Depends on: Epic 1 (infrastructure)
  └─ Parallel with: Epic 2, Epic 3, Epic 4

Epic 7: Documentation
  ├─ Depends on: Epic 2, Epic 3, Epic 4
  └─ Blocks: Epic 8 (community)

Epic 8: Community Ecosystem
  ├─ Depends on: Epic 7 (documentation)
  └─ Blocks: None (final epic)
```

---

## Migration Strategy

### v1.x → v2.0 Migration Path

#### Phase 1: Parallel Installation (Weeks 1-4)

**Goal:** v2.0 packages can be installed alongside v1.x

- v1.x continues to work from `MADACE-METHOD/` repo
- v2.0 packages available on npm as `@madace/*`
- Users can test v2.0 in new projects
- No breaking changes to v1.x users

#### Phase 2: Compatibility Shim (Weeks 5-8)

**Goal:** v1.x code can import v2.0 packages with minimal changes

- `@madace/compat` package provides v1.x API wrappers
- Example: `import agentLoader from '@madace/compat/agent-loader'` (v1 API) →
  uses `@madace/agent-system` internally
- Deprecation warnings logged for v1.x API usage
- Migration guide published

#### Phase 3: Migration Tooling (Weeks 9-12)

**Goal:** Automated migration from v1.x to v2.0

- `@madace/migrate` CLI tool released
- Scans v1.x project structure
- Generates `package.json` with correct v2.0 dependencies
- Rewrites imports to v2.0 packages
- Updates config files
- Creates migration report (what changed, what needs manual review)

#### Phase 4: Deprecation (Weeks 13-16)

**Goal:** v1.x officially deprecated, v2.0 is default

- v1.x marked as deprecated on npm
- All documentation points to v2.0
- v1.x receives only critical bug fixes
- v2.0 is stable and recommended

#### Phase 5: End of Life (6 months after v2.0 stable)

**Goal:** v1.x no longer supported

- v1.x no longer receives updates
- Community modules target v2.0
- v1.x documentation archived

### Migration Example

**v1.x Code:**

```javascript
// scripts/core/agent-loader.js
import agentLoader from './scripts/core/agent-loader.js';
import workflowEngine from './scripts/core/workflow-engine.js';

const agent = await agentLoader.loadAgent('madace/mam/agents/pm.agent.yaml');
const workflow = await workflowEngine.loadWorkflow(
  'madace/mam/workflows/plan-project/workflow.yaml'
);
```

**v2.0 Code (with compat shim):**

```javascript
// Using compatibility shim (Phase 2)
import agentLoader from '@madace/compat/agent-loader';
import workflowEngine from '@madace/compat/workflow-engine';

const agent = await agentLoader.loadAgent('madace/mam/agents/pm.agent.yaml');
const workflow = await workflowEngine.loadWorkflow(
  'madace/mam/workflows/plan-project/workflow.yaml'
);
```

**v2.0 Code (native):**

```javascript
// Using native v2.0 packages (Phase 3+)
import { AgentLoader } from '@madace/agent-system';
import { WorkflowEngine } from '@madace/workflow-engine';

const agentLoader = new AgentLoader();
const workflowEngine = new WorkflowEngine();

const agent = await agentLoader.loadAgent('@madace/agent-pm');
const workflow = await workflowEngine.loadWorkflow(
  '@madace/module-mam',
  'plan-project'
);
```

---

## Success Criteria

### Technical Success Criteria

1. **Package Independence**
   - [ ] All packages build independently
   - [ ] No circular dependencies
   - [ ] Each package has clear public API
   - [ ] Dependency graph is acyclic

2. **Test Coverage**
   - [ ] Overall coverage >70%
   - [ ] Each core package >75% coverage
   - [ ] Integration tests for cross-package scenarios
   - [ ] E2E tests for main user workflows

3. **Performance**
   - [ ] Package installation time <30s for meta-package
   - [ ] CLI startup time <200ms
   - [ ] No performance regressions vs v1.x

4. **Compatibility**
   - [ ] Migration tool success rate >90%
   - [ ] Compatibility shim covers 95%+ of v1.x API
   - [ ] Breaking changes documented in ADRs

### User Experience Success Criteria

1. **Installation**
   - [ ] `npm install madace` works on macOS, Linux, Windows
   - [ ] Selective installation works (`npm install @madace/module-mam`)
   - [ ] Installation size reduced (users install only what they need)

2. **Developer Experience**
   - [ ] Clear error messages with actionable fixes
   - [ ] Documentation complete for all packages
   - [ ] Scaffolding tools work (`npx @madace/create-agent`)
   - [ ] Community can publish compatible modules

3. **Migration Experience**
   - [ ] Migration guide tested with 5+ real projects
   - [ ] Migration tool runs successfully
   - [ ] Rollback mechanism available
   - [ ] Support channel for migration issues

### Community Success Criteria

1. **Ecosystem Growth**
   - [ ] 3+ community modules published within 3 months of v2.0 release
   - [ ] Module registry operational
   - [ ] Verified module badges awarded

2. **Adoption**
   - [ ] 80%+ of v1.x users migrated within 6 months
   - [ ] 50+ GitHub stars on main repo
   - [ ] Active community contributions (PRs, issues, discussions)

---

## Timeline

### Phase 1: Foundation (Weeks 1-2)

**Epic:** Epic 1 (Package Infrastructure)

- **Week 1**: Monorepo setup, package structure, CI/CD
- **Week 2**: Publishing workflow, versioning, testing infrastructure

**Milestone:** Monorepo operational, packages can be built and tested

---

### Phase 2: Core Extraction (Weeks 3-5)

**Epic:** Epic 2 (Core Package Extraction)

- **Week 3**: Extract @madace/core, @madace/config-manager,
  @madace/manifest-manager
- **Week 4**: Extract @madace/agent-system, @madace/workflow-engine
- **Week 5**: Extract @madace/template-engine, @madace/state-machine

**Milestone:** All core packages published to npm, tests passing

---

### Phase 3: Module Extraction (Weeks 6-8)

**Epic:** Epic 3 (Module Package Extraction)

- **Week 6**: Extract @madace/module-mam
- **Week 7**: Extract @madace/module-mab, @madace/module-cis
- **Week 8**: Integration tests, module registration

**Milestone:** Modules installable as standalone packages

---

### Phase 4: CLI & Tooling (Weeks 9-10)

**Epic:** Epic 4 (CLI & Installer Refactoring)

- **Week 9**: Extract @madace/cli, @madace/installer
- **Week 10**: Create scaffolding tools (@madace/create-\*)

**Milestone:** CLI and tooling functional with modular architecture

---

### Phase 5: Migration & Testing (Weeks 11-12)

**Epics:** Epic 5 (Migration Tools), Epic 6 (Testing & CI/CD)

- **Week 11**: Build migration tooling, compatibility shim
- **Week 12**: Comprehensive testing, cross-platform validation

**Milestone:** Migration path validated, all tests green

---

### Phase 6: Documentation & Community (Weeks 13-14)

**Epics:** Epic 7 (Documentation), Epic 8 (Community Ecosystem)

- **Week 13**: Documentation overhaul, API docs, migration guide
- **Week 14**: Community standards, module registry, launch prep

**Milestone:** Documentation complete, ready for community release

---

### Phase 7: Release & Stabilization (Weeks 15-16)

**All Epics:** Final testing and release

- **Week 15**: Beta release, community feedback
- **Week 16**: Bug fixes, v2.0.0 stable release

**Milestone:** v2.0.0 released, migration path proven

---

## Risk Assessment

### High Risks

1. **Circular Dependencies**
   - **Risk**: Package dependency graph becomes circular
   - **Mitigation**: Strict dependency reviews, automated detection in CI
   - **Contingency**: Refactor to break cycles (may require interface packages)

2. **Migration Complexity**
   - **Risk**: v1.x → v2.0 migration harder than expected
   - **Mitigation**: Build migration tool early, test with real projects
   - **Contingency**: Extended compatibility shim support (12 months vs 6
     months)

3. **Breaking Changes**
   - **Risk**: Too many breaking changes, users can't migrate
   - **Mitigation**: Comprehensive compatibility layer, detailed migration guide
   - **Contingency**: Maintain v1.x longer (LTS branch)

### Medium Risks

1. **Package Proliferation**
   - **Risk**: Too many packages, users confused about what to install
   - **Mitigation**: Clear documentation, meta-package for common use cases
   - **Contingency**: Consolidate packages if needed

2. **Testing Overhead**
   - **Risk**: Testing all package combinations is time-consuming
   - **Mitigation**: Automated testing matrix, focus on common combinations
   - **Contingency**: Reduce package granularity

3. **Community Fragmentation**
   - **Risk**: Multiple incompatible versions of community modules
   - **Mitigation**: Clear versioning standards, compatibility checks
   - **Contingency**: Centralized module registry with validation

### Low Risks

1. **npm Publishing Issues**
   - **Risk**: Problems publishing scoped packages (@madace/\*)
   - **Mitigation**: Test publishing in dry-run mode early
   - **Contingency**: Use alternative registry (GitHub Packages)

2. **Performance Regression**
   - **Risk**: Modular architecture slower than monolith
   - **Mitigation**: Benchmarking from start, lazy loading
   - **Contingency**: Bundle optimization, tree-shaking

---

## Architecture Decision Records (ADRs)

### ADR-001: Monorepo vs Multi-Repo

**Decision:** Use monorepo (Lerna/Turborepo/pnpm workspaces) **Rationale:**

- Simplifies cross-package changes
- Single CI/CD pipeline
- Easier dependency management
- Atomic commits across packages

**Alternatives Considered:**

- Multi-repo: More isolated but harder to coordinate
- Meta-repo with submodules: Too complex for contributors

---

### ADR-002: Package Manager Choice

**Decision:** Use pnpm for monorepo workspace management **Rationale:**

- Efficient disk usage (content-addressable storage)
- Strict dependency resolution (catches issues early)
- Fast installation
- Built-in workspace support

**Alternatives Considered:**

- Lerna: Older, less efficient
- Turborepo: Newer, less proven
- Yarn workspaces: Slower than pnpm

---

### ADR-003: Breaking Changes Strategy

**Decision:** Allow breaking changes in v2.0, provide compatibility shim
**Rationale:**

- Clean slate for better architecture
- Compatibility layer eases migration
- Technical debt from v1.x removed

**Alternatives Considered:**

- Full backward compatibility: Would limit architectural improvements
- No compatibility layer: Too painful for users

---

### ADR-004: Package Naming Convention

**Decision:** Use scoped packages (@madace/\*) **Rationale:**

- Namespace control (madace core team owns @madace scope)
- Clear distinction from community packages
- npm best practice

**Alternatives Considered:**

- Unscoped (madace-core): Risk of name collisions
- Different scope per category: Too complex

---

### ADR-005: TypeScript vs JavaScript

**Decision:** Continue with JavaScript + JSDoc, provide .d.ts files
**Rationale:**

- Maintains v1.x simplicity philosophy
- Type definitions for TypeScript users
- No build step for JS consumers

**Alternatives Considered:**

- Full TypeScript: Adds build complexity
- No types: Poor DX for TypeScript users

---

## Next Steps

### Immediate Actions (Post-Planning)

1. **Get Stakeholder Approval**
   - Review this PRD with core team
   - Validate timeline and resource allocation
   - Approve breaking changes strategy

2. **Set Up Project Tracking**
   - Create epics in project management tool (GitHub Projects, Jira)
   - Break down epics into stories
   - Assign initial story points

3. **Initialize Monorepo**
   - Create `MADACE-METHOD-v2/` repository
   - Set up pnpm workspace structure
   - Configure base tooling (ESLint, Prettier, Jest)

4. **Begin Epic 1**
   - Start with Story 1: Monorepo structure setup
   - Set up CI/CD pipeline
   - Configure package publishing workflow

5. **Community Communication**
   - Announce v2.0 plans on GitHub Discussions
   - Share roadmap and migration strategy
   - Gather early feedback from users

---

## Appendix A: Package Dependency Graph (Detailed)

```mermaid
graph TD
    A[@madace/core] --> B[@madace/config-manager]
    A --> C[@madace/manifest-manager]
    A --> D[@madace/template-engine]
    A --> E[@madace/state-machine]

    A --> F[@madace/agent-system]
    B --> F

    A --> G[@madace/workflow-engine]
    D --> G
    E --> G

    A --> H[@madace/module-mam]
    F --> H
    G --> H
    E --> H

    A --> I[@madace/module-mab]
    F --> I
    G --> I

    A --> J[@madace/module-cis]
    F --> J
    G --> J

    A --> K[@madace/cli]
    F --> K
    G --> K
    L[@madace/installer] --> K

    A --> L
    B --> L
    C --> L

    A --> M[@madace/create-agent]
    A --> N[@madace/create-workflow]
    A --> O[@madace/create-module]

    K --> P[madace meta-package]
    H --> P
    I --> P
    J --> P
```

---

## Appendix B: Story Estimation Guide

**Story Points:**

- **1 Point**: Simple config change, documentation update
- **2 Points**: Small utility function, test file
- **3 Points**: Simple package extraction, basic feature
- **5 Points**: Medium package extraction, moderate complexity
- **8 Points**: Complex package extraction, multiple dependencies
- **13 Points**: Major refactoring, cross-package changes
- **21 Points**: Epic-level work (should be broken down)

**Velocity Assumptions:**

- 2-4 developers
- 40-50 points per week (team capacity)
- 10-15 points per developer per week

---

## Appendix C: Glossary

**Monorepo**: Single repository containing multiple packages **Scoped Package**:
npm package with namespace (@madace/core) **Meta-Package**: Package that depends
on multiple other packages (convenience) **Compatibility Shim**: Layer providing
old API using new implementation **Breaking Change**: API change that requires
code updates **Semantic Versioning**: Version format MAJOR.MINOR.PATCH (v2.0.0)
**Dependency Graph**: Visual representation of package dependencies **ADR**:
Architecture Decision Record (documents key decisions) **Story Points**:
Relative measure of story complexity (Fibonacci: 1,2,3,5,8,13) **Epic**: Large
body of work (collection of stories) **Greenfield**: New project from scratch
**Brownfield**: Existing codebase being refactored

---

**Document Status:** Draft - Awaiting Stakeholder Review **Next Review Date:**
2025-10-24 **Owner:** MADACE Core Team **Contributors:** Architecture Team,
Community Feedback

---

**Generated using MADACE-METHOD v1.0-alpha.2** **Scale-Adaptive Planning: Level
4 (Enterprise PRD)**
