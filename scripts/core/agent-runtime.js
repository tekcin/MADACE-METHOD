/**
 * Agent Runtime - Execution Context and Orchestration
 * Story F3: Agent persona execution context
 * Story F9: Critical actions execution on agent load
 * Story F10: Menu system with command triggers
 * Story F11: Sub-workflow support
 */

import agentLoader from './agent-loader.js';
import workflowEngine from './workflow-engine.js';
import configManager from './config-manager.js';
import manifestManager from './manifest-manager.js';
import chalk from 'chalk';
import boxen from 'boxen';
import Table from 'cli-table3';

/**
 * AgentRuntime class
 * Orchestrates agent execution with persona context, critical actions, and menu system
 */
class AgentRuntime {
  constructor() {
    this.currentAgent = null;
    this.config = null;
    this.context = {};
    this.executionHistory = [];
  }

  /**
   * Load and initialize an agent with full execution context
   * @param {string} agentPath - Path to agent YAML file or agent ID
   * @param {object} options - Runtime options
   * @returns {Promise<object>} Initialized agent with runtime context
   */
  async loadAgent(agentPath, options = {}) {
    try {
      // Load configuration if not already loaded
      if (!this.config) {
        this.config = await configManager.autoLoadConfig();
      }

      // Load agent
      this.currentAgent = await agentLoader.loadAgent(agentPath);

      // Build execution context (Story F3)
      this.context = this._buildExecutionContext(this.currentAgent, options);

      // Execute critical actions (Story F9)
      if (this.currentAgent.agent.critical_actions) {
        await this._executeCriticalActions(this.currentAgent.agent.critical_actions);
      }

      // Display agent persona
      this._displayAgentPersona();

      // Display menu if available (Story F10)
      if (this.currentAgent.agent.menu) {
        this._displayMenu();
      }

      return this.currentAgent;
    } catch (error) {
      throw new Error(`Failed to load agent: ${error.message}`);
    }
  }

  /**
   * Build execution context for agent
   * @private
   */
  _buildExecutionContext(agent, options) {
    const metadata = agent.agent.metadata;
    const persona = agent.agent.persona;

    return {
      // Agent identity
      agent_id: metadata.id,
      agent_name: metadata.name,
      agent_title: metadata.title,
      agent_icon: metadata.icon || '🤖',

      // Persona
      role: persona.role,
      identity: persona.identity,
      communication_style: persona.communication_style,
      principles: persona.principles,

      // Configuration
      config: this.config,
      user_name: this.config.user_name,
      project_name: this.config.project_name,
      communication_language: this.config.communication_language,

      // Paths
      madace_root: this.config._paths.madace_root,
      project_root: this.config._paths.project_root,
      output_folder: this.config._paths.output_folder,

      // Runtime
      loaded_at: agent._runtime.loadedAt,
      session_id: this._generateSessionId(),

      // Options
      ...options,
    };
  }

  /**
   * Execute critical actions on agent load
   * @private
   */
  async _executeCriticalActions(actions) {
    for (const action of actions) {
      try {
        await this._executeAction(action, { critical: true });
        this.executionHistory.push({
          type: 'critical_action',
          action,
          timestamp: new Date().toISOString(),
          status: 'completed',
        });
      } catch (error) {
        console.error(chalk.red(`Critical action failed: ${action}`));
        console.error(chalk.red(error.message));
        this.executionHistory.push({
          type: 'critical_action',
          action,
          timestamp: new Date().toISOString(),
          status: 'failed',
          error: error.message,
        });
      }
    }
  }

  /**
   * Execute a single action
   * @private
   */
  async _executeAction(action, _context = {}) {
    // Action types:
    // - "check-config" - Validate configuration
    // - "validate-installation" - Check installation integrity
    // - "load-manifest" - Load agent/workflow manifests
    // - "create-output-folder" - Ensure output directory exists
    // - Custom actions defined by agents

    switch (action) {
      case 'check-config':
        await this._checkConfig();
        break;

      case 'validate-installation':
        await this._validateInstallation();
        break;

      case 'load-manifest':
        await this._loadManifests();
        break;

      case 'create-output-folder':
        await this._createOutputFolder();
        break;

      default:
        console.log(chalk.yellow(`Custom action: ${action}`));
        break;
    }
  }

  /**
   * Display agent persona
   * @private
   */
  _displayAgentPersona() {
    const agent = this.currentAgent.agent;
    const metadata = agent.metadata;
    const persona = agent.persona;

    const title = `${metadata.icon || '🤖'} ${metadata.title}`;
    const content = [`${chalk.bold('Role:')} ${persona.role}`, '', `${chalk.bold('Identity:')} ${persona.identity}`];

    if (persona.communication_style) {
      content.push('', `${chalk.bold('Communication Style:')} ${persona.communication_style}`);
    }

    console.log(
      boxen(content.join('\n'), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
        title,
        titleAlignment: 'center',
      })
    );
  }

  /**
   * Display agent menu
   * @private
   */
  _displayMenu() {
    const menu = this.currentAgent.agent.menu;

    if (!menu || menu.length === 0) {
      return;
    }

    console.log(chalk.bold.cyan('\n📋 Available Commands:\n'));

    const table = new Table({
      head: [chalk.bold('Command'), chalk.bold('Description')],
      colWidths: [20, 60],
      wordWrap: true,
    });

    menu.forEach((item) => {
      table.push([chalk.green(item.trigger), item.description]);
    });

    console.log(table.toString());
    console.log('');
  }

  /**
   * Execute menu command by trigger
   * @param {string} trigger - Command trigger (e.g., '*workflow-status')
   * @returns {Promise<object>} Execution result
   */
  async executeCommand(trigger) {
    if (!this.currentAgent) {
      throw new Error('No agent loaded. Call loadAgent() first.');
    }

    const menu = this.currentAgent.agent.menu;
    if (!menu) {
      throw new Error('Agent has no menu commands');
    }

    const menuItem = menu.find((item) => item.trigger === trigger);
    if (!menuItem) {
      throw new Error(`Command not found: ${trigger}`);
    }

    console.log(chalk.cyan(`\n▶️  Executing: ${menuItem.description}\n`));

    // Execute the action
    const result = await this._executeMenuAction(menuItem);

    this.executionHistory.push({
      type: 'menu_command',
      trigger,
      action: menuItem.action,
      timestamp: new Date().toISOString(),
      result,
    });

    return result;
  }

  /**
   * Execute menu action
   * @private
   */
  async _executeMenuAction(menuItem) {
    const action = menuItem.action;

    // Action can be:
    // - workflow name (triggers workflow)
    // - "elicit: <prompt>" (ask user for input)
    // - "guide: <guidance>" (provide guidance)
    // - custom action string

    // Check if action is a workflow
    if (action.startsWith('workflow:')) {
      const workflowName = action.replace('workflow:', '').trim();
      return await this._executeWorkflow(workflowName);
    }

    // Check if action is elicit
    if (action.startsWith('elicit:')) {
      const prompt = action.replace('elicit:', '').trim();
      return { type: 'elicit', prompt };
    }

    // Check if action is guide
    if (action.startsWith('guide:')) {
      const guidance = action.replace('guide:', '').trim();
      console.log(chalk.blue(`\n💡 ${guidance}\n`));
      return { type: 'guide', guidance };
    }

    // Default: treat as custom action
    return await this._executeAction(action, { menu: true });
  }

  /**
   * Execute workflow
   * @param {string} workflowName - Workflow name or path
   * @returns {Promise<object>} Workflow result
   */
  async _executeWorkflow(workflowName) {
    // Find workflow in manifests
    const workflows = await manifestManager.readWorkflowManifest();
    const workflow = workflows.find((w) => w.name === workflowName || w.workflow_id.includes(workflowName));

    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowName}`);
    }

    console.log(chalk.cyan(`🔄 Executing workflow: ${workflow.name}`));

    // Initialize workflow
    const workflowPath = workflow.workflow_path;
    const state = await workflowEngine.initializeWorkflow(workflowPath, this.context);

    console.log(chalk.green(`✓ Workflow initialized: ${state.totalSteps} steps`));

    return {
      type: 'workflow',
      workflow: workflow.name,
      state,
    };
  }

  /**
   * Execute sub-workflow (Story F11)
   * @param {string} workflowPath - Path to sub-workflow
   * @param {object} parentContext - Context from parent workflow
   * @returns {Promise<object>} Sub-workflow result
   */
  async executeSubWorkflow(workflowPath, parentContext = {}) {
    console.log(chalk.cyan(`  ↳ Sub-workflow: ${workflowPath}`));

    // Merge parent context with current context
    const mergedContext = {
      ...this.context,
      ...parentContext,
      _parent_workflow: parentContext.workflowName || 'unknown',
    };

    // Load and execute sub-workflow
    const workflow = await workflowEngine.loadWorkflow(workflowPath);
    const state = await workflowEngine.initializeWorkflow(workflowPath, mergedContext);

    return {
      type: 'sub_workflow',
      workflow: workflow.workflow.name,
      state,
      parent: parentContext.workflowName,
    };
  }

  /**
   * Get execution history
   * @returns {object[]} Execution history
   */
  getHistory() {
    return [...this.executionHistory];
  }

  /**
   * Clear execution history
   */
  clearHistory() {
    this.executionHistory = [];
  }

  /**
   * Critical action: Check configuration
   * @private
   */
  async _checkConfig() {
    if (!this.config) {
      throw new Error('Configuration not loaded');
    }
    console.log(chalk.green('✓ Configuration validated'));
  }

  /**
   * Critical action: Validate installation
   * @private
   */
  async _validateInstallation() {
    const result = await configManager.validateInstallation(this.config._paths.madace_root);

    if (!result.valid) {
      console.error(chalk.red('✗ Installation validation failed:'));
      result.issues.forEach((issue) => console.error(chalk.red(`  - ${issue}`)));
      throw new Error('Installation validation failed');
    }

    if (result.warnings.length > 0) {
      console.log(chalk.yellow('⚠ Installation warnings:'));
      result.warnings.forEach((warning) => console.log(chalk.yellow(`  - ${warning}`)));
    } else {
      console.log(chalk.green('✓ Installation validated'));
    }
  }

  /**
   * Critical action: Load manifests
   * @private
   */
  async _loadManifests() {
    manifestManager.initialize(this.config._paths.madace_root);
    const stats = await manifestManager.getStats();
    console.log(chalk.green(`✓ Manifests loaded: ${stats.totalAgents} agents, ${stats.totalWorkflows} workflows`));
  }

  /**
   * Critical action: Create output folder
   * @private
   */
  async _createOutputFolder() {
    const fs = await import('fs-extra');
    await fs.ensureDir(this.config._paths.output_folder);
    console.log(chalk.green(`✓ Output folder ready: ${this.config._paths.output_folder}`));
  }

  /**
   * Generate unique session ID
   * @private
   */
  _generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current context
   * @returns {object} Current execution context
   */
  getContext() {
    return { ...this.context };
  }

  /**
   * Update context
   * @param {object} updates - Context updates
   */
  updateContext(updates) {
    this.context = { ...this.context, ...updates };
  }

  /**
   * Get current agent
   * @returns {object|null} Current agent
   */
  getCurrentAgent() {
    return this.currentAgent;
  }

  /**
   * Unload current agent
   */
  unloadAgent() {
    this.currentAgent = null;
    this.context = {};
  }

  /**
   * Discover available agents (Story A5)
   * @returns {Promise<object[]>} Array of available agents
   */
  async discoverAgents() {
    try {
      if (!this.config) {
        this.config = await configManager.autoLoadConfig();
      }

      manifestManager.initialize(this.config._paths.madace_root);
      const agents = await manifestManager.readAgentManifest();

      return agents.map((agent) => ({
        id: agent.agent_id,
        name: agent.name,
        module: agent.module,
        type: agent.type,
        path: agent.file_path,
      }));
    } catch (error) {
      throw new Error(`Failed to discover agents: ${error.message}`);
    }
  }

  /**
   * Find agent by name or ID
   * @param {string} nameOrId - Agent name or ID
   * @returns {Promise<object|null>} Agent metadata or null
   */
  async findAgent(nameOrId) {
    const agents = await this.discoverAgents();
    return (
      agents.find(
        (agent) =>
          agent.name.toLowerCase() === nameOrId.toLowerCase() || agent.id.toLowerCase().includes(nameOrId.toLowerCase())
      ) || null
    );
  }

  /**
   * List agents by module
   * @param {string} moduleName - Module name (e.g., 'core', 'mam')
   * @returns {Promise<object[]>} Array of agents in module
   */
  async listAgentsByModule(moduleName) {
    const agents = await this.discoverAgents();
    return agents.filter((agent) => agent.module === moduleName);
  }

  /**
   * Get agent statistics
   * @returns {Promise<object>} Agent statistics
   */
  async getAgentStats() {
    const agents = await this.discoverAgents();

    const byModule = {};
    const byType = {};

    agents.forEach((agent) => {
      byModule[agent.module] = (byModule[agent.module] || 0) + 1;
      byType[agent.type] = (byType[agent.type] || 0) + 1;
    });

    return {
      total: agents.length,
      byModule,
      byType,
      modules: Object.keys(byModule),
    };
  }
}

// Export singleton instance
export default new AgentRuntime();
export { AgentRuntime };
