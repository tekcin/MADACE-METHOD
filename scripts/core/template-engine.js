/**
 * Template Engine - Variable Substitution and Rendering
 * Story F5: Template rendering engine with variable substitution
 * Story F8: Variable interpolation system
 */

import fs from 'fs-extra';
import path from 'path';

/**
 * TemplateEngine class
 * Handles template rendering with variable substitution
 * Supports multiple interpolation patterns as defined in TERMINOLOGY-REFERENCE.md
 */
class TemplateEngine {
  constructor() {
    // Interpolation patterns from TERMINOLOGY-REFERENCE.md
    this.patterns = {
      // {{variable_name}} - Primary pattern for Markdown templates
      mustache: /\{\{(\w+)\}\}/g,

      // ${variable_name} - Secondary pattern for code/shell contexts
      dollarBrace: /\$\{(\w+)\}/g,

      // %VARIABLE_NAME% - Windows environment variable style
      percent: /%(\w+)%/g,

      // $variable_name - Shell variable style (word boundary required)
      dollar: /\$(\w+)\b/g,
    };

    // Default pattern priority
    this.defaultPatterns = ['mustache', 'dollarBrace'];
  }

  /**
   * Render a template file with variable substitution
   * @param {string} templatePath - Absolute path to template file
   * @param {object} variables - Variables to substitute
   * @param {object} options - Rendering options
   * @param {string[]} options.patterns - Which patterns to use (default: ['mustache', 'dollarBrace'])
   * @param {boolean} options.strict - Throw error on missing variables (default: false)
   * @returns {Promise<string>} Rendered content
   */
  async renderFile(templatePath, variables = {}, options = {}) {
    const { patterns = this.defaultPatterns, strict = false } = options;

    try {
      // Validate file exists
      if (!(await fs.pathExists(templatePath))) {
        throw new Error(`Template file not found: ${templatePath}`);
      }

      // Read template content
      const content = await fs.readFile(templatePath, 'utf8');

      // Render content
      return this.render(content, variables, { patterns, strict });
    } catch (error) {
      throw new Error(`Failed to render template ${templatePath}: ${error.message}`);
    }
  }

  /**
   * Render template string with variable substitution
   * @param {string} content - Template content
   * @param {object} variables - Variables to substitute
   * @param {object} options - Rendering options
   * @returns {string} Rendered content
   */
  render(content, variables = {}, options = {}) {
    const { patterns = this.defaultPatterns, strict = false } = options;

    let rendered = content;
    const missingVars = new Set();

    // Apply each pattern
    for (const patternName of patterns) {
      const pattern = this.patterns[patternName];
      if (!pattern) {
        console.warn(`Unknown pattern: ${patternName}`);
        continue;
      }

      rendered = rendered.replace(pattern, (match, varName) => {
        if (Object.prototype.hasOwnProperty.call(variables, varName)) {
          return String(variables[varName]);
        } else {
          missingVars.add(varName);
          return strict ? match : ''; // Keep placeholder in strict mode, remove otherwise
        }
      });
    }

    // Handle strict mode
    if (strict && missingVars.size > 0) {
      throw new Error(`Missing required variables: ${Array.from(missingVars).join(', ')}`);
    }

    return rendered;
  }

  /**
   * Render template and save to output file
   * @param {string} templatePath - Path to template file
   * @param {string} outputPath - Path to output file
   * @param {object} variables - Variables to substitute
   * @param {object} options - Rendering options
   * @returns {Promise<string>} Path to rendered file
   */
  async renderToFile(templatePath, outputPath, variables = {}, options = {}) {
    try {
      // Render template
      const rendered = await this.renderFile(templatePath, variables, options);

      // Ensure output directory exists
      await fs.ensureDir(path.dirname(outputPath));

      // Write rendered content
      await fs.writeFile(outputPath, rendered, 'utf8');

      return outputPath;
    } catch (error) {
      throw new Error(`Failed to render to file: ${error.message}`);
    }
  }

  /**
   * Extract variables from template content
   * @param {string} content - Template content
   * @param {string[]} patterns - Which patterns to check (default: all)
   * @returns {string[]} Array of unique variable names
   */
  extractVariables(content, patterns = null) {
    const varsFound = new Set();
    const patternsToCheck = patterns || Object.keys(this.patterns);

    for (const patternName of patternsToCheck) {
      const pattern = this.patterns[patternName];
      if (!pattern) {
        continue;
      }

      let match;
      const regex = new RegExp(pattern.source, pattern.flags);

      while ((match = regex.exec(content)) !== null) {
        varsFound.add(match[1]);
      }
    }

    return Array.from(varsFound).sort();
  }

  /**
   * Validate template against required variables
   * @param {string} templatePath - Path to template file
   * @param {string[]} requiredVars - Required variable names
   * @returns {Promise<object>} Validation result
   */
  async validateTemplate(templatePath, requiredVars = []) {
    try {
      const content = await fs.readFile(templatePath, 'utf8');
      const foundVars = this.extractVariables(content);

      const missing = requiredVars.filter((v) => !foundVars.includes(v));
      const extra = foundVars.filter((v) => !requiredVars.includes(v));

      return {
        valid: missing.length === 0,
        foundVars,
        requiredVars,
        missingVars: missing,
        extraVars: extra,
      };
    } catch (error) {
      throw new Error(`Failed to validate template: ${error.message}`);
    }
  }

  /**
   * Build context from multiple sources
   * @param {...object} sources - Variable sources (later sources override earlier)
   * @returns {object} Merged context
   */
  buildContext(...sources) {
    return Object.assign({}, ...sources);
  }

  /**
   * Get standard MADACE variables
   * @param {object} config - MADACE configuration
   * @returns {object} Standard variables
   */
  getStandardVariables(config = {}) {
    return {
      // From config
      project_name: config.project_name || 'Unknown Project',
      user_name: config.user_name || 'User',
      output_folder: config.output_folder || 'docs',
      communication_language: config.communication_language || 'English',

      // Runtime
      current_date: new Date().toISOString().split('T')[0],
      current_datetime: new Date().toISOString(),
      current_year: new Date().getFullYear().toString(),

      // Paths (to be set by caller)
      madace_root: '',
      project_root: '',
    };
  }

  /**
   * Render template with nested variable resolution
   * Supports variables that reference other variables
   * @param {string} content - Template content
   * @param {object} variables - Variables to substitute
   * @param {object} options - Rendering options
   * @returns {string} Rendered content
   */
  renderNested(content, variables = {}, options = {}) {
    const { patterns = this.defaultPatterns, strict = false, maxDepth = 5 } = options;

    let rendered = content;
    let depth = 0;

    // Keep rendering until no more substitutions or max depth reached
    while (depth < maxDepth) {
      const previous = rendered;
      rendered = this.render(rendered, variables, { patterns, strict: false });

      // No changes means we're done
      if (rendered === previous) {
        break;
      }

      depth++;
    }

    if (depth === maxDepth) {
      console.warn('Max nesting depth reached - possible circular reference');
    }

    // Final strict check if needed
    if (strict) {
      const missingVars = this.extractVariables(rendered, patterns);
      if (missingVars.length > 0) {
        throw new Error(`Missing required variables after nesting: ${missingVars.join(', ')}`);
      }
    }

    return rendered;
  }

  /**
   * Render multiple templates in a directory
   * @param {string} templateDir - Directory containing templates
   * @param {string} outputDir - Directory for rendered output
   * @param {object} variables - Variables to substitute
   * @param {object} options - Rendering options
   * @returns {Promise<string[]>} Paths to rendered files
   */
  async renderDirectory(templateDir, outputDir, variables = {}, options = {}) {
    const { patterns = this.defaultPatterns, strict = false, extension = '.md' } = options;

    try {
      // Ensure directories exist
      if (!(await fs.pathExists(templateDir))) {
        throw new Error(`Template directory not found: ${templateDir}`);
      }

      await fs.ensureDir(outputDir);

      // Find template files
      const files = await fs.readdir(templateDir);
      const templateFiles = files.filter((f) => f.endsWith(extension));

      const renderedFiles = [];

      for (const file of templateFiles) {
        const templatePath = path.join(templateDir, file);
        const outputPath = path.join(outputDir, file);

        await this.renderToFile(templatePath, outputPath, variables, { patterns, strict });
        renderedFiles.push(outputPath);
      }

      return renderedFiles;
    } catch (error) {
      throw new Error(`Failed to render directory: ${error.message}`);
    }
  }
}

// Export singleton instance
export default new TemplateEngine();
export { TemplateEngine };
