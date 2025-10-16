/**
 * Configuration Manager - Loading and Validation
 * Story F6: Configuration loading and validation system
 */

import fs from 'fs-extra';
import yaml from 'js-yaml';
import path from 'path';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  project_name: 'MADACE Project',
  output_folder: 'docs',
  user_name: 'User',
  communication_language: 'English',
  madace_version: '1.0.0-alpha.1',
};

/**
 * Required configuration fields
 */
const REQUIRED_FIELDS = ['project_name', 'user_name'];

/**
 * ConfigManager class
 * Handles loading, validating, and managing MADACE configuration
 */
class ConfigManager {
  constructor() {
    this.config = null;
    this.configPath = null;
    this.madaceRoot = null;
    this.projectRoot = null;
  }

  /**
   * Load configuration from YAML file
   * @param {string} configPath - Absolute path to config.yaml
   * @returns {Promise<object>} Loaded configuration
   */
  async loadConfig(configPath) {
    try {
      // Validate file exists
      if (!(await fs.pathExists(configPath))) {
        throw new Error(`Configuration file not found: ${configPath}`);
      }

      // Read and parse YAML
      const fileContent = await fs.readFile(configPath, 'utf8');
      const config = yaml.load(fileContent);

      // Validate configuration
      this.validateConfig(config, configPath);

      // Merge with defaults
      this.config = { ...DEFAULT_CONFIG, ...config };

      // Store paths
      this.configPath = configPath;
      this.madaceRoot = path.dirname(path.dirname(configPath)); // madace/core/config.yaml -> madace/
      this.projectRoot = path.dirname(this.madaceRoot); // madace/ -> project root

      // Add computed fields
      this.config._paths = {
        madace_root: this.madaceRoot,
        project_root: this.projectRoot,
        config_file: configPath,
        output_folder: path.join(this.projectRoot, this.config.output_folder),
      };

      return this.config;
    } catch (error) {
      if (error.name === 'YAMLException') {
        throw new Error(`YAML parsing error in ${configPath}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Validate configuration structure
   * @param {object} config - Configuration object
   * @param {string} filePath - File path for error reporting
   * @throws {Error} If validation fails
   */
  validateConfig(config, filePath) {
    if (!config || typeof config !== 'object') {
      throw new Error(`Invalid configuration structure in ${filePath}: Expected object`);
    }

    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      if (!config[field]) {
        throw new Error(`Missing required field '${field}' in ${filePath}`);
      }
    }

    // Validate field types
    if (config.project_name && typeof config.project_name !== 'string') {
      throw new Error(`Invalid type for 'project_name' in ${filePath}: Expected string`);
    }

    if (config.user_name && typeof config.user_name !== 'string') {
      throw new Error(`Invalid type for 'user_name' in ${filePath}: Expected string`);
    }

    if (config.output_folder && typeof config.output_folder !== 'string') {
      throw new Error(`Invalid type for 'output_folder' in ${filePath}: Expected string`);
    }

    if (config.communication_language && typeof config.communication_language !== 'string') {
      throw new Error(`Invalid type for 'communication_language' in ${filePath}: Expected string`);
    }
  }

  /**
   * Get configuration value
   * @param {string} key - Configuration key (supports dot notation)
   * @param {*} defaultValue - Default value if key not found
   * @returns {*} Configuration value
   */
  get(key, defaultValue = undefined) {
    if (!this.config) {
      throw new Error('Configuration not loaded. Call loadConfig() first.');
    }

    // Support dot notation (e.g., 'metadata.version')
    const keys = key.split('.');
    let value = this.config;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }

    return value;
  }

  /**
   * Set configuration value
   * @param {string} key - Configuration key (supports dot notation)
   * @param {*} value - Value to set
   */
  set(key, value) {
    if (!this.config) {
      throw new Error('Configuration not loaded. Call loadConfig() first.');
    }

    // Support dot notation
    const keys = key.split('.');
    const lastKey = keys.pop();
    let target = this.config;

    for (const k of keys) {
      if (!(k in target)) {
        target[k] = {};
      }
      target = target[k];
    }

    target[lastKey] = value;
  }

  /**
   * Save configuration to file
   * @param {string} configPath - Optional path (uses loaded path if not provided)
   */
  async saveConfig(configPath = null) {
    if (!this.config) {
      throw new Error('No configuration to save. Call loadConfig() first.');
    }

    const savePath = configPath || this.configPath;
    if (!savePath) {
      throw new Error('No configuration path specified');
    }

    try {
      // Remove computed fields before saving
      // eslint-disable-next-line no-unused-vars
      const { _paths, ...configToSave } = this.config;

      // Convert to YAML
      const yamlContent = yaml.dump(configToSave, {
        indent: 2,
        lineWidth: 120,
        noRefs: true,
      });

      // Ensure directory exists
      await fs.ensureDir(path.dirname(savePath));

      // Write to file
      await fs.writeFile(savePath, yamlContent, 'utf8');

      return savePath;
    } catch (error) {
      throw new Error(`Failed to save configuration: ${error.message}`);
    }
  }

  /**
   * Find MADACE installation in project
   * @param {string} startDir - Directory to start search from (defaults to cwd)
   * @returns {Promise<string|null>} Path to madace root or null if not found
   */
  async findMadaceRoot(startDir = process.cwd()) {
    let currentDir = path.resolve(startDir);
    const rootDir = path.parse(currentDir).root;

    // Search up to root directory
    while (currentDir !== rootDir) {
      const madacePath = path.join(currentDir, 'madace');
      const configPath = path.join(madacePath, 'core', 'config.yaml');

      if (await fs.pathExists(configPath)) {
        return madacePath;
      }

      // Move up one directory
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
        break; // Reached root
      }
      currentDir = parentDir;
    }

    return null;
  }

  /**
   * Auto-load configuration from current project
   * @param {string} startDir - Directory to start search from
   * @returns {Promise<object>} Loaded configuration
   */
  async autoLoadConfig(startDir = process.cwd()) {
    const madaceRoot = await this.findMadaceRoot(startDir);

    if (!madaceRoot) {
      throw new Error('MADACE installation not found. Run "madace install" or navigate to a MADACE-enabled project.');
    }

    const configPath = path.join(madaceRoot, 'core', 'config.yaml');
    return await this.loadConfig(configPath);
  }

  /**
   * Create default configuration file
   * @param {string} configPath - Path where config should be created
   * @param {object} overrides - Values to override defaults
   * @returns {Promise<string>} Path to created config
   */
  async createDefaultConfig(configPath, overrides = {}) {
    const config = { ...DEFAULT_CONFIG, ...overrides };

    try {
      // Ensure directory exists
      await fs.ensureDir(path.dirname(configPath));

      // Convert to YAML
      const yamlContent = yaml.dump(config, {
        indent: 2,
        lineWidth: 120,
        noRefs: true,
      });

      // Write to file
      await fs.writeFile(configPath, yamlContent, 'utf8');

      return configPath;
    } catch (error) {
      throw new Error(`Failed to create default configuration: ${error.message}`);
    }
  }

  /**
   * Validate installed MADACE structure
   * @param {string} madaceRoot - Path to madace root directory
   * @returns {Promise<object>} Validation result
   */
  async validateInstallation(madaceRoot) {
    const issues = [];
    const warnings = [];

    try {
      // Check core directory
      const coreDir = path.join(madaceRoot, 'core');
      if (!(await fs.pathExists(coreDir))) {
        issues.push('Missing core directory');
      }

      // Check config file
      const configPath = path.join(coreDir, 'config.yaml');
      if (!(await fs.pathExists(configPath))) {
        issues.push('Missing config.yaml');
      } else {
        try {
          await this.loadConfig(configPath);
        } catch (error) {
          issues.push(`Invalid config.yaml: ${error.message}`);
        }
      }

      // Check _cfg directory
      const cfgDir = path.join(madaceRoot, '_cfg');
      if (!(await fs.pathExists(cfgDir))) {
        warnings.push('Missing _cfg directory');
      }

      // Check manifests
      const agentManifest = path.join(cfgDir, 'agent-manifest.csv');
      const workflowManifest = path.join(cfgDir, 'workflow-manifest.csv');

      if (!(await fs.pathExists(agentManifest))) {
        warnings.push('Missing agent-manifest.csv');
      }

      if (!(await fs.pathExists(workflowManifest))) {
        warnings.push('Missing workflow-manifest.csv');
      }

      return {
        valid: issues.length === 0,
        madaceRoot,
        issues,
        warnings,
      };
    } catch (error) {
      return {
        valid: false,
        madaceRoot,
        issues: [`Validation error: ${error.message}`],
        warnings,
      };
    }
  }

  /**
   * Get current configuration
   * @returns {object} Current configuration
   */
  getConfig() {
    if (!this.config) {
      throw new Error('Configuration not loaded. Call loadConfig() first.');
    }
    return { ...this.config };
  }

  /**
   * Clear loaded configuration
   */
  clearConfig() {
    this.config = null;
    this.configPath = null;
    this.madaceRoot = null;
    this.projectRoot = null;
  }
}

// Export singleton instance
export default new ConfigManager();
export { ConfigManager };
