# Changelog

All notable changes to MADACE-METHOD will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Complete v1.0-alpha implementation

## [1.0.0-alpha.1] - 2025-10-17

### Added

- **Epic 1: Core Framework Foundation (12 stories)**
  - Agent loading system with YAML parser
  - Agent runtime with execution context
  - Workflow execution engine
  - Template rendering system
  - Configuration management
  - Manifest tracking (CSV)
  - Platform injection system

- **Epic 2: CLI & Installation System (8 stories)**
  - Commander-based CLI
  - Interactive installer
  - Status, list, agent commands
  - Dev validation and info commands
  - Platform detection

- **Epic 3: MAM Phase 1-2 Analysis & Planning (10 stories)**
  - Scale-adaptive planning (Level 0-4)
  - Project type detection
  - PRD, GDD, tech-spec generation
  - Epic breakdown workflows
  - Story scaffolding
  - Workflow status initialization

- **Epic 4: MAM Phase 3-4 Solutioning & Implementation (15 stories)**
  - Story state machine engine
  - BACKLOG → TODO → IN PROGRESS → DONE transitions
  - Create-story, story-ready, story-approved workflows
  - Dynamic context injection (XML-based)
  - Solution architecture workflow
  - JIT tech-spec workflow (per epic)
  - Retrospective workflow

- **Epic 5: MAB (MADACE Builder) (8 stories)**
  - Builder agent for module creation
  - Create-agent workflow with templates
  - Create-workflow workflow
  - Create-module scaffolding
  - Agent templates (module, standalone, core)
  - Workflow templates
  - Module structure templates

- **Epic 6: CIS (Creative Intelligence Suite) (6 stories)**
  - Creativity agent facilitator
  - SCAMPER brainstorming workflow
  - Six Thinking Hats workflow
  - Design Thinking workflow
  - Mind mapping workflow
  - Innovation challenge workflow

- **Epic 7: Build & Distribution Tools (5 stories)**
  - Web bundle generator
  - Bundle validator
  - Codebase flattener
  - CI/CD workflows (GitHub Actions)

- **Epic 8: Code Quality & DevEx (4 stories)**
  - ESLint 9.x configuration
  - Prettier 3.x configuration
  - Husky pre-commit hooks
  - lint-staged integration

- **Epic 9: Documentation & Community (6 stories)**
  - Comprehensive README
  - CLAUDE.md for AI assistants
  - CONTRIBUTING.md guidelines
  - CHANGELOG.md
  - TERMINOLOGY-REFERENCE.md
  - Module documentation

### Changed

- Rebrand from BMAD-METHOD to MADACE-METHOD

### Fixed

- Cross-platform path handling
- CSV manifest write operations
- YAML parsing edge cases

## [0.1.0] - 2025-09-15 (BMAD-METHOD)

### Added

- Initial BMAD-METHOD framework
- Basic agent system
- BMM (now MAM) workflows

---

[Unreleased]:
  https://github.com/your-org/MADACE-METHOD/compare/v1.0.0-alpha.1...HEAD
[1.0.0-alpha.1]:
  https://github.com/your-org/MADACE-METHOD/releases/tag/v1.0.0-alpha.1
