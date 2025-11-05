/**
 * Type definitions for BMAD-MADACE interoperability
 */

/**
 * Parsed BMAD markdown agent structure
 */
export interface ParsedBMADAgent {
  name: string;
  title?: string;
  icon?: string;
  role: string;
  identity: string;
  communication_style?: string;
  principles: string[];
  workflows: Array<{
    trigger: string;
    description: string;
  }>;
  critical_actions?: string[];
  load_always?: string[];
  prompts?: string[];
}

/**
 * BMAD workflow configuration structure
 */
export interface BMADWorkflowConfig {
  name: string;
  description: string;
  author?: string;
  config_source?: string;
  project_name?: string;
  output_folder?: string;
  user_name?: string;
  communication_language?: string;
  document_output_language?: string;
  user_skill_level?: string;
  date?: string;
  installed_path?: string;
  instructions?: string;
  status_file?: string;
  default_output_file?: string;
  recommended_inputs?: Record<string, string>[];
  input_file_patterns?: Record<string, Record<string, string>>;
  standalone?: boolean;
}

/**
 * Conversion options
 */
export interface ConversionOptions {
  /** Output file path (optional) */
  outputPath?: string;

  /** Preserve original formatting where possible */
  preserveFormatting?: boolean;

  /** Module to use for converted agent */
  targetModule?: 'mam' | 'mab' | 'cis' | 'bmm' | 'bmb';

  /** Validation mode */
  validate?: boolean;
}

/**
 * Conversion result
 */
export interface ConversionResult {
  success: boolean;
  output: string;
  outputPath?: string;
  warnings: string[];
  errors: string[];
}
