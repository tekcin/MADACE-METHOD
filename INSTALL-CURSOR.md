# MADACE-METHOD Installation Guide for Cursor

**Version:** v1.0-alpha.2 **Platform:** Cursor IDE (AI-Native Development
Environment) **Last Updated:** 2025-10-17

---

## Overview

This guide provides step-by-step instructions for installing and using
MADACE-METHOD with Cursor, the AI-first code editor. Cursor is built on VS Code
and provides native AI integration, making it an ideal platform for
MADACE-METHOD's agent-based workflows.

**Key Advantages of Cursor:**

- Native AI integration (no extensions needed)
- Built-in context loading for agents
- Composer mode for multi-file operations
- Chat interface optimized for development workflows
- VS Code compatibility with enhanced AI features

**Important Note:** The automated installer (`madace install`) is currently in
development for v1.0-beta. This guide provides manual installation steps that
work today with platform-specific optimizations for Cursor.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Install Cursor](#step-1-install-cursor)
3. [Step 2: Install Node.js](#step-2-install-nodejs)
4. [Step 3: Clone MADACE-METHOD Repository](#step-3-clone-madace-method-repository)
5. [Step 4: Install Dependencies](#step-4-install-dependencies)
6. [Step 5: Manual Installation to Your Project](#step-5-manual-installation-to-your-project)
7. [Step 6: Configure MADACE](#step-6-configure-madace)
8. [Step 7: Using MADACE with Cursor](#step-7-using-madace-with-cursor)
9. [Step 8: Cursor-Specific Features](#step-8-cursor-specific-features)
10. [Verification](#verification)
11. [Troubleshooting](#troubleshooting)
12. [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have:

- **Operating System:** macOS, Linux, or Windows
- **Administrator Access:** For installing software
- **Internet Connection:** For downloading packages
- **Basic Command Line Knowledge:** You'll be using Terminal (Mac/Linux) or
  Command Prompt (Windows)
- **AI Provider Account:** Cursor supports Claude, GPT-4, and other models

---

## Step 1: Install Cursor

### 1.1 Download Cursor

1. **Visit Cursor Website:**
   - Go to [https://cursor.sh](https://cursor.sh)
   - Click the **Download** button

2. **Choose Your Platform:**
   - **macOS:** Download the `.dmg` file
   - **Windows:** Download the `.exe` installer
   - **Linux:** Download the `.AppImage` or `.deb` package

### 1.2 Install Cursor

#### macOS:

1. Open the downloaded `.dmg` file
2. Drag **Cursor** to your Applications folder
3. Open Cursor from Applications
4. If prompted about "unverified developer":
   - Right-click Cursor → Open
   - Click "Open" in the security dialog

#### Windows:

1. Run the downloaded `.exe` installer
2. Follow the installation wizard
3. Choose installation location (default is recommended)
4. Select "Add to PATH" if prompted
5. Launch Cursor from Start Menu or Desktop

#### Linux:

**For .AppImage:**

```bash
# Make executable
chmod +x Cursor-*.AppImage

# Run Cursor
./Cursor-*.AppImage
```

**For .deb (Ubuntu/Debian):**

```bash
sudo dpkg -i cursor_*.deb
sudo apt-get install -f  # Fix dependencies if needed
```

### 1.3 Configure AI Provider

On first launch, Cursor will prompt you to set up AI access:

1. **Choose AI Provider:**
   - **Claude** (Recommended for MADACE) - Anthropic API key
   - **GPT-4** - OpenAI API key
   - **Other Models** - Azure, Gemini, etc.

2. **Enter API Key:**
   - Click **Settings** (gear icon) → **AI Settings**
   - Select your provider
   - Enter your API key
   - Test connection

3. **Privacy Settings:**
   - Choose privacy mode (SOC 2 compliant)
   - Configure telemetry preferences
   - Review data usage policies

> **Tip:** For MADACE-METHOD, Claude (Sonnet or Opus) provides the best
> experience due to its context window and reasoning capabilities.

---

## Step 2: Install Node.js

MADACE-METHOD requires Node.js v20.0.0 or higher.

### 2.1 Check if Node.js is Already Installed

Open Cursor's integrated terminal:

- **Menu:** Terminal → New Terminal
- **Keyboard:** `` Ctrl+` `` (backtick)

Run:

```bash
node --version
```

If you see `v20.0.0` or higher, skip to
[Step 3](#step-3-clone-madace-method-repository).

### 2.2 Install Node.js (If Not Installed)

#### macOS:

**Option 1: Official Installer**

1. Visit [https://nodejs.org](https://nodejs.org)
2. Download the **LTS version** (should be v20.x or higher)
3. Open the downloaded `.pkg` file
4. Follow the installation wizard
5. Restart Cursor's terminal

**Option 2: Using Homebrew** (if installed)

```bash
brew install node@20
```

#### Windows:

1. Visit [https://nodejs.org](https://nodejs.org)
2. Download the **LTS version** (Windows Installer .msi)
3. Run the installer
4. Follow the installation wizard
5. Check "Automatically install necessary tools" when prompted
6. Restart Cursor

#### Linux (Ubuntu/Debian):

```bash
# Install via NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2.3 Verify Installation

Restart Cursor's terminal, then run:

```bash
node --version
npm --version
```

You should see:

```
v20.x.x (or higher)
10.x.x (or higher)
```

---

## Step 3: Clone MADACE-METHOD Repository

### 3.1 Install Git (If Not Installed)

#### macOS:

```bash
# Git is usually pre-installed. If not:
xcode-select --install
```

#### Windows:

1. Download from
   [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Run the installer with default options

#### Linux:

```bash
sudo apt-get install git
```

### 3.2 Clone the Repository Using Cursor

Cursor provides multiple ways to clone repositories:

#### Method 1: Using Command Palette (Recommended)

1. Open Command Palette: `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
2. Type: `Git: Clone`
3. Enter repository URL:
   ```
   https://github.com/tekcin/MADACE-METHOD.git
   ```
4. Choose a location (e.g., `~/Documents/`)
5. Click "Open" when prompted

#### Method 2: Using Terminal

```bash
# Navigate to where you want to store MADACE-METHOD
cd ~/Documents  # or your preferred location

# Clone the repository
git clone https://github.com/tekcin/MADACE-METHOD.git

# Open in Cursor
cd MADACE-METHOD
cursor .
```

> **Note:** Replace `your-org` with the actual GitHub organization once the
> repository is public.

### 3.3 Open MADACE-METHOD in Cursor

If not already open:

1. **File** → **Open Folder**
2. Navigate to the cloned `MADACE-METHOD` directory
3. Click **Open**

---

## Step 4: Install Dependencies

Install all required Node.js packages using Cursor's integrated terminal:

```bash
# Ensure you're in the MADACE-METHOD directory
pwd  # Should show: /path/to/MADACE-METHOD

# Install dependencies
npm install
```

This will install:

- Core dependencies (js-yaml, fs-extra, commander, etc.)
- ESLint and Prettier for code quality
- Pre-commit hooks via Husky
- All development tools

**Expected Output:**

```
added XXX packages in XXs
```

### 4.1 Verify Installation

Run the test suite to ensure everything is working:

```bash
# Run standard tests
npm test

# Run alpha tests
node test-alpha.mjs
```

**Expected Output:**

```
🧪 MADACE-METHOD v1.0-alpha.2 Alpha Test Suite
============================================================
✅ Agent Loader - Load master agent
✅ Agent Loader - Validate PM agent
✅ Agent Loader - Load multiple agents
✅ Template Engine - Variable substitution
✅ Template Engine - Path variables
✅ Workflow Engine - Load workflow
✅ CIS Module - Load creativity agent
✅ MAB Module - Load builder agent
✅ MAM Workflows - PRD template exists
✅ MAM Workflows - Story template exists
✅ State Machine - Module loads
✅ Build Tools - All tools exist

Success Rate: 100.0%
```

---

## Step 5: Manual Installation to Your Project

Since the automated installer is in development, we'll manually copy the
necessary files.

### 5.1 Create Project Directory (If Starting New)

```bash
# Create your project folder
mkdir ~/Documents/my-project
cd ~/Documents/my-project

# Initialize Git (optional but recommended)
git init

# Open in Cursor
cursor .
```

### 5.2 Copy MADACE Modules to Your Project

**Option A: Using Cursor's Terminal**

From the MADACE-METHOD repository directory:

```bash
# Set your project path (update this!)
PROJECT_PATH=~/Documents/my-project

# Create the madace directory structure
mkdir -p "$PROJECT_PATH/madace"
mkdir -p "$PROJECT_PATH/madace/_cfg"

# Copy core modules
cp -r modules/core "$PROJECT_PATH/madace/"
cp -r modules/mam "$PROJECT_PATH/madace/"
cp -r modules/mab "$PROJECT_PATH/madace/"
cp -r modules/cis "$PROJECT_PATH/madace/"

# Copy scripts (needed for local execution)
mkdir -p "$PROJECT_PATH/scripts"
cp -r scripts/core "$PROJECT_PATH/scripts/"
cp -r scripts/cli "$PROJECT_PATH/scripts/"

# Copy package.json dependencies (optional)
cp package.json "$PROJECT_PATH/"
```

**Option B: Using Cursor's File Explorer**

1. Open both folders in Cursor (split view):
   - **File** → **Add Folder to Workspace**
   - Add your project folder

2. In Explorer sidebar:
   - Right-click `modules/` folder → **Copy**
   - Navigate to your project folder → Right-click → **Paste**
   - Rename to `madace/`

### 5.3 Verify Module Structure

Check that your project now has:

```bash
cd "$PROJECT_PATH"
ls -la madace/
```

**Expected Output:**

```
core/          # Core framework agents
mam/           # MADACE Method (agile workflows)
mab/           # MADACE Builder (create agents/workflows)
cis/           # Creative Intelligence Suite
_cfg/          # Configuration and manifests
```

---

## Step 6: Configure MADACE

### 6.1 Create Core Configuration

Using Cursor's terminal in your project directory:

```bash
cd ~/Documents/my-project  # your project directory

# Create config.yaml
cat > madace/core/config.yaml << 'EOF'
project_name: 'My Project'
output_folder: 'docs'
user_name: 'Your Name'
communication_language: 'English'
madace_version: '1.0.0-alpha.2'
installed_at: '2025-10-17'
ide: 'cursor'
EOF
```

### 6.2 Customize Configuration

Open `madace/core/config.yaml` in Cursor and update:

```yaml
project_name: 'Your Actual Project Name'
output_folder: 'docs' # or 'output', 'planning', etc.
user_name: 'Your Name' # How agents will address you
communication_language: 'English' # or your preferred language
ide: 'cursor' # Enables Cursor-specific features
```

**Cursor Tip:** Use `Cmd+P` (Mac) or `Ctrl+P` (Windows/Linux) to quick-open
files:

- Type: `config.yaml`
- Press Enter to open

### 6.3 Create Output Directory

```bash
mkdir -p docs  # or whatever you set as output_folder
```

### 6.4 Initialize Manifests

Create empty manifest files:

```bash
# Create manifest files
touch madace/_cfg/agent-manifest.csv
touch madace/_cfg/workflow-manifest.csv
touch madace/_cfg/task-manifest.csv

# Add CSV headers
echo "agent_id,name,module,type,file_path,installed_at" > madace/_cfg/agent-manifest.csv
echo "workflow_id,name,module,workflow_path,installed_at" > madace/_cfg/workflow-manifest.csv
echo "task_id,name,module,installed_at" > madace/_cfg/task-manifest.csv
```

---

## Step 7: Using MADACE with Cursor

Cursor provides several powerful ways to work with MADACE agents and workflows.

### 7.1 Using Cursor Chat (Recommended)

**Basic Chat Mode:**

1. Open Cursor Chat:
   - Click the chat icon in the sidebar
   - Or press `Cmd+L` (Mac) / `Ctrl+L` (Windows/Linux)

2. Add agent file to context:
   - Type `@Files` in chat
   - Search for and select the agent file (e.g., `pm.agent.yaml`)
   - Or drag the file from Explorer into chat

3. Give the instruction:
   ```
   You are now acting as the PM agent defined in the attached file.
   Follow the persona, communication style, and principles exactly as defined.
   Let's start the plan-project workflow.
   ```

**Example Session:**

```
User: @Files madace/mam/agents/pm.agent.yaml

You are the PM (Product Manager) agent from MADACE-METHOD.
Follow your persona and help me plan a new web application project.

Cursor: I'm your Product Manager for the MADACE Method! I specialize
in scale-adaptive planning. Let's start by assessing your project's
complexity. I have a few questions...
```

### 7.2 Using Cursor Composer (Advanced)

Composer mode is ideal for workflows that generate or modify multiple files:

1. Open Composer:
   - Press `Cmd+K` (Mac) / `Ctrl+K` (Windows/Linux)
   - Or click "Composer" in the sidebar

2. Add context files:
   - Drag agent files (`pm.agent.yaml`, `architect.agent.yaml`)
   - Drag workflow files (`plan-project/workflow.yaml`)
   - Add relevant templates

3. Execute multi-file workflows:

   ```
   Using the PM agent and plan-project workflow, create:
   1. PRD.md in docs/
   2. Epics.md in docs/
   3. tech-spec.md in docs/
   4. mam-workflow-status.md in docs/

   Follow the scale-adaptive planning approach for a Level 3 project.
   ```

**Cursor will:**

- Read all context files
- Generate multiple files simultaneously
- Show diffs before applying changes
- Apply all changes with one click

### 7.3 Using @Codebase (Workspace Search)

For workflow status checks and navigation:

1. In Chat, type `@Codebase`
2. Ask questions about your project:
   ```
   @Codebase What's the current workflow status?
   @Codebase Show me all story files in TODO state
   @Codebase Find the solution architecture document
   ```

Cursor will search your entire workspace and provide context-aware answers.

### 7.4 Loading Multiple Agents

For multi-agent collaboration:

```
@Files madace/mam/agents/pm.agent.yaml
@Files madace/mam/agents/architect.agent.yaml
@Files madace/mam/agents/sm.agent.yaml

You are a team of three MADACE agents working together:
1. PM - Product planning and scale assessment
2. Architect - Technical design and architecture
3. SM - Story lifecycle management

Let's collaborate on planning a new mobile app project.
PM, please start with scale assessment.
```

---

## Step 8: Cursor-Specific Features

### 8.1 Rules for Agents

Create `.cursorrules` in your project root for persistent agent behavior:

```bash
# Create .cursorrules file
cat > .cursorrules << 'EOF'
# MADACE-METHOD Agent Rules for Cursor

## Project Context
This project uses MADACE-METHOD framework with scale-adaptive agile workflows.

## Agent Behavior
When acting as MADACE agents:
1. Always read the agent YAML file for persona, principles, and communication style
2. Follow the Story State Machine: BACKLOG → TODO → IN PROGRESS → DONE
3. Read from mam-workflow-status.md as single source of truth
4. Never search for stories - always read from status file
5. Use scale-adaptive planning (Level 0-4)
6. Create tech specs per epic (Just-In-Time)

## File Patterns
- Agent definitions: madace/*/agents/*.agent.yaml
- Workflows: madace/*/workflows/*/workflow.yaml
- Templates: madace/*/workflows/*/templates/*
- Config: madace/core/config.yaml
- Status: docs/mam-workflow-status.md

## Communication Style
- Ask clarifying questions
- Provide structured frameworks
- Guide through reflective processes
- Amplify human thinking (don't replace it)

## Output Location
All planning documents go in: docs/
EOF
```

### 8.2 Workspace Symbols

Use `Cmd+T` (Mac) / `Ctrl+T` (Windows/Linux) to quickly jump to:

- Agent files: Type `@pm.agent`
- Workflows: Type `plan-project`
- Templates: Type `PRD.md`
- Status: Type `workflow-status`

### 8.3 Terminal Integration

Cursor's terminal supports split panes for parallel operations:

1. **Split Terminal:** Click `+` → **Split Terminal**
2. **Run commands in parallel:**
   - Left pane: `npm run lint:watch`
   - Right pane: Development commands

### 8.4 AI-Powered Code Actions

When editing YAML files:

1. Select text
2. Press `Cmd+K` (Mac) / `Ctrl+K` (Windows/Linux)
3. Ask: "Validate this YAML structure" or "Add a new menu item"

### 8.5 Context Pinning

Pin frequently used agent files:

1. Right-click agent file in Explorer
2. Select "Pin to Quick Access"
3. Access via `Cmd+P` → type `@`

---

## Verification

### Test 1: Cursor Chat with Agent

1. Open Chat (`Cmd+L` / `Ctrl+L`)
2. Type: `@Files madace/core/agents/master.agent.yaml`
3. Ask: "What workflows are available?"
4. Verify: Cursor responds with agent context

### Test 2: CLI Verification

In Cursor's terminal:

```bash
node scripts/cli/madace.js --version
```

**Expected Output:**

```
1.0.0-alpha.2
```

### Test 3: Configuration

```bash
cat madace/core/config.yaml
```

Should show your customized settings with `ide: 'cursor'`.

### Test 4: Agent Files

```bash
ls madace/mam/agents/
```

**Expected Output:**

```
analyst.agent.yaml
architect.agent.yaml
dev.agent.yaml
pm.agent.yaml
sm.agent.yaml
```

### Test 5: Workflow Files

```bash
ls madace/mam/workflows/
```

Should list all available workflows.

### Test 6: Cursor Context Loading

1. Open any agent file in Cursor
2. Press `Cmd+L` / `Ctrl+L` to open Chat
3. Type: `@Files` - the current file should appear as an option
4. Verify: You can add the file to context

---

## Troubleshooting

### Issue: "node: command not found"

**Solution:** Node.js is not installed or not in your PATH.

- Reinstall Node.js following [Step 2](#step-2-install-nodejs)
- Restart Cursor after installation
- Close and reopen terminal in Cursor

### Issue: Cursor can't find agent files in @Files

**Solution:**

1. Ensure your project folder is opened in Cursor (`File → Open Folder`)
2. Refresh the file tree: Right-click Explorer → Refresh
3. Try using absolute path in Chat: `@Files /full/path/to/agent.yaml`
4. Rebuild file index: `Cmd+Shift+P` → "Reload Window"

### Issue: AI not responding with agent context

**Solution:**

1. Verify AI provider is configured: Settings → AI Settings
2. Check API key is valid and has credits
3. Try starting a new chat session
4. Explicitly state: "Use the persona and principles from the attached agent
   file"

### Issue: "Permission denied" when copying files

**Solution:** Use `sudo` (Mac/Linux) or run Cursor as Administrator (Windows):

```bash
sudo cp -r modules/core /path/to/project/madace/
```

### Issue: Workflows not rendering templates correctly

**Solution:**

1. Ensure `output_folder` in config.yaml matches your actual folder
2. Create the output folder if it doesn't exist: `mkdir docs`
3. Check file permissions: `ls -la docs/`
4. Verify template paths in workflow.yaml files

### Issue: Git operations failing in Cursor

**Solution:**

1. Install Git CLI: [Step 3.1](#31-install-git-if-not-installed)
2. Configure Git in terminal:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your@email.com"
   ```
3. Restart Cursor

### Issue: Composer not generating multiple files

**Solution:**

1. Ensure you're in Composer mode (not just Chat)
2. Add all relevant template files to context
3. Be explicit about file paths in your request
4. Check output_folder configuration

### Issue: .cursorrules not being followed

**Solution:**

1. Ensure `.cursorrules` is in project root (not in subdirectory)
2. Reload Cursor: `Cmd+Shift+P` → "Reload Window"
3. Start a new chat session (rules load on session start)
4. Verify file is not in `.gitignore`

---

## Next Steps

### 1. Start Your First Project

Begin with the planning workflow:

1. Open Chat (`Cmd+L` / `Ctrl+L`)
2. Add PM agent: `@Files madace/mam/agents/pm.agent.yaml`
3. Say: "Let's start the plan-project workflow for a new web application"
4. Follow the guided Q&A to create your PRD

### 2. Learn Cursor Workflows

Explore Cursor's features:

- **Chat Mode** - Quick questions and single-file operations
- **Composer Mode** - Multi-file generation and refactoring
- **Cmd+K** - Inline code editing with AI
- **@Codebase** - Workspace-wide search and understanding
- **.cursorrules** - Persistent agent behavior

### 3. Create Custom Agents

Use the MAB module to create your own agents:

1. Open Composer (`Cmd+K`)
2. Add context: `@Files madace/mab/agents/builder.agent.yaml`
3. Add workflow: `@Files madace/mab/workflows/create-agent/workflow.yaml`
4. Say: "Help me create a custom agent for my domain"

### 4. Explore Creativity Workflows

Try the CIS module for brainstorming:

```
@Files madace/cis/agents/creativity.agent.yaml
@Files madace/cis/workflows/scamper/workflow.yaml

Let's brainstorm innovative features for my project using SCAMPER.
```

### 5. Integrate with Your Development Process

As you work:

- Use the Story State Machine (BACKLOG → TODO → IN PROGRESS → DONE)
- Track progress in `docs/mam-workflow-status.md`
- Generate context with `story-context` workflows
- Run retrospectives after each epic
- Use Composer for implementing stories

### 6. Advanced Cursor Features

**Cursor Tab (Copilot++):**

- Auto-completion with full codebase context
- Multi-line suggestions
- Agent-aware completions

**Terminal AI:**

- Ask questions about terminal commands
- Get command suggestions
- Debug terminal errors with AI

**Diff View:**

- Review AI-generated changes before applying
- Accept/reject individual changes
- Compare with previous versions

---

## Cursor vs Other IDEs

Comparison of MADACE experience across different IDEs:

| Feature                   | Cursor                   | Claude Code     | VS Code + Extensions |
| ------------------------- | ------------------------ | --------------- | -------------------- |
| **Agent Loading**         | @Files, drag-drop        | Native          | Manual file loading  |
| **Workflow Execution**    | Chat + Composer          | Built-in        | Guided by AI chat    |
| **Context Injection**     | @Files, @Codebase        | Automatic       | Manual selection     |
| **Multi-File Operations** | Composer (native)        | Multi-file edit | Limited              |
| **Template Rendering**    | AI-generated             | Automated       | Copy-paste           |
| **State Tracking**        | @Codebase search         | Built-in UI     | Manual file editing  |
| **AI Provider**           | Multiple (Claude, GPT-4) | Claude only     | Extension-dependent  |
| **IDE Base**              | VS Code fork             | VS Code fork    | VS Code              |
| **Performance**           | Excellent                | Excellent       | Good                 |

**Cursor Advantages:**

- ✅ Native Composer for multi-file workflows
- ✅ @Codebase for workspace understanding
- ✅ .cursorrules for persistent agent behavior
- ✅ Multiple AI provider support
- ✅ Excellent VS Code compatibility

**Recommendation:** Cursor provides the best balance of native AI features,
MADACE compatibility, and VS Code familiarity.

---

## Cursor-Specific Tips & Tricks

### 1. Quick Agent Switching

Create keyboard shortcuts for common agents:

1. **Settings** → **Keyboard Shortcuts**
2. Search for "Tasks: Run Task"
3. Add custom tasks in `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Load PM Agent",
      "type": "shell",
      "command": "cursor madace/mam/agents/pm.agent.yaml"
    },
    {
      "label": "Load DEV Agent",
      "type": "shell",
      "command": "cursor madace/mam/agents/dev.agent.yaml"
    }
  ]
}
```

### 2. Workflow Templates

Save common prompts as snippets:

1. Create `.vscode/madace-snippets.code-snippets`:

```json
{
  "Load PM Agent": {
    "scope": "markdown",
    "prefix": "madace-pm",
    "body": [
      "@Files madace/mam/agents/pm.agent.yaml",
      "",
      "You are the PM agent. Let's start the plan-project workflow."
    ]
  }
}
```

### 3. Context Profiles

Create different chat sessions for different phases:

- **Chat 1:** Planning (PM + Analyst)
- **Chat 2:** Architecture (Architect)
- **Chat 3:** Implementation (SM + DEV)
- **Chat 4:** Creativity (CIS agents)

Switch between chats to maintain context separation.

### 4. Terminal Automation

Create shell aliases for common operations:

```bash
# Add to ~/.bashrc or ~/.zshrc
alias madace-status='cat docs/mam-workflow-status.md'
alias madace-pm='cursor madace/mam/agents/pm.agent.yaml'
alias madace-dev='cursor madace/mam/agents/dev.agent.yaml'
```

### 5. Git Integration

Use Cursor's Source Control panel for workflow commits:

1. **View** → **Source Control** (or `Ctrl+Shift+G`)
2. Stage files related to current story
3. Write commit message with story reference
4. Use AI to generate commit messages: `Cmd+K` in commit box

---

## Future Enhancements

Planned for v1.0-beta (Q2 2026):

- **Automated Installer:** `madace install` with Cursor detection
- **Native Cursor Extension:** Deep integration with Cursor API
- **Smart Context Loading:** Auto-load relevant agents based on task
- **Status Dashboard:** Visual workflow tracking in Cursor sidebar
- **Hot Reload:** Auto-refresh on agent/workflow changes
- **Cursor Rules Generator:** Auto-generate .cursorrules from agents

---

## Support and Resources

### Documentation

- [README.md](./README.md) - Framework overview
- [CLAUDE.md](./CLAUDE.md) - Architecture guide for AI assistants
- [TERMINOLOGY-REFERENCE.md](./TERMINOLOGY-REFERENCE.md) - Complete terminology
- [INSTALL-VSCODE.md](./INSTALL-VSCODE.md) - VS Code installation (similar to
  Cursor)

### Cursor Resources

- [Cursor Documentation](https://cursor.sh/docs)
- [Cursor Community](https://forum.cursor.sh)
- [Cursor Privacy](https://cursor.sh/privacy)

### Community (Coming Soon)

- Discord Community
- GitHub Issues
- GitHub Discussions

### For AI Assistants

If you're an AI assistant helping with MADACE installation in Cursor, read
[CLAUDE.md](./CLAUDE.md) for:

- Architecture patterns
- Agent design principles
- Workflow execution details
- Common pitfalls to avoid

---

## Quick Reference

### Essential Keyboard Shortcuts

**Cursor AI Features:**

- `Cmd+L` / `Ctrl+L` - Open Chat
- `Cmd+K` / `Ctrl+K` - Open Composer / Inline edit
- `Cmd+Shift+L` - Open Chat in sidebar

**File Navigation:**

- `Cmd+P` / `Ctrl+P` - Quick open file
- `Cmd+T` / `Ctrl+T` - Go to symbol
- `Cmd+Shift+P` / `Ctrl+Shift+P` - Command palette

**Terminal:**

- `` Ctrl+` `` - Toggle terminal
- `Cmd+\` - Split terminal

### Essential Commands

```bash
# Development
npm run lint              # Check code quality
npm run format:fix        # Format code
node test-alpha.mjs       # Run tests

# File Navigation
madace/core/agents/       # Core framework agents
madace/mam/agents/        # MAM agents (PM, SM, DEV, etc.)
madace/mam/workflows/     # MAM workflows
madace/core/config.yaml   # Configuration
docs/mam-workflow-status.md  # Project tracking
```

### Context Loading Patterns

**Basic Agent:**

```
@Files madace/mam/agents/pm.agent.yaml
Act as PM agent and help me plan.
```

**Agent + Workflow:**

```
@Files madace/mam/agents/pm.agent.yaml
@Files madace/mam/workflows/plan-project/workflow.yaml
Execute plan-project workflow.
```

**Multi-Agent:**

```
@Files madace/mam/agents/pm.agent.yaml
@Files madace/mam/agents/architect.agent.yaml
Collaborate on project architecture.
```

**With Codebase:**

```
@Codebase @Files madace/mam/agents/sm.agent.yaml
What's the current workflow status?
```

### Key Files

- `madace/core/config.yaml` - Core configuration
- `.cursorrules` - Cursor agent behavior rules
- `madace/_cfg/agent-manifest.csv` - Installed agents
- `docs/mam-workflow-status.md` - Phase and story tracking

### Common Agents

- **PM** (Product Manager) - Planning and scale assessment
- **Analyst** - Requirements discovery and research
- **Architect** - Technical design and architecture
- **SM** (Scrum Master) - Story lifecycle management
- **DEV** (Developer) - Implementation and code review

---

**Installation Complete!** 🎉

You're now ready to use MADACE-METHOD with Cursor. Start by opening Chat
(`Cmd+L`), loading the PM agent, and running the `plan-project` workflow.

For questions or issues, check the [Troubleshooting](#troubleshooting) section
or refer to the main [README.md](./README.md).

---

**Document Version:** 1.0 **MADACE Version:** v1.0-alpha.2 **Last Updated:**
2025-10-17 **Tested On:** Cursor 0.41+, Node.js v20+, macOS/Linux/Windows
