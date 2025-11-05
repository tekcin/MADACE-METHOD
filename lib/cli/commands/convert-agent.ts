/**
 * CLI Command: Convert Agents
 *
 * Convert agents between BMAD and MADACE formats
 */

/* eslint-disable no-console */

import { Command } from 'commander';
import path from 'path';
import {
  bmadToMADACE,
  madaceToBMAD,
  batchBmadToMADACE,
  batchMadaceToBMAD,
  getDefaultOutputPath,
} from '@/lib/interop/agent-converter';

/**
 * Register convert-agent command
 */
export function registerConvertAgentCommand(program: Command): void {
  const convert = program
    .command('convert-agent')
    .description('Convert a single agent between BMAD and MADACE formats')
    .requiredOption('--from <format>', 'Source format: bmad or madace')
    .requiredOption('--input <path>', 'Input file path')
    .option('--output <path>', 'Output file path (default: auto-generated)')
    .option('--module <module>', 'Target module (mam, mab, cis)', 'mam')
    .option('--no-validate', 'Skip validation');

  convert.action(async (options) => {
    const { from, input, output, module, validate } = options;

    try {
      console.log(
        `\n🔄 Converting agent: ${from.toUpperCase()} → ${from === 'bmad' ? 'MADACE' : 'BMAD'}`
      );
      console.log(`📁 Input: ${input}`);

      const outputPath = output || getDefaultOutputPath(input, from === 'bmad' ? 'madace' : 'bmad');
      console.log(`📁 Output: ${outputPath}\n`);

      let result;

      if (from === 'bmad') {
        result = await bmadToMADACE(input, {
          outputPath,
          targetModule: module,
          validate,
        });
      } else if (from === 'madace') {
        result = await madaceToBMAD(input, {
          outputPath,
          validate,
        });
      } else {
        throw new Error(`Unknown format: ${from}. Use 'bmad' or 'madace'`);
      }

      if (result.success) {
        console.log('✅ Conversion successful!');
        if (result.outputPath) {
          console.log(`✅ Written to: ${result.outputPath}`);
        }
        if (result.warnings.length > 0) {
          console.log('\n⚠️  Warnings:');
          result.warnings.forEach((w) => console.log(`   - ${w}`));
        }
      } else {
        console.error('\n❌ Conversion failed:');
        result.errors.forEach((e) => console.error(`   - ${e}`));
        process.exit(1);
      }
    } catch (error) {
      console.error('\n❌ Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });
}

/**
 * Register convert-agents-batch command
 */
export function registerConvertAgentsBatchCommand(program: Command): void {
  const batchConvert = program
    .command('convert-agents-batch')
    .description('Convert multiple agents at once')
    .requiredOption('--from <format>', 'Source format: bmad or madace')
    .requiredOption('--input-dir <path>', 'Input directory')
    .option('--output-dir <path>', 'Output directory (default: auto-generated)')
    .option('--module <module>', 'Target module (mam, mab, cis)', 'mam')
    .option('--no-validate', 'Skip validation');

  batchConvert.action(async (options) => {
    const { from, inputDir, outputDir, module, validate } = options;

    try {
      console.log(
        `\n🔄 Batch converting agents: ${from.toUpperCase()} → ${from === 'bmad' ? 'MADACE' : 'BMAD'}`
      );
      console.log(`📁 Input directory: ${inputDir}`);

      const defaultOutputDir =
        from === 'bmad'
          ? path.join('madace', module, 'agents')
          : path.join('bmad', from === 'madace' ? 'bmm' : module, 'agents');

      const targetOutputDir = outputDir || defaultOutputDir;
      console.log(`📁 Output directory: ${targetOutputDir}\n`);

      let results;

      if (from === 'bmad') {
        results = await batchBmadToMADACE(inputDir, targetOutputDir, {
          targetModule: module,
          validate,
        });
      } else if (from === 'madace') {
        results = await batchMadaceToBMAD(inputDir, targetOutputDir, {
          validate,
        });
      } else {
        throw new Error(`Unknown format: ${from}. Use 'bmad' or 'madace'`);
      }

      // Summary
      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      console.log('\n📊 Conversion Summary:');
      console.log(`   ✅ Successful: ${successful}`);
      console.log(`   ❌ Failed: ${failed}`);
      console.log(`   📝 Total: ${results.length}`);

      // Show errors
      const errors = results.filter((r) => !r.success);
      if (errors.length > 0) {
        console.log('\n❌ Errors:');
        errors.forEach((r, i) => {
          console.log(`\n   ${i + 1}. ${r.errors.join(', ')}`);
        });
        process.exit(1);
      }

      // Show warnings
      const warnings = results.flatMap((r) => r.warnings);
      if (warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        warnings.forEach((w) => console.log(`   - ${w}`));
      }

      console.log('\n✅ Batch conversion complete!');
    } catch (error) {
      console.error('\n❌ Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });
}
