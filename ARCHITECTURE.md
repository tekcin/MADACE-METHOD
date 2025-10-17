# MADACE-METHOD Architecture Documentation

**Version:** v1.0-alpha.2 **Last Updated:** 2025-10-17 **Document Status:**
Technical Reference

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Core Components](#core-components)
4. [Module System](#module-system)
5. [Agent System](#agent-system)
6. [Workflow System](#workflow-system)
7. [State Machine](#state-machine)
8. [Template Engine](#template-engine)
9. [Configuration Management](#configuration-management)
10. [Manifest System](#manifest-system)
11. [Data Flow](#data-flow)
12. [Directory Structure](#directory-structure)
13. [Design Patterns](#design-patterns)
14. [Extension Points](#extension-points)
15. [Security Considerations](#security-considerations)

---

## Overview

MADACE-METHOD is a human-AI collaboration framework built on **natural language
configuration** and **agent-based orchestration**. The architecture emphasizes:

- **Natural Language First**: All configurations use YAML/Markdown/XML (no
  executable code)
- **Agent Orchestration**: Specialized AI agents guide workflows through
  personas
- **Modular Design**: Core framework + pluggable modules (MAM, MAB, CIS)
- **Scale-Adaptive**: Workflows adapt to project complexity (Level 0-4)
- **State Machine**: Eliminates searching with single source of truth
- **Cross-Platform**: Supports macOS, Linux, Windows with consistent behavior

### Core Philosophy

1. **Human Amplification**: AI agents facilitate thinking, don't replace it
2. **Configuration as Code**: Natural language configs are readable and
   AI-optimizable
3. **Single Source of Truth**: State machine eliminates ambiguity
4. **Just-In-Time**: Generate what's needed when it's needed
5. **Modular Composition**: Modules compose into complete workflows

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     MADACE-METHOD v1.0                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              CLI & Installation Layer               │   │
│  │  • madace CLI (commander)                           │   │
│  │  • Interactive installer (inquirer)                 │   │
│  │  • Platform detection (macOS/Linux/Windows)         │   │
│  │  • IDE-specific injections                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Core Framework Layer                   │   │
│  │  ┌───────────────┬──────────────┬────────────────┐  │   │
│  │  │ Agent System  │ Workflow Eng │ Template Eng   │  │   │
│  │  │ - Loader      │ - Parser     │ - Renderer     │  │   │
│  │  │ - Runtime     │ - Executor   │ - Variables    │  │   │
│  │  │ - Personas    │ - State Mgmt │ - Nested       │  │   │
│  │  └───────────────┴──────────────┴────────────────┘  │   │
│  │                                                      │   │
│  │  ┌───────────────┬──────────────┬────────────────┐  │   │
│  │  │ Config Mgr    │ State Machine│ Manifest Mgr   │  │   │
│  │  │ - Auto-detect │ - BACKLOG    │ - Agent CSV    │  │   │
│  │  │ - Validation  │ - TODO       │ - Workflow CSV │  │   │
│  │  │ - Paths       │ - IN PROG    │ - Task CSV     │  │   │
│  │  │               │ - DONE       │                │  │   │
│  │  └───────────────┴──────────────┴────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Module System Layer                    │   │
│  │  ┌──────────┬─────────────┬──────────┬──────────┐  │   │
│  │  │   CORE   │     MAM     │   MAB    │   CIS    │  │   │
│  │  │  Master  │  PM, SM,    │ Builder  │Creativity│  │   │
│  │  │  Agent   │  Analyst,   │  Agent   │  Agents  │  │   │
│  │  │          │  Architect, │          │          │  │   │
│  │  │          │  DEV        │          │          │  │   │
│  │  └──────────┴─────────────┴──────────┴──────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Build & Distribution Layer             │   │
│  │  • Web bundler (ChatGPT/Gemini)                     │   │
│  │  • Code flattener (analysis)                        │   │
│  │  • Bundle validator                                 │   │
│  │  • CI/CD integration                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
User → CLI → Agent Runtime → Agent Loader → YAML Parser
                    ↓              ↓
              Execution     Config Manager
              Context            ↓
                    ↓        Path Resolution
              Critical Actions    ↓
                    ↓        Validation
              Menu Display       ↓
                    ↓        Manifest Manager
              Command Execution  ↓
                    ↓        Agent/Workflow Registry
              Workflow Engine    ↓
                    ↓        Template Engine
              Step Execution     ↓
                    ↓        Variable Substitution
              Template Rendering ↓
                    ↓        Output Generation
              State Machine      ↓
                    ↓        Status File Updates
              Story Transitions  ↓
                    ↓        BACKLOG → TODO → IN PROGRESS → DONE
```

---

## Core Components

### 1. Agent Loader (`scripts/core/agent-loader.js`)

**Purpose**: Parse and validate agent YAML files.

**Responsibilities**:

- Load agent YAML files from disk
- Validate against agent schema
- Parse metadata, persona, menu, prompts
- Directory scanning for bulk loading
- Agent ID resolution

**Key Classes**:

- `AgentLoader` - Main loader class (singleton)

**Key Methods**:

```javascript
async loadAgent(agentPath)          // Load single agent
async loadAgentsFromDirectory(dir)  // Bulk load from directory
validateAgent(agent, filePath)      // Schema validation
async getAgentById(agentId, base)   // Load by ID
```

**Schema Requirements**:

```yaml
agent:
  metadata: # Required
    id: string # Required - unique identifier
    name: string # Required - short name
    title: string # Required - full title
    icon: string # Optional - emoji
  persona: # Required
    role: string # Required - primary role
    identity: string # Required - detailed identity
    communication_style: string # Optional
    principles: string # Optional
  critical_actions: array # Optional - actions on load
  menu: array # Optional - command menu
  prompts: array # Optional - reusable prompts
```

**Error Handling**:

- Missing files: Throws with file path
- Invalid YAML: Throws with parse error
- Missing required fields: Throws with field name
- Directory not found: Throws with directory path

---

### 2. Agent Runtime (`scripts/core/agent-runtime.js`)

**Purpose**: Orchestrate agent execution with full context.

**Responsibilities**:

- Load agents with execution context
- Execute critical actions on agent load
- Display agent persona and menu
- Execute menu commands
- Manage execution history
- Support sub-workflows
- Agent discovery and statistics

**Key Classes**:

- `AgentRuntime` - Main orchestrator (singleton)

**Key Methods**:

```javascript
async loadAgent(agentPath, options)     // Initialize agent
_buildExecutionContext(agent, options)  // Build context
async _executeCriticalActions(actions)  // Run on load
_displayAgentPersona()                  // Show persona
_displayMenu()                          // Show commands
async executeCommand(trigger)           // Run menu command
async executeSubWorkflow(path, ctx)     // Story F11
async discoverAgents()                  // Find all agents
async findAgent(nameOrId)               // Search agents
async getAgentStats()                   // Statistics
```

**Execution Context**:

```javascript
{
  // Agent identity
  (agent_id,
    agent_name,
    agent_title,
    agent_icon,
    // Persona
    role,
    identity,
    communication_style,
    principles,
    // Configuration
    config,
    user_name,
    project_name,
    communication_language,
    // Paths (cross-platform)
    madace_root,
    project_root,
    output_folder,
    // Runtime
    loaded_at,
    session_id);
}
```

**Critical Actions**:

- `check-config` - Validate configuration
- `validate-installation` - Check integrity
- `load-manifest` - Load registries
- `create-output-folder` - Ensure output dir

**Menu Action Types**:

- `workflow:<name>` - Execute workflow
- `elicit:<prompt>` - Ask user input
- `guide:<guidance>` - Provide guidance
- Custom actions

---

### 3. Workflow Engine (`scripts/core/workflow-engine.js`)

**Purpose**: Parse, validate, and execute workflow YAML files.

**Responsibilities**:

- Load and validate workflow files
- Initialize workflow state
- Execute workflow steps sequentially
- Support multiple step action types
- Persist state to disk
- Track progress and completion
- Handle failures and recovery

**Key Classes**:

- `WorkflowEngine` - Main engine (singleton)

**Key Methods**:

```javascript
async loadWorkflow(workflowPath)             // Parse workflow
validateWorkflow(workflow, filePath)         // Validate structure
async initializeWorkflow(path, context)      // Start execution
async executeStep(stepIndex, stepContext)    // Run single step
async completeWorkflow()                     // Mark complete
async saveState(workflowPath)                // Persist state
async loadState(workflowPath)                // Resume workflow
getProgress()                                // Progress info
```

**Workflow Schema**:

```yaml
workflow:
  name: string           # Required - workflow name
  description: string    # Required - what it does
  dependencies: array    # Optional - prerequisite workflows
  steps: array           # Required - execution steps
    - name: string       # Required - step name
      action: string     # Required - action type
      # or type: string  # Backward compatible
      prompt: string     # Optional - for elicit/reflect
      template: string   # Optional - template path
      output: string     # Optional - output path
```

**Step Action Types**:

- `elicit` - Ask user for input
- `reflect` - Prompt reflection
- `guide` - Provide guidance
- `template` - Render template
- `validate` - Validation rules
- `sub-workflow` - Execute sub-workflow
- Custom actions

**State Persistence**:

- Location: `.{workflow-name}.state.json` in workflow directory
- Format: JSON with workflow status, steps, timestamps
- Enables resume on failure
- Tracks step-by-step progress

**Backward Compatibility**:

- Accepts both `action` and `type` fields
- Normalizes `type` to `action` internally
- All existing workflows work without modification

---

### 4. Template Engine (`scripts/core/template-engine.js`)

**Purpose**: Render templates with variable substitution.

**Responsibilities**:

- Support multiple interpolation patterns
- Variable substitution
- Nested variable resolution
- Template validation
- Directory rendering
- Standard MADACE variables

**Key Classes**:

- `TemplateEngine` - Main renderer (singleton)

**Key Methods**:

```javascript
async renderFile(templatePath, vars, opts)   // Render file
render(content, vars, opts)                  // Render string
async renderToFile(tpl, out, vars, opts)     // Render & save
extractVariables(content, patterns)          // Find vars
async validateTemplate(path, requiredVars)   // Validate
buildContext(...sources)                     // Merge contexts
getStandardVariables(config)                 // MADACE vars
renderNested(content, vars, opts)            // Nested resolution
async renderDirectory(tplDir, outDir, vars)  // Bulk render
```

**Interpolation Patterns**:

```javascript
{variable-name}      // singleBrace - workflow variables (default)
{{variable_name}}    // mustache - Markdown templates
${variable_name}     // dollarBrace - code/shell contexts
%VARIABLE_NAME%      // percent - Windows environment
$variable_name       // dollar - Shell variables
```

**Pattern Priority**:

1. `singleBrace` - Default for workflow compatibility
2. `mustache` - Markdown templates
3. `dollarBrace` - Code contexts

**Standard Variables**:

```javascript
{
  (project_name, // From config
    user_name, // From config
    output_folder, // From config
    communication_language, // From config
    current_date, // YYYY-MM-DD
    current_datetime, // ISO 8601
    current_year, // YYYY
    madace_root, // Installation path
    project_root); // Project path
}
```

**Features**:

- Strict mode: Throw on missing variables
- Nested resolution: Variables can reference other variables
- Context merging: Combine multiple variable sources
- Directory rendering: Bulk template processing

---

### 5. State Machine (`scripts/core/state-machine.js`)

**Purpose**: Manage story lifecycle with strict state transitions.

**Responsibilities**:

- Parse and generate status files
- Enforce state machine rules
- Atomic state transitions
- Validate state integrity
- Initialize from epics
- Track story progress

**Key Classes**:

- `StateMachine` - Main state manager

**State Definitions**:

```javascript
STATES = {
  BACKLOG: 'BACKLOG', // Ordered list of stories to draft
  TODO: 'TODO', // Single story ready for drafting
  IN_PROGRESS: 'IN_PROGRESS', // Single story being implemented
  DONE: 'DONE', // Completed stories with dates/points
};

STATUS = {
  DRAFT: 'Draft', // Story created, awaiting review
  READY: 'Ready', // Approved, ready for implementation
  IN_REVIEW: 'In Review', // Implementation done, awaiting approval
  DONE: 'Done', // Completed and approved
};
```

**Critical Rules**:

1. **Only ONE story in TODO at a time**
2. **Only ONE story in IN PROGRESS at a time**
3. **Single source of truth**: `mam-workflow-status.md`
4. **No searching**: Always read from status file
5. **Atomic transitions**: No skipping states

**Key Methods**:

```javascript
async load()                      // Load status file
parseStatusFile(content)          // Parse to state
async save()                      // Save status file
generateStatusFile(state)         // State to markdown
validate()                        // Check rules
async backlogToTodo()             // BACKLOG → TODO
async todoToInProgress()          // TODO → IN PROGRESS
async inProgressToDone()          // IN PROGRESS → DONE
async initializeFromEpics(path)   // Bootstrap from Epics.md
extractStoriesFromEpics(content)  // Parse Epics.md
```

**State Transitions**:

```
BACKLOG → TODO:
  - Only if TODO is empty
  - Moves first story from BACKLOG to TODO
  - Sets status to "Draft"

TODO → IN PROGRESS:
  - Only if IN PROGRESS is empty
  - Moves story from TODO to IN PROGRESS
  - Sets status to "Ready"
  - Automatically moves next BACKLOG story to TODO

IN PROGRESS → DONE:
  - Moves story to DONE
  - Sets status to "Done"
  - Adds completion date (YYYY-MM-DD)
  - IN PROGRESS becomes empty
```

**Story Format**:

```
- [STORY-ID] Title (filename.md) [Status: Draft] [Points: 5] [Date: 2025-10-17]
```

---

### 6. Configuration Manager (`scripts/core/config-manager.js`)

**Purpose**: Load, validate, and manage MADACE configuration.

**Responsibilities**:

- Auto-detect configuration location
- Load and parse config.yaml
- Validate required fields
- Resolve paths (cross-platform)
- Installation validation
- Schema enforcement

**Configuration Schema**:

```yaml
# Core settings
project_name: string # Required - project name
output_folder: string # Required - output directory
user_name: string # Required - user's name
communication_language: string # Required - UI language

# Optional settings
madace_version: string # Framework version
installed_at: string # Installation date (ISO 8601)
ide: string # IDE type (cursor, vscode, etc.)

# Module settings
modules:
  mam:
    enabled: boolean
  mab:
    enabled: boolean
  cis:
    enabled: boolean
```

**Path Resolution** (Cross-Platform):

- `madace_root`: Installation directory
- `project_root`: Project root directory
- `output_folder`: Resolved output path
- All paths use `path.join()` for OS compatibility

---

### 7. Manifest Manager (`scripts/core/manifest-manager.js`)

**Purpose**: Track installed agents, workflows, and tasks.

**Responsibilities**:

- Read/write CSV manifests
- Registry management
- Component discovery
- Installation tracking
- Statistics and reporting

**Manifest Files**:

**Agent Manifest** (`madace/_cfg/agent-manifest.csv`):

```csv
agent_id,name,module,type,file_path,installed_at
madace/core/agents/master.md,MADACE Master,core,orchestrator,madace/core/agents/master.agent.yaml,2025-10-17T12:00:00Z
```

**Workflow Manifest** (`madace/_cfg/workflow-manifest.csv`):

```csv
workflow_id,name,module,workflow_path,installed_at
madace/mam/workflows/plan-project,Plan Project,mam,madace/mam/workflows/plan-project/workflow.yaml,2025-10-17T12:00:00Z
```

**Task Manifest** (`madace/_cfg/task-manifest.csv`):

```csv
task_id,name,module,installed_at
madace/mam/tasks/create-story,Create Story,mam,2025-10-17T12:00:00Z
```

---

## Module System

### Module Structure

```
modules/{module-name}/
├── _module-installer/              # Installation configuration
│   ├── install-menu-config.yaml    # Installation Q&A
│   ├── installer.js                # Installation logic
│   └── platform-specifics/         # IDE-specific features
│       ├── cursor/
│       ├── vscode/
│       └── claude-code/
├── agents/                         # Agent definitions
│   └── *.agent.yaml
├── workflows/                      # Workflow definitions
│   └── {workflow-name}/
│       ├── workflow.yaml
│       ├── templates/
│       │   └── *.md
│       └── README.md
└── README.md                       # Module documentation
```

### Core Modules

#### 1. MADACE Core (`modules/core/`)

**Purpose**: Framework orchestration and universal features.

**Agents**:

- **MADACE Master** - Central orchestrator for local environments

**Workflows**:

- System initialization
- Configuration management
- Agent discovery

#### 2. MADACE Method - MAM (`modules/mam/`)

**Purpose**: Agile software development with scale-adaptive planning.

**Agents**:

- **PM** (Product Manager) - Scale-adaptive planning (Level 0-4)
- **Analyst** - Requirements discovery and research
- **Architect** - Solution architecture and JIT tech specs
- **SM** (Scrum Master) - Story lifecycle management
- **DEV** (Developer) - Implementation and code review

**Workflows**:

**Phase 1 - Analysis (Optional)**:

- `brainstorm-project` - Explore solution space
- `research` - Conduct research
- `product-brief` - Strategic planning

**Phase 2 - Planning (Required)**:

- `plan-project` - Scale-adaptive router (Level 0-4)
- `assess-scale` - Determine project complexity
- `detect-project-type` - Identify project type

**Phase 3 - Solutioning (Levels 3-4)**:

- `solution-architecture` - Overall architecture + ADRs
- `jit-tech-spec` - Per-epic technical specifications

**Phase 4 - Implementation**:

- `workflow-status` - Check current phase and story state
- `init-backlog` - Initialize from Epics.md
- `create-story` - Draft story from TODO
- `story-ready` - Approve story (TODO → IN PROGRESS)
- `story-context` - Generate dynamic context injection
- `dev-story` - Implement story
- `story-approved` - Mark done (IN PROGRESS → DONE)
- `retrospective` - Capture epic learnings

#### 3. MADACE Builder - MAB (`modules/mab/`)

**Purpose**: Create custom agents, workflows, and modules.

**Agents**:

- **Builder** - Guides agent/workflow/module creation

**Workflows**:

- `create-agent` - Generate agent YAML files
- `create-workflow` - Generate workflow structures
- `create-module` - Scaffold new modules

**Templates**:

- Agent templates (module, standalone, core types)
- Workflow templates
- Module structure templates

#### 4. Creative Intelligence Suite - CIS (`modules/cis/`)

**Purpose**: Unlock innovation and creative problem-solving.

**Agents**:

- **Creativity** - Creativity facilitation

**Workflows**:

- `scamper` - SCAMPER brainstorming
- `six-hats` - Six Thinking Hats
- `design-thinking` - Design Thinking process
- `mind-map` - Mind mapping
- `innovation-challenge` - Innovation challenges

---

## Agent System

### Agent Lifecycle

```
1. YAML Definition
   ↓
2. Agent Loader (Parse & Validate)
   ↓
3. Agent Runtime (Initialize Context)
   ↓
4. Critical Actions (Execute on Load)
   ↓
5. Persona Display (Show to User)
   ↓
6. Menu Display (Available Commands)
   ↓
7. Command Execution (User Triggers)
   ↓
8. Workflow Execution (If workflow action)
```

### Agent Components

**1. Metadata**:

- `id`: Unique identifier (e.g., `madace/mam/agents/pm.md`)
- `name`: Short name (e.g., `PM`)
- `title`: Full title (e.g., `Product Manager - Scale-Adaptive Planning Expert`)
- `icon`: Emoji representation (e.g., `📋`)
- `module`: Module name (e.g., `mam`)
- `version`: Agent version (e.g., `1.0.0`)

**2. Persona**:

- `role`: Primary role description
- `identity`: Detailed identity and expertise
- `communication_style`: How agent communicates
- `principles`: Core operating principles

**3. Critical Actions**:

- Execute automatically on agent load
- Validate configuration
- Check installation integrity
- Load manifests
- Setup environment

**4. Menu**:

- `trigger`: Command trigger (e.g., `*workflow-status`)
- `action`: What happens (workflow, elicit, guide, custom)
- `description`: User-facing description

**5. Prompts** (Optional):

- Reusable prompt templates
- Can be invoked by trigger
- Reduce duplication

### Agent Discovery

Agents are discoverable via:

1. **Manifest System**: Central registry of all installed agents
2. **Directory Scanning**: Find agents in module directories
3. **Agent ID**: Unique identifier-based lookup
4. **Module Filtering**: List agents by module
5. **Statistics**: Count by module and type

---

## Workflow System

### Workflow Lifecycle

```
1. YAML Definition
   ↓
2. Workflow Engine (Load & Validate)
   ↓
3. Initialize State (Create state file)
   ↓
4. Execute Steps Sequentially
   │ ↓
   │ Step 1 → elicit/reflect/guide/template/validate
   │ ↓
   │ Step 2 → ...
   │ ↓
   │ Step N
   ↓
5. Save State (After each step)
   ↓
6. Complete Workflow
```

### Workflow Features

**1. Multi-Step Execution**:

- Sequential step execution
- State tracking per step
- Progress monitoring
- Failure handling

**2. Step Types**:

- **elicit**: Ask user for input
- **reflect**: Prompt reflection
- **guide**: Provide guidance
- **template**: Render template
- **validate**: Apply validation rules
- **sub-workflow**: Execute nested workflow

**3. State Persistence**:

- JSON state files (`.{workflow}.state.json`)
- Step-by-step tracking
- Resume on failure
- Progress reporting

**4. Context Passing**:

- Initial context from agent runtime
- Step-specific context
- Context merging for sub-workflows
- Variable availability in templates

**5. Sub-Workflows** (Story F11):

- Nested workflow execution
- Context inheritance from parent
- Independent state tracking
- Parent workflow reference

### Workflow Dependencies

```yaml
workflow:
  name: Solution Architecture
  dependencies:
    - plan-project # Must run first
    - assess-scale # Must determine level
  steps: [...]
```

Planned for v1.0-beta:

- Dependency validation
- Auto-execution of prerequisites
- Dependency graph visualization

---

## State Machine

### State Machine Rules

**1. Single Source of Truth**:

- `docs/mam-workflow-status.md` is the ONLY authoritative source
- Agents never search for stories
- Always read exact story from status file
- No caching of state (always reload)

**2. One-at-a-Time Rule**:

- Only ONE story in TODO
- Only ONE story in IN PROGRESS
- Enforced by state machine
- Violations throw errors

**3. Atomic Transitions**:

- No skipping states
- BACKLOG must go to TODO first
- TODO must go to IN PROGRESS before DONE
- No direct BACKLOG → DONE

**4. Automatic Progression**:

- When TODO → IN PROGRESS, next BACKLOG → TODO automatically
- Eliminates manual status file editing
- Maintains flow

### State File Format

```markdown
# MAM Workflow Status

**Current Phase:** Phase 4 - Implementation

---

## BACKLOG

Stories to be drafted (ordered by priority):

- [F32] Epic Initialization (story-f32.md)
- [F33] Story Selection (story-f33.md)
- [F34] Story Drafting (story-f34.md)

## TODO

Story ready for drafting (only ONE at a time):

- [F31] State Machine (story-f31.md) [Status: Draft]

## IN PROGRESS

Story being implemented (only ONE at a time):

- [F30] Workflow Status (story-f30.md) [Status: Ready]

## DONE

Completed stories:

- [F29] Planning Complete (story-f29.md) [Status: Done] [Points: 8] [Date:
  2025-10-15]
- [F28] PRD Generated (story-f28.md) [Status: Done] [Points: 5] [Date:
  2025-10-14]
```

---

## Template Engine

### Variable Substitution

**Pattern Matching**:

```javascript
// Single brace (default for workflows)
{user_name} → "John Doe"
{project-root} → "/Users/john/project"

// Mustache (Markdown templates)
{{variable_name}} → "value"

// Dollar brace (code contexts)
${variable_name} → "value"

// Percent (Windows env)
%VARIABLE_NAME% → "value"

// Dollar (shell)
$variable_name → "value"
```

**Nested Resolution**:

```yaml
variables:
  base_path: '/projects'
  project_path: '{base_path}/{project_name}'
  output_path: '{project_path}/docs'
# After rendering:
# output_path = "/projects/my-project/docs"
```

**Context Building**:

```javascript
const context = templateEngine.buildContext(
  standardVars, // MADACE standard variables
  configVars, // From config.yaml
  agentVars, // From agent context
  workflowVars // From workflow execution
);
// Later sources override earlier
```

### Template Validation

```javascript
const result = await templateEngine.validateTemplate(
  'templates/PRD.md',
  ['project_name', 'user_name', 'current_date']
);

// Result:
{
  valid: boolean,
  foundVars: ['project_name', 'user_name', 'output_folder'],
  requiredVars: ['project_name', 'user_name', 'current_date'],
  missingVars: ['current_date'],
  extraVars: ['output_folder']
}
```

---

## Configuration Management

### Configuration Loading

**Auto-Detection Order**:

1. `./madace/core/config.yaml` (current directory)
2. `../madace/core/config.yaml` (parent directory)
3. `$MADACE_CONFIG` environment variable
4. `~/.madace/config.yaml` (user home)

**Path Resolution**:

```javascript
{
  _paths: {
    madace_root: '/Users/john/project/madace',
    project_root: '/Users/john/project',
    output_folder: '/Users/john/project/docs',
    config_file: '/Users/john/project/madace/core/config.yaml'
  }
}
```

**Installation Validation**:

```javascript
{
  valid: boolean,
  issues: [
    'Missing madace/core directory',
    'Invalid config.yaml structure'
  ],
  warnings: [
    'No agents installed',
    'Output folder does not exist'
  ]
}
```

---

## Manifest System

### Registry Operations

**Writing to Manifest**:

```javascript
await manifestManager.addAgent({
  agent_id: 'madace/mam/agents/pm.md',
  name: 'PM',
  module: 'mam',
  type: 'specialized',
  file_path: 'madace/mam/agents/pm.agent.yaml',
  installed_at: '2025-10-17T12:00:00Z',
});
```

**Reading from Manifest**:

```javascript
const agents = await manifestManager.readAgentManifest();
// Returns array of agent records

const workflows = await manifestManager.readWorkflowManifest();
// Returns array of workflow records
```

**Statistics**:

```javascript
const stats = await manifestManager.getStats();
// {
//   totalAgents: 10,
//   totalWorkflows: 25,
//   totalTasks: 15,
//   byModule: { core: 1, mam: 5, mab: 1, cis: 3 }
// }
```

---

## Data Flow

### Typical User Story Implementation Flow

```
1. User runs: madace sm workflow-status
   ↓
2. SM Agent loads
   ↓
3. Critical actions execute:
   - check-config
   - validate-installation
   - load-manifest
   ↓
4. Persona and menu display
   ↓
5. Workflow-status workflow executes
   ↓
6. State Machine loads status file
   ↓
7. Current state displayed:
   - BACKLOG: 5 stories
   - TODO: [F31] State Machine Implementation
   - IN PROGRESS: None
   - DONE: 25 stories
   ↓
8. User runs: madace sm create-story
   ↓
9. Create-story workflow executes:
   Step 1: Read TODO story from status file
   Step 2: Load story template
   Step 3: Elicit story details from user
   Step 4: Render story file
   Step 5: Save to docs/
   ↓
10. User runs: madace sm story-ready
    ↓
11. Story-ready workflow executes:
    Step 1: Validate TODO story
    Step 2: State transition: TODO → IN PROGRESS
    Step 3: Next BACKLOG → TODO (automatic)
    Step 4: Update status file
    ↓
12. User runs: madace dev dev-story
    ↓
13. Dev-story workflow executes:
    Step 1: Read IN PROGRESS story
    Step 2: Generate story context (XML)
    Step 3: Display relevant architecture/tech-spec
    Step 4: Guide implementation
    ↓
14. User runs: madace dev story-approved
    ↓
15. Story-approved workflow executes:
    Step 1: Validate implementation
    Step 2: State transition: IN PROGRESS → DONE
    Step 3: Add completion date
    Step 4: Update status file
```

---

## Directory Structure

```
MADACE-METHOD/
├── .github/
│   └── workflows/              # CI/CD workflows
│       └── ci.yml
├── .husky/                     # Git hooks
│   └── pre-commit
├── bundles/                    # Web bundles (ChatGPT/Gemini)
├── docs/                       # Documentation
│   ├── README.md
│   └── modules/
│       ├── mam/
│       ├── mab/
│       └── cis/
├── modules/                    # Framework modules
│   ├── core/
│   │   ├── agents/
│   │   │   └── master.agent.yaml
│   │   └── workflows/
│   ├── mam/                    # MADACE Method
│   │   ├── agents/
│   │   │   ├── pm.agent.yaml
│   │   │   ├── analyst.agent.yaml
│   │   │   ├── architect.agent.yaml
│   │   │   ├── sm.agent.yaml
│   │   │   └── dev.agent.yaml
│   │   └── workflows/
│   │       ├── plan-project/
│   │       ├── create-story/
│   │       ├── story-ready/
│   │       └── dev-story/
│   ├── mab/                    # MADACE Builder
│   │   ├── agents/
│   │   │   └── builder.agent.yaml
│   │   └── workflows/
│   │       ├── create-agent/
│   │       ├── create-workflow/
│   │       └── create-module/
│   └── cis/                    # Creative Intelligence Suite
│       ├── agents/
│       │   └── creativity.agent.yaml
│       └── workflows/
│           ├── scamper/
│           ├── six-hats/
│           └── design-thinking/
├── scripts/                    # Core framework code
│   ├── core/                   # Core engine
│   │   ├── agent-loader.js
│   │   ├── agent-runtime.js
│   │   ├── workflow-engine.js
│   │   ├── template-engine.js
│   │   ├── state-machine.js
│   │   ├── config-manager.js
│   │   ├── manifest-manager.js
│   │   └── platform-injections.js
│   ├── cli/                    # CLI commands
│   │   ├── madace.js
│   │   └── installer.js
│   └── build/                  # Build tools
│       ├── bundler.js
│       ├── validator.js
│       └── flattener.js
├── test-alpha.mjs              # Alpha test suite
├── package.json
├── README.md
├── ARCHITECTURE.md             # This file
├── CLAUDE.md                   # AI assistant guide
├── CHANGELOG.md
├── TERMINOLOGY-REFERENCE.md
└── PRD-MADACE-CORE.md
```

### User Project Structure (After Installation)

```
your-project/
├── madace/                     # MADACE installation
│   ├── _cfg/                   # Configuration and manifests
│   │   ├── agent-manifest.csv
│   │   ├── workflow-manifest.csv
│   │   └── task-manifest.csv
│   ├── core/
│   │   ├── config.yaml         # Core configuration
│   │   ├── agents/
│   │   └── workflows/
│   ├── mam/                    # MAM module (if installed)
│   ├── mab/                    # MAB module (if installed)
│   └── cis/                    # CIS module (if installed)
├── docs/                       # Output folder (configurable)
│   ├── PRD.md
│   ├── Epics.md
│   ├── tech-spec.md
│   ├── mam-workflow-status.md
│   └── story-*.md
└── [your project files]
```

---

## Design Patterns

### 1. Singleton Pattern

Used for core engine components:

- `AgentLoader` - Single instance for consistency
- `AgentRuntime` - Single instance for state management
- `WorkflowEngine` - Single instance for workflow state
- `TemplateEngine` - Single instance for template cache
- `StateMachine` - Single instance per status file

**Rationale**: Ensures consistent state management and prevents duplicate
initialization.

### 2. Builder Pattern

Used for context building:

- `AgentRuntime._buildExecutionContext()` - Assembles complex context
- `TemplateEngine.buildContext()` - Merges variable sources
- Configuration resolution - Builds paths and settings

**Rationale**: Complex object construction with many optional fields.

### 3. Strategy Pattern

Used for variable interpolation:

- Multiple patterns (singleBrace, mustache, dollarBrace, etc.)
- Selectable at runtime
- Pattern priority configuration

**Rationale**: Different contexts need different substitution strategies.

### 4. State Pattern

Used for workflow and story state management:

- Workflow states: initialized, running, completed, failed
- Story states: BACKLOG, TODO, IN PROGRESS, DONE
- Atomic state transitions

**Rationale**: Well-defined state machines with strict transition rules.

### 5. Command Pattern

Used for agent menu system:

- Menu items as commands
- Trigger-based invocation
- Action types (workflow, elicit, guide, custom)

**Rationale**: Encapsulates actions as objects, supports undo/history.

### 6. Template Method Pattern

Used for workflow execution:

- `initializeWorkflow()` - Setup
- `executeStep()` - Per-step execution
- `completeWorkflow()` - Teardown

**Rationale**: Defines skeleton of workflow execution, steps vary.

### 7. Observer Pattern

Planned for v1.0-beta:

- Workflow progress notifications
- State change events
- Agent lifecycle hooks

**Rationale**: Loosely coupled communication between components.

---

## Extension Points

### 1. Custom Agents

Create new agents by:

1. Define agent YAML file
2. Add to `modules/{module}/agents/`
3. Register in manifest
4. Define persona, menu, prompts

**Example**:

```yaml
agent:
  metadata:
    id: madace/custom/agents/security.md
    name: Security
    title: Security Auditor
  persona:
    role: Security expert and code reviewer
    identity: I analyze code for security vulnerabilities
  menu:
    - trigger: '*audit'
      action: 'workflow:security-audit'
      description: Run security audit
```

### 2. Custom Workflows

Create new workflows by:

1. Define workflow YAML file
2. Create templates directory
3. Add to `modules/{module}/workflows/`
4. Register in manifest

**Example**:

```yaml
workflow:
  name: Security Audit
  description: Audit code for security issues
  steps:
    - name: Scan Dependencies
      action: validate
      rules: [...]
    - name: Generate Report
      action: template
      template: templates/audit-report.md
```

### 3. Custom Modules

Create new modules by:

1. Use MAB's `create-module` workflow
2. Define `_module-installer/`
3. Add agents and workflows
4. Create module README

**Structure**:

```
modules/your-module/
├── _module-installer/
│   └── install-menu-config.yaml
├── agents/
├── workflows/
└── README.md
```

### 4. Custom Step Actions

Extend workflow engine with new action types:

1. Modify `WorkflowEngine._executeStepAction()`
2. Add new case to switch statement
3. Implement action logic

**Example**:

```javascript
case 'api-call':
  result.type = 'api_call';
  result.endpoint = step.endpoint;
  result.method = step.method;
  await makeApiCall(step);
  break;
```

### 5. Custom Critical Actions

Extend agent runtime with new critical actions:

1. Modify `AgentRuntime._executeAction()`
2. Add new case to switch statement
3. Implement action logic

**Example**:

```javascript
case 'check-dependencies':
  await this._checkDependencies();
  break;
```

### 6. Custom Interpolation Patterns

Add new variable patterns:

1. Modify `TemplateEngine.patterns`
2. Add regex pattern
3. Update pattern priority

**Example**:

```javascript
// [[variable-name]] - Wiki-style
wikiStyle: /\[\[(\w+)\]\]/g;
```

---

## Security Considerations

### 1. Path Traversal Protection

**Risk**: Malicious paths could access files outside project.

**Mitigation**:

- Always use `path.resolve()` for absolute paths
- Validate paths are within project boundaries
- No user-provided paths without validation
- Sandbox file operations to project directory

### 2. YAML Injection

**Risk**: Malicious YAML could execute code.

**Mitigation**:

- Use `yaml.load()` not `yaml.safeLoad()` (js-yaml v4+)
- No executable code in YAML (by design)
- Schema validation before processing
- Reject unknown fields

### 3. Template Injection

**Risk**: Variables could inject malicious content.

**Mitigation**:

- No eval() or Function() on templates
- Variables are always string-escaped
- Strict mode throws on missing variables
- Template validation before rendering

### 4. Command Injection

**Risk**: Shell commands could be injected.

**Mitigation**:

- No shell command execution from templates
- No user input in bash commands
- Validate all CLI arguments
- Use parameterized commands

### 5. File System Access

**Risk**: Unauthorized file access or modification.

**Mitigation**:

- Always check file existence before operations
- Atomic file writes (planned for v1.0-beta)
- File locking for concurrent writes (planned)
- Move to trash vs permanent deletion (planned)

### 6. Secrets in Configuration

**Risk**: API keys or passwords in config files.

**Mitigation**:

- Config files are user-local (.gitignore)
- No secrets in templates or YAML by design
- Warning messages if sensitive patterns detected
- Environment variable support (planned)

### 7. Manifest Tampering

**Risk**: Malicious manifest entries.

**Mitigation**:

- CSV format (no code execution)
- Validation on manifest read
- Checksums for integrity (planned for v1.0-beta)
- Manifest signing (planned for v1.0)

---

## Performance Considerations

### 1. YAML Parsing

**Bottleneck**: Parsing large YAML files.

**Optimization**:

- Cache parsed agents (planned)
- Lazy loading of workflows
- Validate only when needed
- Stream parsing for large files (future)

### 2. File I/O

**Bottleneck**: Repeated file reads.

**Optimization**:

- State caching (planned)
- Batch file operations
- Async file operations (current)
- Memory-mapped files for large templates (future)

### 3. Template Rendering

**Bottleneck**: Large templates with many variables.

**Optimization**:

- Compiled template cache (planned)
- Lazy variable resolution
- Parallel template rendering
- Pre-computed standard variables

### 4. State Machine Operations

**Bottleneck**: Frequent status file reads/writes.

**Optimization**:

- In-memory state caching
- Atomic file operations
- Debounced writes (batch updates)
- State file compression (future)

---

## Testing Strategy

### Current Status (v1.0-alpha.2)

**Test Infrastructure**: Basic alpha tests (12 tests, 100% pass rate)

**Test File**: `test-alpha.mjs`

**Coverage**:

- Agent loading and validation
- Workflow loading
- Template variable substitution
- Module structure validation
- Build tools presence

### Planned for v1.0-beta

**Unit Tests**:

- Core components (agent loader, workflow engine, etc.)
- Template engine patterns
- State machine transitions
- Configuration management

**Integration Tests**:

- End-to-end workflow execution
- Multi-agent collaboration
- State persistence and recovery
- Cross-platform path handling

**System Tests**:

- Installation on all platforms (macOS/Linux/Windows)
- IDE integrations (Cursor, VS Code, Claude Code, etc.)
- Module installation and uninstallation
- Upgrade scenarios

**Test Commands**:

```bash
npm test                # Run all tests
npm run test:unit       # Unit tests
npm run test:integration # Integration tests
npm run test:e2e        # End-to-end tests
npm run test:coverage   # Coverage report (goal: >70%)
```

---

## Future Architecture Enhancements

### v1.0-beta (Q2 2026)

**Core Stability**:

- State machine validation and recovery
- YAML schema validation (JSON Schema)
- Error handling framework with structured logging
- Atomic file operations with rollback
- Config migration system

**Web Bundles**:

- Full ChatGPT Custom GPT support
- Gemini Gems integration
- Hybrid workflow (web + IDE)

**Orchestration**:

- Workflow dependencies (DAG)
- Workflow composition
- Progress dashboard
- Time tracking

### v1.0 Stable (Q3 2026)

**Enterprise Features**:

- Team collaboration
- Jira/GitHub integration
- Compliance reporting

**Advanced Integration**:

- MCP tools auto-discovery
- AI model selection
- CI/CD integration
- Telemetry (opt-in)

**Community Ecosystem**:

- Module repository
- Quality standards
- Module versioning

---

## References

### Internal Documentation

- [README.md](./README.md) - Framework overview
- [CLAUDE.md](./CLAUDE.md) - AI assistant development guide
- [PRD-MADACE-CORE.md](./PRD-MADACE-CORE.md) - Product requirements
- [PRD-MADACE-FEATURES-TO-MERGE.md](./PRD-MADACE-FEATURES-TO-MERGE.md) - Roadmap
- [TERMINOLOGY-REFERENCE.md](./TERMINOLOGY-REFERENCE.md) - Complete terminology
- [CHANGELOG.md](./CHANGELOG.md) - Version history

### External Resources

- [YAML Specification](https://yaml.org/spec/1.2/spec.html)
- [Node.js Documentation](https://nodejs.org/docs/latest-v20.x/api/)
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [js-yaml](https://github.com/nodeca/js-yaml) - YAML parser
- [ESLint](https://eslint.org/) - Code quality
- [Prettier](https://prettier.io/) - Code formatting

---

**Document Version:** 1.0 **MADACE Version:** v1.0-alpha.2 **Last Updated:**
2025-10-17 **Maintained By:** MADACE Core Team
