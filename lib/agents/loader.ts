import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';
import { AgentFileSchema } from './schema';
import type { Agent } from '@/lib/types/agent';

export class AgentLoadError extends Error {
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'AgentLoadError';
  }
}

/**
 * Module name aliases for BMAD-MADACE compatibility
 */
const MODULE_ALIASES: Record<string, string> = {
  // BMAD → MADACE
  bmm: 'mam',
  bmb: 'mab',
  // MADACE → BMAD
  mam: 'bmm',
  mab: 'bmb',
};

/**
 * Framework name aliases
 */
const FRAMEWORK_ALIASES: Record<string, string> = {
  bmad: 'madace',
  madace: 'bmad',
};

/**
 * Resolve module name alias (e.g., BMM → MAM, MAM → BMM)
 */
export function resolveModuleAlias(module: string): string {
  const normalized = module.toLowerCase();
  return MODULE_ALIASES[normalized] || normalized;
}

/**
 * Get all possible module names (including aliases)
 */
export function getModuleVariants(module: string): string[] {
  const normalized = module.toLowerCase();
  const alias = MODULE_ALIASES[normalized];
  return alias ? [normalized, alias] : [normalized];
}

/**
 * Get all possible framework names (bmad/madace)
 */
export function getFrameworkVariants(framework: string): string[] {
  const normalized = framework.toLowerCase();
  const alias = FRAMEWORK_ALIASES[normalized];
  return alias ? [normalized, alias] : [normalized];
}

/**
 * Resolve agent directory path with fallback to alias
 * Checks both madace/mam and bmad/bmm directories
 */
export async function resolveAgentDirectory(module: string): Promise<string | null> {
  const cwd = process.cwd();
  const moduleVariants = getModuleVariants(module);
  const frameworkVariants = ['madace', 'bmad'];

  for (const framework of frameworkVariants) {
    for (const mod of moduleVariants) {
      const dirPath = path.join(cwd, framework, mod, 'agents');
      try {
        await fs.access(dirPath);
        return dirPath;
      } catch {
        // Directory doesn't exist, try next variant
      }
    }
  }

  return null;
}

/**
 * Resolve workflow directory path with fallback to alias
 */
export async function resolveWorkflowDirectory(module: string): Promise<string | null> {
  const cwd = process.cwd();
  const moduleVariants = getModuleVariants(module);
  const frameworkVariants = ['madace', 'bmad'];

  for (const framework of frameworkVariants) {
    for (const mod of moduleVariants) {
      const dirPath = path.join(cwd, framework, mod, 'workflows');
      try {
        await fs.access(dirPath);
        return dirPath;
      } catch {
        // Directory doesn't exist, try next variant
      }
    }
  }

  return null;
}

export class AgentLoader {
  private cache = new Map<string, Agent>();

  /**
   * Load an agent from a YAML file
   */
  async loadAgent(filePath: string): Promise<Agent> {
    // Check cache first
    const cached = this.cache.get(filePath);
    if (cached) {
      return cached;
    }

    try {
      // Read file
      const fileContent = await fs.readFile(filePath, 'utf-8');

      // Parse YAML
      const parsed = yaml.load(fileContent) as unknown;

      // Validate with Zod
      const validated = AgentFileSchema.parse(parsed);

      // Cache and return
      this.cache.set(filePath, validated.agent);
      return validated.agent;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        throw new AgentLoadError(`Agent file not found: ${filePath}`, filePath, error);
      }

      if (error instanceof yaml.YAMLException) {
        throw new AgentLoadError(`Invalid YAML in agent file: ${error.message}`, filePath, error);
      }

      if (error instanceof Error && error.name === 'ZodError') {
        throw new AgentLoadError(`Agent validation failed: ${error.message}`, filePath, error);
      }

      throw new AgentLoadError(`Failed to load agent: ${String(error)}`, filePath, error);
    }
  }

  /**
   * Load all agents from a directory
   */
  async loadAgentsFromDirectory(dirPath: string): Promise<Agent[]> {
    try {
      const files = await fs.readdir(dirPath);
      const agentFiles = files.filter((f) => f.endsWith('.agent.yaml'));

      const agents = await Promise.all(
        agentFiles.map((file) => this.loadAgent(path.join(dirPath, file)))
      );

      return agents;
    } catch (error) {
      throw new AgentLoadError(`Failed to load agents from directory: ${dirPath}`, dirPath, error);
    }
  }

  /**
   * Clear the agent cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get a cached agent
   */
  getCached(filePath: string): Agent | undefined {
    return this.cache.get(filePath);
  }
}

// Singleton instance for convenience
const defaultLoader = new AgentLoader();

/**
 * Load an agent from a file (uses default singleton loader)
 */
export async function loadAgent(filePath: string): Promise<Agent> {
  return defaultLoader.loadAgent(filePath);
}

/**
 * Load all agents from a module (with alias support)
 * Checks both MADACE and BMAD directories
 */
export async function loadAgentsByModule(module: string): Promise<Agent[]> {
  const agentDir = await resolveAgentDirectory(module);
  if (!agentDir) {
    throw new AgentLoadError(
      `No agent directory found for module: ${module} (checked both madace/${module} and bmad/${resolveModuleAlias(module)})`,
      module
    );
  }
  return defaultLoader.loadAgentsFromDirectory(agentDir);
}

/**
 * Load all agents from MAM directory (with BMM alias support)
 */
export async function loadMAMAgents(): Promise<Agent[]> {
  return loadAgentsByModule('mam');
}

/**
 * Load all agents from MAB directory (with BMB alias support)
 */
export async function loadMABAgents(): Promise<Agent[]> {
  return loadAgentsByModule('mab');
}

/**
 * Load all MADACE agents (MAM module only)
 */
export async function loadMADACEAgents(): Promise<Agent[]> {
  return loadMAMAgents();
}

/**
 * Load all agents from all modules (MAM, MAB, CIS)
 */
export async function loadAllAgents(): Promise<Agent[]> {
  const modules = ['mam', 'mab', 'cis'];
  const allAgents: Agent[] = [];

  for (const moduleName of modules) {
    try {
      const agents = await loadAgentsByModule(moduleName);
      allAgents.push(...agents);
    } catch {
      // Module directory doesn't exist - skip silently
    }
  }

  return allAgents;
}

/**
 * Clear the agent cache
 */
export function clearAgentCache(): void {
  defaultLoader.clearCache();
}
