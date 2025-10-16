/**
 * Agent Loader - YAML Parser and Validator
 * Story F1: Agent YAML parser and validator
 * Story F2: Agent runtime loading system
 */

import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';

/**
 * Agent schema validation
 */
const REQUIRED_FIELDS = {
  agent: {
    metadata: ['id', 'name', 'title'],
    persona: ['role', 'identity'],
  },
};

/**
 * AgentLoader class
 * Handles loading, parsing, and validating agent YAML files
 */
class AgentLoader {
  /**
   * Load and parse an agent YAML file
   * @param {string} agentPath - Absolute path to agent YAML file
   * @returns {Promise<object>} Parsed and validated agent object
   */
  async loadAgent(agentPath) {
    try {
      // Validate file exists
      if (!(await fs.pathExists(agentPath))) {
        throw new Error(`Agent file not found: ${agentPath}`);
      }

      // Validate file extension
      const ext = path.extname(agentPath).toLowerCase();
      if (!['.yaml', '.yml'].includes(ext)) {
        throw new Error(`Invalid agent file extension: ${ext}. Expected .yaml or .yml`);
      }

      // Read and parse YAML
      const fileContent = await fs.readFile(agentPath, 'utf8');
      const agent = yaml.load(fileContent);

      // Validate agent structure
      this.validateAgent(agent, agentPath);

      // Add runtime metadata
      agent._runtime = {
        loadedAt: new Date().toISOString(),
        filePath: agentPath,
        fileName: path.basename(agentPath),
      };

      return agent;
    } catch (error) {
      if (error.name === 'YAMLException') {
        throw new Error(`YAML parsing error in ${agentPath}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Validate agent structure against schema
   * @param {object} agent - Parsed agent object
   * @param {string} filePath - File path for error reporting
   * @throws {Error} If validation fails
   */
  validateAgent(agent, filePath) {
    if (!agent || typeof agent !== 'object') {
      throw new Error(`Invalid agent structure in ${filePath}: Expected object`);
    }

    if (!agent.agent) {
      throw new Error(`Missing 'agent' root key in ${filePath}`);
    }

    // Validate metadata section
    if (!agent.agent.metadata) {
      throw new Error(`Missing 'agent.metadata' section in ${filePath}`);
    }

    for (const field of REQUIRED_FIELDS.agent.metadata) {
      if (!agent.agent.metadata[field]) {
        throw new Error(`Missing required field 'agent.metadata.${field}' in ${filePath}`);
      }
    }

    // Validate persona section
    if (!agent.agent.persona) {
      throw new Error(`Missing 'agent.persona' section in ${filePath}`);
    }

    for (const field of REQUIRED_FIELDS.agent.persona) {
      if (!agent.agent.persona[field]) {
        throw new Error(`Missing required field 'agent.persona.${field}' in ${filePath}`);
      }
    }

    // Validate optional sections (allow them to be missing or empty)
    if (agent.agent.critical_actions && !Array.isArray(agent.agent.critical_actions)) {
      throw new Error(`Invalid 'agent.critical_actions' in ${filePath}: Expected array`);
    }

    if (agent.agent.menu && !Array.isArray(agent.agent.menu)) {
      throw new Error(`Invalid 'agent.menu' in ${filePath}: Expected array`);
    }

    if (agent.agent.prompts && !Array.isArray(agent.agent.prompts)) {
      throw new Error(`Invalid 'agent.prompts' in ${filePath}: Expected array`);
    }

    // Validate menu items structure
    if (agent.agent.menu) {
      agent.agent.menu.forEach((item, index) => {
        if (!item.trigger) {
          throw new Error(`Missing 'trigger' in menu item ${index} in ${filePath}`);
        }
        if (!item.action) {
          throw new Error(`Missing 'action' in menu item ${index} in ${filePath}`);
        }
        if (!item.description) {
          throw new Error(`Missing 'description' in menu item ${index} in ${filePath}`);
        }
      });
    }
  }

  /**
   * Load multiple agents from a directory
   * @param {string} dirPath - Directory containing agent YAML files
   * @param {object} options - Loading options
   * @param {boolean} options.recursive - Recursively search subdirectories
   * @param {string} options.pattern - File pattern (default: '*.agent.yaml')
   * @returns {Promise<object[]>} Array of loaded agents
   */
  async loadAgentsFromDirectory(dirPath, options = {}) {
    const { recursive = false, pattern = '*.agent.yaml' } = options;

    try {
      if (!(await fs.pathExists(dirPath))) {
        throw new Error(`Directory not found: ${dirPath}`);
      }

      const agents = [];
      const files = await this._findAgentFiles(dirPath, pattern, recursive);

      for (const file of files) {
        try {
          const agent = await this.loadAgent(file);
          agents.push(agent);
        } catch (error) {
          // Log error but continue loading other agents
          console.error(`Failed to load agent ${file}: ${error.message}`);
        }
      }

      return agents;
    } catch (error) {
      throw new Error(`Failed to load agents from directory: ${error.message}`);
    }
  }

  /**
   * Find agent files matching pattern
   * @private
   */
  async _findAgentFiles(dirPath, pattern, recursive) {
    const files = [];
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory() && recursive) {
        const subFiles = await this._findAgentFiles(fullPath, pattern, recursive);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        // Simple pattern matching (*.agent.yaml or *.agent.yml)
        if (pattern === '*.agent.yaml' || pattern === '*.agent.yml') {
          const ext = pattern.split('.').pop();
          if (entry.name.endsWith(`.agent.${ext}`)) {
            files.push(fullPath);
          }
        }
      }
    }

    return files;
  }

  /**
   * Get agent by ID
   * @param {string} agentId - Agent ID (e.g., 'madace/core/agents/master.md')
   * @param {string} basePath - Base path to search from
   * @returns {Promise<object>} Loaded agent
   */
  async getAgentById(agentId, basePath) {
    // Convert ID to file path
    // e.g., 'madace/core/agents/master.md' -> 'madace/core/agents/master.agent.yaml'
    const agentPath = agentId.replace(/\.md$/, '.agent.yaml');
    const fullPath = path.join(basePath, agentPath);

    return await this.loadAgent(fullPath);
  }
}

// Export singleton instance
export default new AgentLoader();
export { AgentLoader };
