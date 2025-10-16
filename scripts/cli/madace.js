#!/usr/bin/env node

/**
 * MADACE CLI - Main Entry Point
 * Provides command-line interface for MADACE-METHOD framework
 */

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version
const packagePath = join(__dirname, '../../package.json');
const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf8'));

const program = new Command();

program
  .name('madace')
  .description('MADACE-METHOD - Universal human-AI collaboration framework')
  .version(packageJson.version);

// Install command
program
  .command('install')
  .description('Install MADACE to your project (interactive)')
  .option('-d, --dest <path>', 'Destination project directory')
  .option('-m, --modules <modules...>', 'Modules to install (core, mam, mab, cis)')
  .action(async (options) => {
    try {
      const { default: Installer } = await import('./installer.js');
      const installer = new Installer();
      await installer.run(options);
    } catch (error) {
      console.error(chalk.red(`Installation error: ${error.message}`));
      process.exit(1);
    }
  });

// Status command
program
  .command('status')
  .description('Show MADACE installation status')
  .action(async () => {
    try {
      const { default: configManager } = await import('../core/config-manager.js');
      const { default: manifestManager } = await import('../core/manifest-manager.js');

      // Try to find MADACE installation
      const madaceRoot = await configManager.findMadaceRoot();

      if (!madaceRoot) {
        console.log(chalk.red('✗ MADACE installation not found'));
        console.log(chalk.yellow('Run "madace install" to install MADACE to your project'));
        process.exit(1);
      }

      // Load configuration
      const configPath = join(madaceRoot, 'core', 'config.yaml');
      const config = await configManager.loadConfig(configPath);

      // Get manifest stats
      manifestManager.initialize(madaceRoot);
      const stats = await manifestManager.getStats();

      // Display status
      console.log(chalk.green.bold('\n✓ MADACE Installation Found\n'));
      console.log(`${chalk.bold('Project:')} ${config.project_name}`);
      console.log(`${chalk.bold('User:')} ${config.user_name}`);
      console.log(`${chalk.bold('Language:')} ${config.communication_language}`);
      console.log(`${chalk.bold('Location:')} ${madaceRoot}`);
      console.log(`${chalk.bold('Version:')} ${config.madace_version}`);
      console.log('');
      console.log(`${chalk.bold('Installed Modules:')} ${stats.modules.join(', ')}`);
      console.log(`${chalk.bold('Agents:')} ${stats.totalAgents}`);
      console.log(`${chalk.bold('Workflows:')} ${stats.totalWorkflows}`);
      console.log('');
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// List command
program
  .command('list')
  .description('List available modules, agents, or workflows')
  .argument('[type]', 'Type to list: modules, agents, workflows', 'modules')
  .action(async (type) => {
    try {
      const { default: configManager } = await import('../core/config-manager.js');
      const { default: manifestManager } = await import('../core/manifest-manager.js');
      const Table = (await import('cli-table3')).default;

      // Find MADACE installation
      const madaceRoot = await configManager.findMadaceRoot();
      if (!madaceRoot) {
        console.log(chalk.red('✗ MADACE installation not found'));
        console.log(chalk.yellow('Run "madace install" to install MADACE'));
        process.exit(1);
      }

      manifestManager.initialize(madaceRoot);

      if (type === 'modules') {
        // List installed modules
        const stats = await manifestManager.getStats();
        console.log(chalk.cyan.bold('\n📦 Installed Modules:\n'));
        stats.modules.forEach((module) => {
          const agentCount = stats.agentsByModule[module] || 0;
          const workflowCount = stats.workflowsByModule[module] || 0;
          console.log(`  ${chalk.green('•')} ${chalk.bold(module)} - ${agentCount} agents, ${workflowCount} workflows`);
        });
        console.log('');
      } else if (type === 'agents') {
        // List installed agents
        const agents = await manifestManager.readAgentManifest();
        if (agents.length === 0) {
          console.log(chalk.yellow('\n⚠ No agents installed\n'));
          return;
        }

        console.log(chalk.cyan.bold('\n🤖 Installed Agents:\n'));
        const table = new Table({
          head: [chalk.bold('Name'), chalk.bold('Module'), chalk.bold('Type')],
          colWidths: [30, 15, 15],
        });

        agents.forEach((agent) => {
          table.push([agent.name, agent.module, agent.type || 'standard']);
        });

        console.log(table.toString());
        console.log('');
      } else if (type === 'workflows') {
        // List installed workflows
        const workflows = await manifestManager.readWorkflowManifest();
        if (workflows.length === 0) {
          console.log(chalk.yellow('\n⚠ No workflows installed\n'));
          return;
        }

        console.log(chalk.cyan.bold('\n⚡ Installed Workflows:\n'));
        const table = new Table({
          head: [chalk.bold('Name'), chalk.bold('Module')],
          colWidths: [40, 20],
        });

        workflows.forEach((workflow) => {
          table.push([workflow.name, workflow.module]);
        });

        console.log(table.toString());
        console.log('');
      } else {
        console.log(chalk.red(`Unknown list type: ${type}`));
        console.log(chalk.yellow('Valid types: modules, agents, workflows'));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Uninstall command
program
  .command('uninstall')
  .description('Remove MADACE installation from project')
  .option('-f, --force', 'Force uninstall without confirmation')
  .action(async (_options) => {
    console.log(chalk.yellow('⚠ Uninstall command is in development for v1.0-alpha'));
  });

// Update command
program
  .command('update')
  .description('Update MADACE framework and/or modules')
  .option('-m, --modules <modules...>', 'Specific modules to update')
  .action(async (_options) => {
    console.log(chalk.yellow('⚠ Update command is in development for v1.0-alpha'));
  });

// Agent command
program
  .command('agent <name>')
  .description('Load and interact with an agent')
  .option('-c, --command <trigger>', 'Execute specific menu command')
  .action(async (name, options) => {
    try {
      const { default: agentRuntime } = await import('../core/agent-runtime.js');
      const { default: configManager } = await import('../core/config-manager.js');

      // Find MADACE installation
      const madaceRoot = await configManager.findMadaceRoot();
      if (!madaceRoot) {
        console.log(chalk.red('✗ MADACE installation not found'));
        console.log(chalk.yellow('Run "madace install" to install MADACE'));
        process.exit(1);
      }

      // Build agent path
      const agentPath = join(madaceRoot, 'agents', `${name}.agent.yaml`);

      // Load agent
      await agentRuntime.loadAgent(agentPath);

      // Execute command if specified
      if (options.command) {
        await agentRuntime.executeCommand(options.command);
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

// Workflow command
program
  .command('workflow <name>')
  .description('Execute a workflow')
  .option('-a, --agent <agent>', 'Agent to use for workflow')
  .action(async (name, options) => {
    console.log(chalk.yellow('⚠ Workflow command is in development for v1.0-alpha'));
    console.log(chalk.blue(`Requested: workflow ${name} with agent ${options.agent || 'default'}`));
  });

// Dev commands group
const dev = program.command('dev').description('Development tools for MADACE');

dev
  .command('validate')
  .description('Validate MADACE installation and configuration')
  .action(async () => {
    try {
      const { default: configManager } = await import('../core/config-manager.js');
      const { default: manifestManager } = await import('../core/manifest-manager.js');

      console.log(chalk.cyan('🔍 Validating MADACE installation...\n'));

      // Find installation
      const madaceRoot = await configManager.findMadaceRoot();
      if (!madaceRoot) {
        console.log(chalk.red('✗ MADACE installation not found'));
        process.exit(1);
      }

      // Validate installation structure
      const installResult = await configManager.validateInstallation(madaceRoot);

      if (installResult.valid) {
        console.log(chalk.green('✓ Installation structure valid'));
      } else {
        console.log(chalk.red('✗ Installation issues found:'));
        installResult.issues.forEach((issue) => console.log(chalk.red(`  - ${issue}`)));
      }

      if (installResult.warnings.length > 0) {
        console.log(chalk.yellow('\n⚠ Warnings:'));
        installResult.warnings.forEach((warning) => console.log(chalk.yellow(`  - ${warning}`)));
      }

      // Validate manifests
      manifestManager.initialize(madaceRoot);
      const manifestResult = await manifestManager.validateManifests();

      console.log('');
      if (manifestResult.valid) {
        console.log(chalk.green('✓ Manifests valid'));
      } else {
        console.log(chalk.red('✗ Manifest issues found:'));
        manifestResult.issues.forEach((issue) => console.log(chalk.red(`  - ${issue}`)));
      }

      if (manifestResult.warnings.length > 0) {
        console.log(chalk.yellow('\n⚠ Manifest warnings:'));
        manifestResult.warnings.forEach((warning) => console.log(chalk.yellow(`  - ${warning}`)));
      }

      console.log('');
      const allValid = installResult.valid && manifestResult.valid;
      if (allValid) {
        console.log(chalk.green.bold('✓ Validation complete: All checks passed'));
      } else {
        console.log(chalk.red.bold('✗ Validation complete: Issues found'));
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

dev
  .command('info')
  .description('Show MADACE framework information')
  .action(() => {
    console.log(chalk.cyan.bold('\nMADACE-METHOD Framework\n'));
    console.log(`${chalk.bold('Version:')} ${packageJson.version}`);
    console.log(`${chalk.bold('Description:')} ${packageJson.description}`);
    console.log(`${chalk.bold('License:')} ${packageJson.license}`);
    console.log('');
    console.log(chalk.bold('Core Components:'));
    console.log('  • Agent Loader & Validator');
    console.log('  • Workflow Engine with State Persistence');
    console.log('  • Template Engine with Variable Interpolation');
    console.log('  • Configuration Manager');
    console.log('  • Manifest Manager (CSV)');
    console.log('  • Agent Runtime Executor');
    console.log('');
    console.log(chalk.bold('Documentation:'));
    console.log('  • README.md - Getting started');
    console.log('  • CLAUDE.md - AI assistant guide');
    console.log('  • PRD-MADACE-CORE.md - Product requirements');
    console.log('  • TERMINOLOGY-REFERENCE.md - Complete terminology');
    console.log('');
  });

// Parse command line
program.parse();
