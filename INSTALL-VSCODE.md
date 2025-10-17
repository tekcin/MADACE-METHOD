# MADACE-METHOD Installation Guide for VS Code

**Version:** v1.0-alpha.2 **Platform:** Visual Studio Code with AI Extensions
**Last Updated:** 2025-10-17

---

## Overview

This guide provides step-by-step instructions for installing and using
MADACE-METHOD with Visual Studio Code. While MADACE-METHOD is primarily designed
for AI-native IDEs like Claude Code, Windsurf, Cursor, and Cline, you can still
use it with VS Code by leveraging compatible AI extensions.

**Important Note:** The automated installer (`madace install`) is currently in
development for v1.0-beta. This guide provides manual installation steps that
work today.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Install VS Code and Extensions](#step-1-install-vs-code-and-extensions)
3. [Step 2: Install Node.js](#step-2-install-nodejs)
4. [Step 3: Clone MADACE-METHOD Repository](#step-3-clone-madace-method-repository)
5. [Step 4: Install Dependencies](#step-4-install-dependencies)
6. [Step 5: Manual Installation to Your Project](#step-5-manual-installation-to-your-project)
7. [Step 6: Configure MADACE](#step-6-configure-madace)
8. [Step 7: Using MADACE with VS Code](#step-7-using-madace-with-vs-code)
9. [Verification](#verification)
10. [Troubleshooting](#troubleshooting)
11. [Next Steps](#next-steps)

---

## Prerequisites

Before you begin, ensure you have:

- **Operating System:** macOS, Linux, or Windows
- **Administrator Access:** For installing software
- **Internet Connection:** For downloading packages
- **Basic Command Line Knowledge:** You'll be using Terminal (Mac/Linux) or
  Command Prompt (Windows)

---

## Step 1: Install VS Code and Extensions

### 1.1 Install Visual Studio Code

1. **Download VS Code:**
   - Visit [https://code.visualstudio.com/](https://code.visualstudio.com/)
   - Click the **Download** button for your operating system
   - Follow the installation wizard

2. **Launch VS Code:**
   - Open Visual Studio Code from your Applications folder (Mac) or Start Menu
     (Windows)

### 1.2 Install AI Extensions (Choose One or More)

MADACE-METHOD works best with AI-powered extensions. Choose from:

#### Option A: Continue (Cline Extension) - Recommended

1. Open VS Code
2. Click the **Extensions** icon in the sidebar (or press `Cmd+Shift+X` /
   `Ctrl+Shift+X`)
3. Search for **"Continue"**
4. Click **Install** on the Continue extension
5. Follow the setup wizard to configure your AI provider (Claude, OpenAI, etc.)

#### Option B: GitHub Copilot Chat

1. Open Extensions (`Cmd+Shift+X` / `Ctrl+Shift+X`)
2. Search for **"GitHub Copilot Chat"**
3. Click **Install**
4. Sign in with your GitHub account (requires Copilot subscription)

#### Option C: Other AI Extensions

Compatible extensions include:

- **Cursor** (standalone IDE with VS Code compatibility)
- **Cody** by Sourcegraph
- **Tabnine**
- **CodeGPT**

---

## Step 2: Install Node.js

MADACE-METHOD requires Node.js v20.0.0 or higher.

### 2.1 Check if Node.js is Already Installed

Open your terminal:

- **Mac:** Applications → Utilities → Terminal
- **Windows:** Start → Command Prompt or PowerShell
- **Linux:** Terminal application

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

#### Linux (Ubuntu/Debian):

```bash
# Install via NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2.3 Verify Installation

Close and reopen your terminal, then run:

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

### 3.2 Clone the Repository

Choose a location for the MADACE-METHOD framework (not your project folder):

```bash
# Navigate to where you want to store MADACE-METHOD
cd ~/Documents  # or your preferred location

# Clone the repository
git clone https://github.com/tekcin/MADACE-METHOD.git

# Navigate into the directory
cd MADACE-METHOD
```

> **Note:** Replace `your-org` with the actual GitHub organization once the
> repository is public.

---

## Step 4: Install Dependencies

Install all required Node.js packages:

```bash
# Inside the MADACE-METHOD directory
npm install
```

This will install:

- Core dependencies (js-yaml, fs-extra, etc.)
- ESLint and Prettier for code quality
- Pre-commit hooks via Husky

**Expected Output:**

```
added XXX packages in XXs
```

### 4.1 Verify Installation

Run the test suite to ensure everything is working:

```bash
npm test
node test-alpha.mjs
```

**Expected Output:**

```
🧪 MADACE-METHOD v1.0-alpha.2 Alpha Test Suite
============================================================
✅ Agent Loader - Load master agent
✅ Agent Loader - Validate PM agent
...
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
```

### 5.2 Copy MADACE Modules to Your Project

From the MADACE-METHOD repository directory:

```bash
# Replace /path/to/your/project with your actual project path
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
```

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

Create the configuration file:

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
ide: 'vscode'
EOF
```

### 6.2 Customize Configuration

Open `madace/core/config.yaml` in VS Code and update:

```yaml
project_name: 'Your Actual Project Name'
output_folder: 'docs' # or 'output', 'planning', etc.
user_name: 'Your Name' # How agents will address you
communication_language: 'English' # or your preferred language
```

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

## Step 7: Using MADACE with VS Code

### 7.1 Open Your Project in VS Code

```bash
# From your project directory
code .
```

Or use VS Code's **File → Open Folder** and select your project.

### 7.2 Load Agent Files with AI Assistant

Since VS Code with AI extensions doesn't have native MADACE integration, you'll
manually load agent context:

#### Method 1: Using Continue (Cline)

1. Open the Continue sidebar (icon in the left sidebar)
2. Click **"+ Add Context"**
3. Select **"File"**
4. Choose the agent file you want to use:
   - `madace/core/agents/master.agent.yaml` - Master orchestrator
   - `madace/mam/agents/pm.agent.yaml` - Product Manager
   - `madace/mam/agents/sm.agent.yaml` - Scrum Master
   - `madace/mam/agents/dev.agent.yaml` - Developer
5. In the chat, type: "You are now acting as [Agent Name]. Follow the persona,
   principles, and menu commands defined in the agent file."

#### Method 2: Using GitHub Copilot Chat

1. Open Copilot Chat panel (`Cmd+Shift+I` / `Ctrl+Shift+I`)
2. Type: `@workspace /explain madace/mam/agents/pm.agent.yaml`
3. Then: "Act as the PM agent defined in this file and help me with planning
   workflows"

#### Method 3: Manual Copy-Paste

1. Open the agent file (e.g., `madace/mam/agents/pm.agent.yaml`)
2. Copy the entire contents
3. Paste into your AI chat with a prompt like:

   ```
   I'm using the MADACE-METHOD framework. Please read this agent definition
   and act as this agent, following the persona, communication style, and
   principles defined:

   [paste agent YAML here]
   ```

### 7.3 Working with Workflows

MADACE workflows guide you through structured processes. To use them:

1. **Check Available Workflows:**

   ```bash
   ls madace/mam/workflows/
   ```

2. **Read Workflow Definition:** Open the workflow file:

   ```bash
   # Example: Planning workflow
   cat madace/mam/workflows/plan-project/workflow.yaml
   ```

3. **Execute Workflow with AI:**
   - Load the workflow file into your AI chat context
   - Ask the AI to guide you through each step
   - The AI will use templates from `workflows/*/templates/`

#### Example: Start a Planning Workflow

```
In your AI chat:

"I want to start the plan-project workflow from MADACE-METHOD.
The workflow is defined in madace/mam/workflows/plan-project/workflow.yaml.
Please guide me through each step, starting with scale assessment."
```

### 7.4 Common Workflows to Try

**Phase 1: Analysis (Optional)**

- `brainstorm-project` - Explore project ideas
- `research` - Conduct research
- `product-brief` - Strategic planning

**Phase 2: Planning (Required)**

- `plan-project` - Scale-adaptive planning (Creates PRD/GDD + Epics)
- `assess-scale` - Determine project complexity (Level 0-4)

**Phase 3: Solutioning (Levels 3-4)**

- `solution-architecture` - Overall architecture + ADRs
- `jit-tech-spec` - Per-epic technical specifications

**Phase 4: Implementation**

- `workflow-status` - Check current phase and story state
- `create-story` - Draft user story from TODO
- `story-ready` - Approve story for development
- `dev-story` - Implement the story
- `story-approved` - Mark story as done

---

## Verification

### Test 1: Agent Loading

Try loading the master agent:

```bash
# In VS Code terminal
node scripts/cli/madace.js --version
```

**Expected Output:**

```
1.0.0-alpha.2
```

### Test 2: Configuration

Verify your config:

```bash
cat madace/core/config.yaml
```

Should show your customized settings.

### Test 3: Agent Files

Check that agent files are accessible:

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

### Test 4: Workflow Files

```bash
ls madace/mam/workflows/
```

Should list all available workflows.

---

## Troubleshooting

### Issue: "node: command not found"

**Solution:** Node.js is not installed or not in your PATH.

- Reinstall Node.js following [Step 2](#step-2-install-nodejs)
- Restart your terminal after installation

### Issue: "Permission denied" when copying files

**Solution:** Use `sudo` (Mac/Linux) or run as Administrator (Windows):

```bash
sudo cp -r modules/core /path/to/project/madace/
```

### Issue: AI extension not seeing agent files

**Solution:**

1. Ensure your project folder is opened in VS Code (`File → Open Folder`)
2. Refresh the workspace (`Cmd+K Cmd+S` / `Ctrl+K Ctrl+S`)
3. Try adding files explicitly to AI context using the extension's file picker

### Issue: Workflows not rendering templates correctly

**Solution:**

1. Ensure `output_folder` in config.yaml matches your actual folder
2. Create the output folder if it doesn't exist: `mkdir docs`
3. Check file permissions: `ls -la docs/`

### Issue: "Module not found" errors

**Solution:**

1. Ensure you ran `npm install` in the MADACE-METHOD directory
2. Copy the `node_modules` folder to your project if needed:
   ```bash
   cp -r /path/to/MADACE-METHOD/node_modules ~/Documents/my-project/
   ```

### Issue: YAML parsing errors

**Solution:**

- Ensure agent/workflow files weren't corrupted during copy
- Re-copy from the original MADACE-METHOD repository
- Validate YAML syntax using an online validator

---

## Next Steps

### 1. Start Your First Project

Begin with the planning workflow:

1. Load the PM agent (`madace/mam/agents/pm.agent.yaml`)
2. Ask your AI: "Let's start the plan-project workflow"
3. Follow the guided Q&A to create your PRD

### 2. Learn the Workflow

Read the documentation:

- [MAM Workflows Guide](./docs/modules/mam/workflows/README.md)
- [CLAUDE.md](./CLAUDE.md) - Architecture and patterns
- [README.md](./README.md) - Full framework overview

### 3. Create Custom Agents

Use the MAB module to create your own agents:

1. Load the Builder agent (`madace/mab/agents/builder.agent.yaml`)
2. Run the `create-agent` workflow
3. Follow the guided process to generate custom agents

### 4. Explore Creativity Workflows

Try the CIS module for brainstorming:

- SCAMPER brainstorming
- Six Thinking Hats
- Design Thinking
- Mind Mapping

### 5. Integrate with Your Development Process

As you work:

- Use the Story State Machine (BACKLOG → TODO → IN PROGRESS → DONE)
- Track progress in `docs/mam-workflow-status.md`
- Generate context with `story-context` workflows
- Run retrospectives after each epic

---

## Differences from AI-Native IDEs

VS Code with AI extensions provides a slightly different experience compared to
AI-native IDEs like Claude Code or Cursor:

| Feature                | AI-Native IDEs    | VS Code + Extensions  |
| ---------------------- | ----------------- | --------------------- |
| **Agent Loading**      | Automatic         | Manual file loading   |
| **Workflow Execution** | Built-in commands | Guided by AI chat     |
| **Context Injection**  | Automatic         | Manual file selection |
| **Template Rendering** | Automated         | Copy-paste approach   |
| **State Tracking**     | Built-in UI       | Manual file editing   |

**Recommendation:** For the best MADACE experience, consider using:

- **Claude Code** (claude.ai/code) - Primary platform
- **Cursor** (cursor.sh) - VS Code fork with native AI
- **Windsurf** (codeium.com/windsurf) - AI-first IDE
- **Cline** - VS Code extension with MADACE support (coming soon)

---

## Future Enhancements

Planned for v1.0-beta (Q2 2026):

- **Automated Installer:** `madace install` will work for all platforms
- **VS Code Extension:** Native MADACE integration
- **CLI Commands:** Full command suite (`madace pm plan-project`, etc.)
- **Status Dashboard:** Visual workflow tracking
- **Hot Reload:** Auto-refresh on agent/workflow changes

---

## Support and Resources

### Documentation

- [README.md](./README.md) - Framework overview
- [CLAUDE.md](./CLAUDE.md) - Architecture guide for AI assistants
- [TERMINOLOGY-REFERENCE.md](./TERMINOLOGY-REFERENCE.md) - Complete terminology

### Community (Coming Soon)

- Discord Community
- GitHub Issues
- GitHub Discussions

### For AI Assistants

If you're an AI assistant helping with MADACE installation, read
[CLAUDE.md](./CLAUDE.md) for:

- Architecture patterns
- Agent design principles
- Workflow execution details
- Common pitfalls to avoid

---

## Quick Reference

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

### Key Files

- `madace/core/config.yaml` - Core configuration
- `madace/_cfg/agent-manifest.csv` - Installed agents
- `madace/_cfg/workflow-manifest.csv` - Available workflows
- `docs/mam-workflow-status.md` - Phase and story tracking

### Common Agents

- **PM** (Product Manager) - Planning and scale assessment
- **Analyst** - Requirements discovery and research
- **Architect** - Technical design and architecture
- **SM** (Scrum Master) - Story lifecycle management
- **DEV** (Developer) - Implementation and code review

---

**Installation Complete!** 🎉

You're now ready to use MADACE-METHOD with VS Code. Start by loading the PM
agent and running the `plan-project` workflow.

For questions or issues, check the [Troubleshooting](#troubleshooting) section
or refer to the main [README.md](./README.md).

---

**Document Version:** 1.0 **MADACE Version:** v1.0-alpha.2 **Last Updated:**
2025-10-17 **Tested On:** VS Code 1.85+, Node.js v20+, macOS/Linux/Windows
