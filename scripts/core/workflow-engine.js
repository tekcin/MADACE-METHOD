/**
 * Workflow Engine - YAML Parser and Executor
 * Story F4: Workflow YAML parser and executor
 * Story F12: Workflow state persistence
 */

import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';

/**
 * Workflow schema validation
 */
const REQUIRED_WORKFLOW_FIELDS = {
  workflow: ['name', 'description', 'steps'],
};

/**
 * WorkflowEngine class
 * Handles loading, parsing, validating, and executing workflow YAML files
 */
class WorkflowEngine {
  constructor() {
    this.currentWorkflow = null;
    this.workflowState = null;
    this.stateFilePath = null;
  }

  /**
   * Load and parse a workflow YAML file
   * @param {string} workflowPath - Absolute path to workflow YAML file
   * @returns {Promise<object>} Parsed and validated workflow object
   */
  async loadWorkflow(workflowPath) {
    try {
      // Validate file exists
      if (!(await fs.pathExists(workflowPath))) {
        throw new Error(`Workflow file not found: ${workflowPath}`);
      }

      // Validate file extension
      const ext = path.extname(workflowPath).toLowerCase();
      if (!['.yaml', '.yml'].includes(ext)) {
        throw new Error(`Invalid workflow file extension: ${ext}. Expected .yaml or .yml`);
      }

      // Read and parse YAML
      const fileContent = await fs.readFile(workflowPath, 'utf8');
      const workflow = yaml.load(fileContent);

      // Validate workflow structure
      this.validateWorkflow(workflow, workflowPath);

      // Add runtime metadata
      workflow._runtime = {
        loadedAt: new Date().toISOString(),
        filePath: workflowPath,
        fileName: path.basename(workflowPath),
        workflowDir: path.dirname(workflowPath),
      };

      return workflow;
    } catch (error) {
      if (error.name === 'YAMLException') {
        throw new Error(`YAML parsing error in ${workflowPath}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Validate workflow structure against schema
   * @param {object} workflow - Parsed workflow object
   * @param {string} filePath - File path for error reporting
   * @throws {Error} If validation fails
   */
  validateWorkflow(workflow, filePath) {
    if (!workflow || typeof workflow !== 'object') {
      throw new Error(`Invalid workflow structure in ${filePath}: Expected object`);
    }

    if (!workflow.workflow) {
      throw new Error(`Missing 'workflow' root key in ${filePath}`);
    }

    // Validate required fields
    for (const field of REQUIRED_WORKFLOW_FIELDS.workflow) {
      if (!workflow.workflow[field]) {
        throw new Error(`Missing required field 'workflow.${field}' in ${filePath}`);
      }
    }

    // Validate steps array
    if (!Array.isArray(workflow.workflow.steps) || workflow.workflow.steps.length === 0) {
      throw new Error(`Invalid 'workflow.steps' in ${filePath}: Expected non-empty array`);
    }

    // Validate each step
    workflow.workflow.steps.forEach((step, index) => {
      if (!step.name) {
        throw new Error(`Missing 'name' in step ${index} in ${filePath}`);
      }
      // Accept both 'action' and 'type' for backward compatibility
      const action = step.action || step.type;
      if (!action) {
        throw new Error(`Missing 'action' or 'type' in step ${index} in ${filePath}`);
      }
      // Normalize to 'action' for internal use
      if (step.type && !step.action) {
        step.action = step.type;
      }
    });

    // Validate dependencies if present
    if (workflow.workflow.dependencies) {
      if (!Array.isArray(workflow.workflow.dependencies)) {
        throw new Error(`Invalid 'workflow.dependencies' in ${filePath}: Expected array`);
      }
    }
  }

  /**
   * Initialize workflow execution
   * @param {string} workflowPath - Path to workflow YAML file
   * @param {object} context - Execution context (config, variables, etc.)
   * @returns {Promise<object>} Workflow execution state
   */
  async initializeWorkflow(workflowPath, context = {}) {
    try {
      // Load workflow
      this.currentWorkflow = await this.loadWorkflow(workflowPath);

      // Initialize state
      this.workflowState = {
        workflowName: this.currentWorkflow.workflow.name,
        workflowPath,
        status: 'initialized',
        currentStep: 0,
        totalSteps: this.currentWorkflow.workflow.steps.length,
        steps: this.currentWorkflow.workflow.steps.map((step, index) => ({
          stepIndex: index,
          stepName: step.name,
          status: 'pending',
          startedAt: null,
          completedAt: null,
          error: null,
        })),
        startedAt: new Date().toISOString(),
        completedAt: null,
        context,
      };

      // Persist state
      await this.saveState(workflowPath);

      return this.workflowState;
    } catch (error) {
      throw new Error(`Failed to initialize workflow: ${error.message}`);
    }
  }

  /**
   * Execute a workflow step
   * @param {number} stepIndex - Index of step to execute
   * @param {object} stepContext - Additional context for this step
   * @returns {Promise<object>} Step execution result
   */
  async executeStep(stepIndex, stepContext = {}) {
    if (!this.currentWorkflow) {
      throw new Error('No workflow loaded. Call initializeWorkflow() first.');
    }

    if (stepIndex < 0 || stepIndex >= this.currentWorkflow.workflow.steps.length) {
      throw new Error(`Invalid step index: ${stepIndex}`);
    }

    const step = this.currentWorkflow.workflow.steps[stepIndex];
    const stateStep = this.workflowState.steps[stepIndex];

    try {
      // Update state - step started
      stateStep.status = 'in_progress';
      stateStep.startedAt = new Date().toISOString();
      this.workflowState.currentStep = stepIndex;
      this.workflowState.status = 'running';
      await this.saveState();

      // Execute step based on action type
      const result = await this._executeStepAction(step, stepContext);

      // Update state - step completed
      stateStep.status = 'completed';
      stateStep.completedAt = new Date().toISOString();
      await this.saveState();

      return result;
    } catch (error) {
      // Update state - step failed
      stateStep.status = 'failed';
      stateStep.error = error.message;
      stateStep.completedAt = new Date().toISOString();
      this.workflowState.status = 'failed';
      await this.saveState();

      throw error;
    }
  }

  /**
   * Execute step action
   * @private
   */
  async _executeStepAction(step, stepContext) {
    const action = step.action;
    const result = {
      stepName: step.name,
      action,
      timestamp: new Date().toISOString(),
    };

    switch (action) {
      case 'elicit':
        result.type = 'elicitation';
        result.prompt = step.prompt || 'Please provide input';
        break;

      case 'reflect':
        result.type = 'reflection';
        result.prompt = step.prompt || 'Please reflect on the following';
        break;

      case 'guide':
        result.type = 'guidance';
        result.guidance = step.guidance || step.prompt;
        break;

      case 'template':
        result.type = 'template_rendering';
        result.template = step.template;
        result.output = step.output;
        break;

      case 'validate':
        result.type = 'validation';
        result.validationRules = step.rules || [];
        break;

      case 'sub-workflow':
        result.type = 'sub_workflow';
        result.subWorkflow = step.workflow;
        break;

      default:
        result.type = 'custom';
        result.customAction = action;
        break;
    }

    // Merge step context
    result.context = { ...stepContext };

    return result;
  }

  /**
   * Complete workflow execution
   * @returns {Promise<object>} Final workflow state
   */
  async completeWorkflow() {
    if (!this.workflowState) {
      throw new Error('No workflow state. Call initializeWorkflow() first.');
    }

    this.workflowState.status = 'completed';
    this.workflowState.completedAt = new Date().toISOString();
    await this.saveState();

    return this.workflowState;
  }

  /**
   * Save workflow state to disk
   * @param {string} workflowPath - Optional workflow path (used on first save)
   */
  async saveState(workflowPath = null) {
    if (!this.workflowState) {
      return;
    }

    // Determine state file path
    if (workflowPath && !this.stateFilePath) {
      const workflowDir = path.dirname(workflowPath);
      const workflowName = path.basename(workflowPath, path.extname(workflowPath));
      this.stateFilePath = path.join(workflowDir, `.${workflowName}.state.json`);
    }

    if (!this.stateFilePath) {
      throw new Error('State file path not determined');
    }

    // Write state to JSON file
    await fs.writeJson(this.stateFilePath, this.workflowState, { spaces: 2 });
  }

  /**
   * Load workflow state from disk
   * @param {string} workflowPath - Path to workflow YAML file
   * @returns {Promise<object|null>} Loaded state or null if not found
   */
  async loadState(workflowPath) {
    const workflowDir = path.dirname(workflowPath);
    const workflowName = path.basename(workflowPath, path.extname(workflowPath));
    const stateFilePath = path.join(workflowDir, `.${workflowName}.state.json`);

    if (await fs.pathExists(stateFilePath)) {
      this.stateFilePath = stateFilePath;
      this.workflowState = await fs.readJson(stateFilePath);
      return this.workflowState;
    }

    return null;
  }

  /**
   * Clear workflow state
   */
  async clearState() {
    if (this.stateFilePath && (await fs.pathExists(this.stateFilePath))) {
      await fs.remove(this.stateFilePath);
    }

    this.currentWorkflow = null;
    this.workflowState = null;
    this.stateFilePath = null;
  }

  /**
   * Get workflow progress
   * @returns {object} Progress information
   */
  getProgress() {
    if (!this.workflowState) {
      return null;
    }

    const completed = this.workflowState.steps.filter((s) => s.status === 'completed').length;
    const failed = this.workflowState.steps.filter((s) => s.status === 'failed').length;
    const pending = this.workflowState.steps.filter((s) => s.status === 'pending').length;
    const inProgress = this.workflowState.steps.filter((s) => s.status === 'in_progress').length;

    return {
      workflowName: this.workflowState.workflowName,
      status: this.workflowState.status,
      currentStep: this.workflowState.currentStep,
      totalSteps: this.workflowState.totalSteps,
      completed,
      failed,
      pending,
      inProgress,
      percentComplete: ((completed / this.workflowState.totalSteps) * 100).toFixed(1),
    };
  }
}

// Export singleton instance
export default new WorkflowEngine();
export { WorkflowEngine };
