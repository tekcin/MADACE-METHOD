/**
 * Manifest Manager - CSV Manifest Operations
 * Story F7: Manifest management (create, read, update)
 */

import fs from 'fs-extra';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

/**
 * Agent manifest schema
 */
const AGENT_MANIFEST_COLUMNS = ['agent_id', 'name', 'module', 'type', 'file_path', 'installed_at'];

/**
 * Workflow manifest schema
 */
const WORKFLOW_MANIFEST_COLUMNS = ['workflow_id', 'name', 'module', 'workflow_path', 'installed_at'];

/**
 * ManifestManager class
 * Handles reading and writing CSV manifests for agents and workflows
 */
class ManifestManager {
  constructor() {
    this.agentManifestPath = null;
    this.workflowManifestPath = null;
  }

  /**
   * Initialize manifest paths
   * @param {string} madaceRoot - Path to madace root directory
   */
  initialize(madaceRoot) {
    const cfgDir = path.join(madaceRoot, '_cfg');
    this.agentManifestPath = path.join(cfgDir, 'agent-manifest.csv');
    this.workflowManifestPath = path.join(cfgDir, 'workflow-manifest.csv');
  }

  /**
   * Read agent manifest
   * @param {string} manifestPath - Optional custom path
   * @returns {Promise<object[]>} Array of agent manifest entries
   */
  async readAgentManifest(manifestPath = null) {
    const filePath = manifestPath || this.agentManifestPath;

    if (!filePath) {
      throw new Error('Manifest path not initialized. Call initialize() first.');
    }

    try {
      // Create manifest if it doesn't exist
      if (!(await fs.pathExists(filePath))) {
        await this.createAgentManifest(filePath);
        return [];
      }

      // Read and parse CSV
      const content = await fs.readFile(filePath, 'utf8');
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      return records;
    } catch (error) {
      throw new Error(`Failed to read agent manifest: ${error.message}`);
    }
  }

  /**
   * Read workflow manifest
   * @param {string} manifestPath - Optional custom path
   * @returns {Promise<object[]>} Array of workflow manifest entries
   */
  async readWorkflowManifest(manifestPath = null) {
    const filePath = manifestPath || this.workflowManifestPath;

    if (!filePath) {
      throw new Error('Manifest path not initialized. Call initialize() first.');
    }

    try {
      // Create manifest if it doesn't exist
      if (!(await fs.pathExists(filePath))) {
        await this.createWorkflowManifest(filePath);
        return [];
      }

      // Read and parse CSV
      const content = await fs.readFile(filePath, 'utf8');
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      return records;
    } catch (error) {
      throw new Error(`Failed to read workflow manifest: ${error.message}`);
    }
  }

  /**
   * Write agent manifest
   * @param {object[]} entries - Agent manifest entries
   * @param {string} manifestPath - Optional custom path
   */
  async writeAgentManifest(entries, manifestPath = null) {
    const filePath = manifestPath || this.agentManifestPath;

    if (!filePath) {
      throw new Error('Manifest path not initialized. Call initialize() first.');
    }

    try {
      // Ensure directory exists
      await fs.ensureDir(path.dirname(filePath));

      // Convert to CSV
      const csv = stringify(entries, {
        header: true,
        columns: AGENT_MANIFEST_COLUMNS,
      });

      // Write to file
      await fs.writeFile(filePath, csv, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write agent manifest: ${error.message}`);
    }
  }

  /**
   * Write workflow manifest
   * @param {object[]} entries - Workflow manifest entries
   * @param {string} manifestPath - Optional custom path
   */
  async writeWorkflowManifest(entries, manifestPath = null) {
    const filePath = manifestPath || this.workflowManifestPath;

    if (!filePath) {
      throw new Error('Manifest path not initialized. Call initialize() first.');
    }

    try {
      // Ensure directory exists
      await fs.ensureDir(path.dirname(filePath));

      // Convert to CSV
      const csv = stringify(entries, {
        header: true,
        columns: WORKFLOW_MANIFEST_COLUMNS,
      });

      // Write to file
      await fs.writeFile(filePath, csv, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write workflow manifest: ${error.message}`);
    }
  }

  /**
   * Add agent to manifest
   * @param {object} agent - Agent metadata
   * @returns {Promise<void>}
   */
  async addAgent(agent) {
    try {
      const manifest = await this.readAgentManifest();

      // Check if agent already exists
      const existingIndex = manifest.findIndex((entry) => entry.agent_id === agent.agent_id);

      if (existingIndex >= 0) {
        // Update existing entry
        manifest[existingIndex] = {
          ...manifest[existingIndex],
          ...agent,
          installed_at: new Date().toISOString(),
        };
      } else {
        // Add new entry
        manifest.push({
          ...agent,
          installed_at: new Date().toISOString(),
        });
      }

      await this.writeAgentManifest(manifest);
    } catch (error) {
      throw new Error(`Failed to add agent to manifest: ${error.message}`);
    }
  }

  /**
   * Add workflow to manifest
   * @param {object} workflow - Workflow metadata
   * @returns {Promise<void>}
   */
  async addWorkflow(workflow) {
    try {
      const manifest = await this.readWorkflowManifest();

      // Check if workflow already exists
      const existingIndex = manifest.findIndex((entry) => entry.workflow_id === workflow.workflow_id);

      if (existingIndex >= 0) {
        // Update existing entry
        manifest[existingIndex] = {
          ...manifest[existingIndex],
          ...workflow,
          installed_at: new Date().toISOString(),
        };
      } else {
        // Add new entry
        manifest.push({
          ...workflow,
          installed_at: new Date().toISOString(),
        });
      }

      await this.writeWorkflowManifest(manifest);
    } catch (error) {
      throw new Error(`Failed to add workflow to manifest: ${error.message}`);
    }
  }

  /**
   * Remove agent from manifest
   * @param {string} agentId - Agent ID to remove
   * @returns {Promise<boolean>} True if removed, false if not found
   */
  async removeAgent(agentId) {
    try {
      const manifest = await this.readAgentManifest();
      const initialLength = manifest.length;

      const filtered = manifest.filter((entry) => entry.agent_id !== agentId);

      if (filtered.length < initialLength) {
        await this.writeAgentManifest(filtered);
        return true;
      }

      return false;
    } catch (error) {
      throw new Error(`Failed to remove agent from manifest: ${error.message}`);
    }
  }

  /**
   * Remove workflow from manifest
   * @param {string} workflowId - Workflow ID to remove
   * @returns {Promise<boolean>} True if removed, false if not found
   */
  async removeWorkflow(workflowId) {
    try {
      const manifest = await this.readWorkflowManifest();
      const initialLength = manifest.length;

      const filtered = manifest.filter((entry) => entry.workflow_id !== workflowId);

      if (filtered.length < initialLength) {
        await this.writeWorkflowManifest(filtered);
        return true;
      }

      return false;
    } catch (error) {
      throw new Error(`Failed to remove workflow from manifest: ${error.message}`);
    }
  }

  /**
   * Get agent by ID
   * @param {string} agentId - Agent ID
   * @returns {Promise<object|null>} Agent entry or null if not found
   */
  async getAgent(agentId) {
    try {
      const manifest = await this.readAgentManifest();
      return manifest.find((entry) => entry.agent_id === agentId) || null;
    } catch (error) {
      throw new Error(`Failed to get agent: ${error.message}`);
    }
  }

  /**
   * Get workflow by ID
   * @param {string} workflowId - Workflow ID
   * @returns {Promise<object|null>} Workflow entry or null if not found
   */
  async getWorkflow(workflowId) {
    try {
      const manifest = await this.readWorkflowManifest();
      return manifest.find((entry) => entry.workflow_id === workflowId) || null;
    } catch (error) {
      throw new Error(`Failed to get workflow: ${error.message}`);
    }
  }

  /**
   * Get agents by module
   * @param {string} moduleName - Module name (e.g., 'core', 'mam', 'mab')
   * @returns {Promise<object[]>} Array of agent entries
   */
  async getAgentsByModule(moduleName) {
    try {
      const manifest = await this.readAgentManifest();
      return manifest.filter((entry) => entry.module === moduleName);
    } catch (error) {
      throw new Error(`Failed to get agents by module: ${error.message}`);
    }
  }

  /**
   * Get workflows by module
   * @param {string} moduleName - Module name
   * @returns {Promise<object[]>} Array of workflow entries
   */
  async getWorkflowsByModule(moduleName) {
    try {
      const manifest = await this.readWorkflowManifest();
      return manifest.filter((entry) => entry.module === moduleName);
    } catch (error) {
      throw new Error(`Failed to get workflows by module: ${error.message}`);
    }
  }

  /**
   * Create empty agent manifest
   * @param {string} manifestPath - Path to create manifest
   */
  async createAgentManifest(manifestPath = null) {
    const filePath = manifestPath || this.agentManifestPath;

    if (!filePath) {
      throw new Error('Manifest path not initialized. Call initialize() first.');
    }

    await this.writeAgentManifest([], filePath);
  }

  /**
   * Create empty workflow manifest
   * @param {string} manifestPath - Path to create manifest
   */
  async createWorkflowManifest(manifestPath = null) {
    const filePath = manifestPath || this.workflowManifestPath;

    if (!filePath) {
      throw new Error('Manifest path not initialized. Call initialize() first.');
    }

    await this.writeWorkflowManifest([], filePath);
  }

  /**
   * Get manifest statistics
   * @returns {Promise<object>} Manifest statistics
   */
  async getStats() {
    try {
      const agents = await this.readAgentManifest();
      const workflows = await this.readWorkflowManifest();

      // Count by module
      const agentsByModule = {};
      const workflowsByModule = {};

      agents.forEach((agent) => {
        agentsByModule[agent.module] = (agentsByModule[agent.module] || 0) + 1;
      });

      workflows.forEach((workflow) => {
        workflowsByModule[workflow.module] = (workflowsByModule[workflow.module] || 0) + 1;
      });

      // Count by agent type
      const agentsByType = {};
      agents.forEach((agent) => {
        agentsByType[agent.type] = (agentsByType[agent.type] || 0) + 1;
      });

      return {
        totalAgents: agents.length,
        totalWorkflows: workflows.length,
        agentsByModule,
        workflowsByModule,
        agentsByType,
        modules: [...new Set([...Object.keys(agentsByModule), ...Object.keys(workflowsByModule)])],
      };
    } catch (error) {
      throw new Error(`Failed to get manifest stats: ${error.message}`);
    }
  }

  /**
   * Validate manifest integrity
   * @returns {Promise<object>} Validation result
   */
  async validateManifests() {
    const issues = [];
    const warnings = [];

    try {
      // Check agent manifest
      const agents = await this.readAgentManifest();
      for (const agent of agents) {
        // Check required fields
        if (!agent.agent_id) {
          warnings.push(`Agent missing ID: ${JSON.stringify(agent)}`);
        }
        if (!agent.name) {
          warnings.push(`Agent missing name: ${agent.agent_id}`);
        }
        if (!agent.file_path) {
          warnings.push(`Agent missing file_path: ${agent.agent_id}`);
        }

        // Check file exists
        if (agent.file_path && !(await fs.pathExists(agent.file_path))) {
          issues.push(`Agent file not found: ${agent.file_path} (${agent.agent_id})`);
        }
      }

      // Check workflow manifest
      const workflows = await this.readWorkflowManifest();
      for (const workflow of workflows) {
        // Check required fields
        if (!workflow.workflow_id) {
          warnings.push(`Workflow missing ID: ${JSON.stringify(workflow)}`);
        }
        if (!workflow.name) {
          warnings.push(`Workflow missing name: ${workflow.workflow_id}`);
        }
        if (!workflow.workflow_path) {
          warnings.push(`Workflow missing path: ${workflow.workflow_id}`);
        }

        // Check directory exists
        if (workflow.workflow_path && !(await fs.pathExists(workflow.workflow_path))) {
          issues.push(`Workflow path not found: ${workflow.workflow_path} (${workflow.workflow_id})`);
        }
      }

      return {
        valid: issues.length === 0,
        issues,
        warnings,
      };
    } catch (error) {
      return {
        valid: false,
        issues: [`Validation error: ${error.message}`],
        warnings,
      };
    }
  }
}

// Export singleton instance
export default new ManifestManager();
export { ManifestManager };
