/**
 * Workflow Loader
 */

import fs from 'fs/promises';
import yaml from 'js-yaml';
import path from 'path';
import { existsSync } from 'fs';
import type { Workflow } from './types';
import { WorkflowFileSchema } from './schema';
import { getModuleVariants, getFrameworkVariants } from '../agents/loader';

export class WorkflowLoadError extends Error {
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'WorkflowLoadError';
  }
}

/**
 * Get all possible workflow directories
 * Supports both MADACE (flat) and BMAD (nested) structures
 */
export function getWorkflowDirectories(): string[] {
  const cwd = process.cwd();
  const modules = ['mam', 'mab', 'cis', 'core'];
  const frameworks = ['madace', 'bmad'];
  const directories: string[] = [];

  for (const framework of frameworks) {
    for (const moduleName of modules) {
      const moduleVariants = getModuleVariants(moduleName);
      for (const mod of moduleVariants) {
        const dir = path.join(cwd, framework, mod, 'workflows');
        directories.push(dir);
      }
    }
  }

  return directories;
}

/**
 * Find workflow file in all supported directories
 * Handles both MADACE (.workflow.yaml) and BMAD (nested/workflow.yaml) structures
 */
export async function findWorkflow(name: string): Promise<string | null> {
  const directories = getWorkflowDirectories();

  // Possible file name patterns
  const possibleNames = [
    `${name}.workflow.yaml`, // MADACE format
    `${name}.yaml`, // Alternative
    name, // If full path provided
  ];

  // Check flat structure (MADACE)
  for (const dir of directories) {
    for (const fileName of possibleNames) {
      const filePath = path.join(dir, fileName);
      if (existsSync(filePath)) {
        return filePath;
      }
    }

    // Check nested structure (BMAD)
    // BMAD workflows are in nested directories like:
    // bmad/bmm/workflows/2-plan-workflows/prd/workflow.yaml
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const nestedDir = path.join(dir, entry.name);
          const nestedWorkflow = path.join(nestedDir, name, 'workflow.yaml');
          if (existsSync(nestedWorkflow)) {
            return nestedWorkflow;
          }

          // Also check direct child directories
          const directWorkflow = path.join(nestedDir, 'workflow.yaml');
          if (existsSync(directWorkflow) && entry.name === name) {
            return directWorkflow;
          }
        }
      }
    } catch {
      // Directory doesn't exist or can't be read, continue
    }
  }

  return null;
}

/**
 * Load all workflows from a module (with alias support)
 */
export async function loadWorkflowsByModule(moduleName: string): Promise<Workflow[]> {
  const workflows: Workflow[] = [];
  const cwd = process.cwd();
  const moduleVariants = getModuleVariants(moduleName);
  const frameworkVariants = getFrameworkVariants('madace');

  for (const framework of frameworkVariants) {
    for (const mod of moduleVariants) {
      const dir = path.join(cwd, framework, mod, 'workflows');
      try {
        const files = await fs.readdir(dir);
        const workflowFiles = files.filter(
          (f) => f.endsWith('.workflow.yaml') || f.endsWith('.yaml')
        );

        for (const file of workflowFiles) {
          try {
            const workflow = await loadWorkflow(path.join(dir, file));
            workflows.push(workflow);
          } catch {
            // File may be invalid - skip silently
          }
        }
      } catch {
        // Directory doesn't exist, skip
      }
    }
  }

  return workflows;
}

/**
 * Load all workflows from all supported directories
 */
export async function loadAllWorkflows(): Promise<Workflow[]> {
  const modules = ['mam', 'mab', 'cis', 'core'];
  const allWorkflows: Workflow[] = [];

  for (const moduleName of modules) {
    try {
      const workflows = await loadWorkflowsByModule(moduleName);
      allWorkflows.push(...workflows);
    } catch {
      // Module directory doesn't exist - skip silently
    }
  }

  return allWorkflows;
}

export async function loadWorkflow(filePath: string): Promise<Workflow> {
  try {
    const absolutePath = path.resolve(filePath);
    const content = await fs.readFile(absolutePath, 'utf-8');
    const parsed = yaml.load(content) as unknown;
    const validated = WorkflowFileSchema.parse(parsed);
    return validated.workflow;
  } catch (error) {
    throw new WorkflowLoadError(
      `Failed to load workflow: ${error instanceof Error ? error.message : 'Unknown error'}`,
      filePath,
      error instanceof Error ? error : undefined
    );
  }
}
