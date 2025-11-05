/**
 * BMAD-MADACE Agent Converter
 *
 * Bidirectional conversion between BMAD markdown agents and MADACE YAML agents
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { parseMarkdownAgent } from './markdown-parser';
import { generateMADACEYAML, generateBMADMarkdown } from './yaml-generator';
import { AgentFileSchema } from '../agents/schema';
import type { Agent } from '@/lib/types/agent';
import type { ConversionOptions, ConversionResult } from './types';

/**
 * Convert BMAD markdown agent to MADACE YAML format
 *
 * @param markdownPath - Path to BMAD markdown agent file
 * @param options - Conversion options
 * @returns Conversion result with YAML content
 */
export async function bmadToMADACE(
  markdownPath: string,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    // 1. Read markdown file
    const content = await fs.readFile(markdownPath, 'utf-8');

    // 2. Parse markdown structure
    const parsed = parseMarkdownAgent(content);

    // 3. Generate MADACE YAML
    const targetModule = options.targetModule || 'mam';
    const yamlContent = generateMADACEYAML(parsed, targetModule);

    // 4. Validate if requested
    if (options.validate !== false) {
      try {
        const parsed = yaml.load(yamlContent);
        AgentFileSchema.parse(parsed);
      } catch (validationError) {
        errors.push(`Validation failed: ${validationError}`);
        return {
          success: false,
          output: yamlContent,
          warnings,
          errors,
        };
      }
    }

    // 5. Write to file if output path provided
    if (options.outputPath) {
      await fs.mkdir(path.dirname(options.outputPath), { recursive: true });
      await fs.writeFile(options.outputPath, yamlContent, 'utf-8');
    }

    return {
      success: true,
      output: yamlContent,
      outputPath: options.outputPath,
      warnings,
      errors,
    };
  } catch (error) {
    errors.push(`Conversion failed: ${error instanceof Error ? error.message : String(error)}`);
    return {
      success: false,
      output: '',
      warnings,
      errors,
    };
  }
}

/**
 * Convert MADACE YAML agent to BMAD markdown format
 *
 * @param yamlPath - Path to MADACE YAML agent file
 * @param options - Conversion options
 * @returns Conversion result with markdown content
 */
export async function madaceToBMAD(
  yamlPath: string,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  const warnings: string[] = [];
  const errors: string[] = [];

  try {
    // 1. Read and parse YAML
    const content = await fs.readFile(yamlPath, 'utf-8');
    const parsed = yaml.load(content) as { agent: Agent };

    // 2. Validate MADACE agent schema
    if (options.validate !== false) {
      try {
        AgentFileSchema.parse(parsed);
      } catch (validationError) {
        errors.push(`Invalid MADACE agent: ${validationError}`);
        return {
          success: false,
          output: '',
          warnings,
          errors,
        };
      }
    }

    // 3. Generate BMAD markdown
    const markdown = generateBMADMarkdown(parsed.agent);

    // 4. Write to file if output path provided
    if (options.outputPath) {
      await fs.mkdir(path.dirname(options.outputPath), { recursive: true });
      await fs.writeFile(options.outputPath, markdown, 'utf-8');
    }

    return {
      success: true,
      output: markdown,
      outputPath: options.outputPath,
      warnings,
      errors,
    };
  } catch (error) {
    errors.push(`Conversion failed: ${error instanceof Error ? error.message : String(error)}`);
    return {
      success: false,
      output: '',
      warnings,
      errors,
    };
  }
}

/**
 * Batch convert BMAD agents to MADACE format
 *
 * @param inputDir - Directory containing BMAD markdown agents
 * @param outputDir - Directory to write MADACE YAML agents
 * @param options - Conversion options
 * @returns Array of conversion results
 */
export async function batchBmadToMADACE(
  inputDir: string,
  outputDir: string,
  options: ConversionOptions = {}
): Promise<ConversionResult[]> {
  const results: ConversionResult[] = [];

  try {
    // Read all .md files from input directory
    const files = await fs.readdir(inputDir);
    const markdownFiles = files.filter((f) => f.endsWith('.md'));

    for (const file of markdownFiles) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file.replace('.md', '.agent.yaml'));

      const result = await bmadToMADACE(inputPath, {
        ...options,
        outputPath,
      });

      results.push(result);
    }
  } catch (error) {
    results.push({
      success: false,
      output: '',
      warnings: [],
      errors: [
        `Batch conversion failed: ${error instanceof Error ? error.message : String(error)}`,
      ],
    });
  }

  return results;
}

/**
 * Batch convert MADACE agents to BMAD format
 *
 * @param inputDir - Directory containing MADACE YAML agents
 * @param outputDir - Directory to write BMAD markdown agents
 * @param options - Conversion options
 * @returns Array of conversion results
 */
export async function batchMadaceToBMAD(
  inputDir: string,
  outputDir: string,
  options: ConversionOptions = {}
): Promise<ConversionResult[]> {
  const results: ConversionResult[] = [];

  try {
    // Read all .agent.yaml files from input directory
    const files = await fs.readdir(inputDir);
    const yamlFiles = files.filter((f) => f.endsWith('.agent.yaml'));

    for (const file of yamlFiles) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file.replace('.agent.yaml', '.md'));

      const result = await madaceToBMAD(inputPath, {
        ...options,
        outputPath,
      });

      results.push(result);
    }
  } catch (error) {
    results.push({
      success: false,
      output: '',
      warnings: [],
      errors: [
        `Batch conversion failed: ${error instanceof Error ? error.message : String(error)}`,
      ],
    });
  }

  return results;
}

/**
 * Get default output path for conversion
 *
 * @param inputPath - Input file path
 * @param format - Target format ('bmad' or 'madace')
 * @returns Default output path
 */
export function getDefaultOutputPath(inputPath: string, format: 'bmad' | 'madace'): string {
  const basename = path.basename(inputPath);

  if (format === 'madace') {
    // BMAD → MADACE: .md → .agent.yaml
    const yamlName = basename.replace('.md', '.agent.yaml');
    return path.join('madace', 'mam', 'agents', yamlName);
  } else {
    // MADACE → BMAD: .agent.yaml → .md
    const mdName = basename.replace('.agent.yaml', '.md');
    return path.join('bmad', 'bmm', 'agents', mdName);
  }
}
