/**
 * MADACE Installer
 * Story C1: Interactive installation with inquirer
 * Story C2: Module selection and installation
 * Story C3: Platform detection and IDE selection
 * Story C4: Installation validation and reporting
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import configManager from '../core/config-manager.js';
import manifestManager from '../core/manifest-manager.js';

/**
 * Available modules for installation
 */
const AVAILABLE_MODULES = [
  {
    id: 'core',
    name: 'MADACE Core',
    description: 'Core framework (always included)',
    required: true,
  },
  {
    id: 'mam',
    name: 'MADACE Method (MAM)',
    description: 'Agile AI-driven software development',
    required: false,
  },
  {
    id: 'mab',
    name: 'MADACE Builder (MAB)',
    description: 'Create custom agents, workflows, and modules',
    required: false,
  },
  {
    id: 'cis',
    name: 'Creative Intelligence Suite (CIS)',
    description: 'Innovation and creative thinking tools',
    required: false,
  },
];

/**
 * Supported IDEs
 */
const SUPPORTED_IDES = [
  { name: 'Claude Code', value: 'claude-code' },
  { name: 'Windsurf', value: 'windsurf' },
  { name: 'Cursor', value: 'cursor' },
  { name: 'Cline', value: 'cline' },
  { name: 'Qwen', value: 'qwen' },
  { name: 'Other/None', value: 'none' },
];

/**
 * Installer class
 */
class Installer {
  constructor() {
    this.config = {};
    this.selectedModules = [];
    this.destinationPath = null;
  }

  /**
   * Run interactive installation
   */
  async run(options = {}) {
    console.log(chalk.cyan.bold('\n🚀 MADACE-METHOD Installation\n'));

    try {
      // Step 1: Gather installation configuration
      await this._promptConfiguration(options);

      // Step 2: Validate destination
      await this._validateDestination();

      // Step 3: Confirm installation
      const confirmed = await this._confirmInstallation();
      if (!confirmed) {
        console.log(chalk.yellow('\n Installation cancelled.\n'));
        return false;
      }

      // Step 4: Perform installation
      await this._performInstallation();

      // Step 5: Validate installation
      await this._validateInstallation();

      // Step 6: Display summary
      this._displaySummary();

      return true;
    } catch (error) {
      console.error(chalk.red(`\n✗ Installation failed: ${error.message}\n`));
      throw error;
    }
  }

  /**
   * Prompt for installation configuration
   * @private
   */
  async _promptConfiguration(options) {
    const questions = [];

    // Destination path
    if (!options.dest) {
      questions.push({
        type: 'input',
        name: 'destination',
        message: 'Enter the full path to your project folder:',
        default: process.cwd(),
        validate: (input) => {
          if (!input || input.trim() === '') {
            return 'Destination path is required';
          }
          return true;
        },
      });
    }

    // User name
    questions.push({
      type: 'input',
      name: 'userName',
      message: 'What is your name? (How agents will address you)',
      default: os.userInfo().username || 'User',
      validate: (input) => {
        if (!input || input.trim() === '') {
          return 'Name is required';
        }
        return true;
      },
    });

    // Project name
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'What is your project name?',
      default: options.dest ? path.basename(options.dest) : path.basename(process.cwd()),
      validate: (input) => {
        if (!input || input.trim() === '') {
          return 'Project name is required';
        }
        return true;
      },
    });

    // Communication language
    questions.push({
      type: 'input',
      name: 'language',
      message: 'Communication language for all agents:',
      default: 'English',
    });

    // Module selection
    if (!options.modules) {
      const optionalModules = AVAILABLE_MODULES.filter((m) => !m.required);
      questions.push({
        type: 'checkbox',
        name: 'modules',
        message: 'Select additional modules to install:',
        choices: optionalModules.map((m) => ({
          name: `${m.name} - ${m.description}`,
          value: m.id,
          checked: true,
        })),
      });
    }

    // IDE selection
    questions.push({
      type: 'list',
      name: 'ide',
      message: 'Select your IDE for platform-specific optimizations:',
      choices: SUPPORTED_IDES,
      default: 'claude-code',
    });

    // Get answers
    const answers = await inquirer.prompt(questions);

    // Store configuration
    this.destinationPath = options.dest || answers.destination;
    this.config = {
      project_name: answers.projectName,
      user_name: answers.userName,
      communication_language: answers.language,
      output_folder: 'docs',
      madace_version: '1.0.0-alpha.1',
      ide: answers.ide,
    };

    // Store selected modules
    this.selectedModules = ['core'];
    if (options.modules) {
      this.selectedModules.push(...options.modules);
    } else if (answers.modules) {
      this.selectedModules.push(...answers.modules);
    }
  }

  /**
   * Validate destination path
   * @private
   */
  async _validateDestination() {
    const spinner = ora('Validating destination...').start();

    try {
      // Check if path exists
      const exists = await fs.pathExists(this.destinationPath);
      if (!exists) {
        spinner.fail('Destination path does not exist');
        throw new Error(`Path does not exist: ${this.destinationPath}`);
      }

      // Check if madace folder already exists
      const madacePath = path.join(this.destinationPath, 'madace');
      const madaceExists = await fs.pathExists(madacePath);
      if (madaceExists) {
        spinner.warn('MADACE installation already exists');
        const { overwrite } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: 'MADACE is already installed. Overwrite?',
            default: false,
          },
        ]);

        if (!overwrite) {
          spinner.fail('Installation cancelled');
          throw new Error('Installation cancelled by user');
        }
      }

      spinner.succeed('Destination validated');
    } catch (error) {
      spinner.fail('Validation failed');
      throw error;
    }
  }

  /**
   * Confirm installation
   * @private
   */
  async _confirmInstallation() {
    console.log(chalk.cyan('\n📋 Installation Summary:\n'));
    console.log(`${chalk.bold('Destination:')} ${this.destinationPath}`);
    console.log(`${chalk.bold('Project:')} ${this.config.project_name}`);
    console.log(`${chalk.bold('User:')} ${this.config.user_name}`);
    console.log(`${chalk.bold('Language:')} ${this.config.communication_language}`);
    console.log(`${chalk.bold('IDE:')} ${this.config.ide}`);
    console.log(`${chalk.bold('Modules:')} ${this.selectedModules.join(', ')}`);
    console.log('');

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Proceed with installation?',
        default: true,
      },
    ]);

    return confirm;
  }

  /**
   * Perform installation
   * @private
   */
  async _performInstallation() {
    const madacePath = path.join(this.destinationPath, 'madace');

    // Create directory structure
    await this._createDirectoryStructure(madacePath);

    // Install configuration
    await this._installConfiguration(madacePath);

    // Initialize manifests
    await this._initializeManifests(madacePath);

    // Install modules (placeholder for now)
    await this._installModules(madacePath);

    // Create output folder
    await this._createOutputFolder();
  }

  /**
   * Create directory structure
   * @private
   */
  async _createDirectoryStructure(madacePath) {
    const spinner = ora('Creating directory structure...').start();

    try {
      const dirs = [
        madacePath,
        path.join(madacePath, 'core'),
        path.join(madacePath, '_cfg'),
        path.join(madacePath, 'agents'),
        path.join(madacePath, 'workflows'),
      ];

      for (const dir of dirs) {
        await fs.ensureDir(dir);
      }

      spinner.succeed('Directory structure created');
    } catch (error) {
      spinner.fail('Failed to create directory structure');
      throw error;
    }
  }

  /**
   * Install configuration
   * @private
   */
  async _installConfiguration(madacePath) {
    const spinner = ora('Installing configuration...').start();

    try {
      const configPath = path.join(madacePath, 'core', 'config.yaml');
      await configManager.createDefaultConfig(configPath, this.config);

      spinner.succeed('Configuration installed');
    } catch (error) {
      spinner.fail('Failed to install configuration');
      throw error;
    }
  }

  /**
   * Initialize manifests
   * @private
   */
  async _initializeManifests(madacePath) {
    const spinner = ora('Initializing manifests...').start();

    try {
      manifestManager.initialize(madacePath);
      await manifestManager.createAgentManifest();
      await manifestManager.createWorkflowManifest();

      spinner.succeed('Manifests initialized');
    } catch (error) {
      spinner.fail('Failed to initialize manifests');
      throw error;
    }
  }

  /**
   * Install modules
   * @private
   */
  async _installModules(madacePath) {
    const spinner = ora('Installing modules...').start();

    try {
      // For now, just create module directories
      // Actual module installation will be implemented in Epic 4
      for (const moduleId of this.selectedModules) {
        if (moduleId === 'core') {
          continue;
        }

        const moduleDir = path.join(madacePath, 'modules', moduleId);
        await fs.ensureDir(moduleDir);
      }

      spinner.succeed(`Modules installed: ${this.selectedModules.join(', ')}`);
    } catch (error) {
      spinner.fail('Failed to install modules');
      throw error;
    }
  }

  /**
   * Create output folder
   * @private
   */
  async _createOutputFolder() {
    const spinner = ora('Creating output folder...').start();

    try {
      const outputPath = path.join(this.destinationPath, this.config.output_folder);
      await fs.ensureDir(outputPath);

      spinner.succeed(`Output folder created: ${this.config.output_folder}`);
    } catch (error) {
      spinner.fail('Failed to create output folder');
      throw error;
    }
  }

  /**
   * Validate installation
   * @private
   */
  async _validateInstallation() {
    const spinner = ora('Validating installation...').start();

    try {
      const madacePath = path.join(this.destinationPath, 'madace');

      // Validate using config manager
      const result = await configManager.validateInstallation(madacePath);

      if (!result.valid) {
        spinner.fail('Installation validation failed');
        result.issues.forEach((issue) => console.log(chalk.red(`  - ${issue}`)));
        throw new Error('Installation validation failed');
      }

      if (result.warnings.length > 0) {
        spinner.warn('Installation complete with warnings');
        result.warnings.forEach((warning) => console.log(chalk.yellow(`  - ${warning}`)));
      } else {
        spinner.succeed('Installation validated');
      }
    } catch (error) {
      spinner.fail('Validation failed');
      throw error;
    }
  }

  /**
   * Display installation summary
   * @private
   */
  _displaySummary() {
    console.log(chalk.green.bold('\n✓ Installation Complete!\n'));
    console.log(chalk.bold('Next Steps:\n'));
    console.log(`  1. ${chalk.cyan(`cd ${this.destinationPath}`)}`);
    console.log(`  2. ${chalk.cyan('madace status')} - Check installation status`);
    console.log(`  3. ${chalk.cyan('madace dev info')} - View framework information`);
    console.log(`  4. ${chalk.cyan('madace agent <name>')} - Load an agent (when available)`);
    console.log('');
    console.log(chalk.bold('Documentation:'));
    console.log(`  • README.md - Getting started`);
    console.log(`  • CLAUDE.md - AI assistant guide`);
    console.log('');
  }

  /**
   * Detect platform
   * @static
   */
  static detectPlatform() {
    const platform = os.platform();
    const arch = os.arch();

    return {
      platform,
      arch,
      isWindows: platform === 'win32',
      isMac: platform === 'darwin',
      isLinux: platform === 'linux',
    };
  }

  /**
   * Get system information
   * @static
   */
  static getSystemInfo() {
    return {
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      nodeVersion: process.version,
      homeDir: os.homedir(),
      tmpDir: os.tmpdir(),
    };
  }
}

export default Installer;
