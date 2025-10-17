#!/usr/bin/env node
/**
 * Alpha Test Suite for MADACE-METHOD v1.0-alpha.1
 * Tests core functionality, CLI, and module workflows
 */

import path from 'path';
import { fileURLToPath } from 'url';
import agentLoader from './scripts/core/agent-loader.js';
import workflowEngine from './scripts/core/workflow-engine.js';
import templateEngine from './scripts/core/template-engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

function logTest(name, passed, error = null) {
  results.tests.push({ name, passed, error });
  if (passed) {
    results.passed++;
    console.log(`✅ ${name}`);
  } else {
    results.failed++;
    console.log(`❌ ${name}`);
    if (error) {console.error(`   Error: ${error.message}`);}
  }
}

async function runTests() {
  console.log('🧪 MADACE-METHOD v1.0-alpha.1 Alpha Test Suite\n');
  console.log('='.repeat(60));
  console.log('Testing Core Framework Components\n');

  // Test 1: Agent Loader
  try {
    const agentPath = path.join(__dirname, 'modules/core/agents/master.agent.yaml');
    const agent = await agentLoader.loadAgent(agentPath);
    logTest('Agent Loader - Load master agent', agent.agent.metadata.name === 'MADACE Master');
  } catch (error) {
    logTest('Agent Loader - Load master agent', false, error);
  }

  // Test 2: Agent Validation
  try {
    const agentPath = path.join(__dirname, 'modules/mam/agents/pm.agent.yaml');
    const agent = await agentLoader.loadAgent(agentPath);
    logTest('Agent Loader - Validate PM agent', agent.agent.metadata.id === 'madace/mam/agents/pm.md');
  } catch (error) {
    logTest('Agent Loader - Validate PM agent', false, error);
  }

  // Test 3: Load Multiple Agents
  try {
    const agentsDir = path.join(__dirname, 'modules/mam/agents');
    const agents = await agentLoader.loadAgentsFromDirectory(agentsDir);
    logTest('Agent Loader - Load multiple agents', agents.length >= 5);
  } catch (error) {
    logTest('Agent Loader - Load multiple agents', false, error);
  }

  // Test 4: Template Engine - Variable Substitution
  try {
    const template = 'Hello {user_name}, welcome to {project_name}!';
    const context = { user_name: 'Test User', project_name: 'Test Project' };
    const result = templateEngine.render(template, context);
    logTest('Template Engine - Variable substitution', result === 'Hello Test User, welcome to Test Project!');
  } catch (error) {
    logTest('Template Engine - Variable substitution', false, error);
  }

  // Test 5: Template Engine - Path Variables
  try {
    const template = 'Path: {project-root}/output';
    const context = { 'project-root': '/test/path' };
    const result = templateEngine.render(template, context);
    logTest('Template Engine - Path variables', result === 'Path: /test/path/output');
  } catch (error) {
    logTest('Template Engine - Path variables', false, error);
  }

  // Test 6: Workflow Engine - Load Workflow
  try {
    const workflowPath = path.join(__dirname, 'modules/mam/workflows/assess-scale/workflow.yaml');
    const workflow = await workflowEngine.loadWorkflow(workflowPath);
    logTest('Workflow Engine - Load workflow', workflow.workflow.name === 'Assess Project Scale');
  } catch (error) {
    logTest('Workflow Engine - Load workflow', false, error);
  }

  // Test 7: Check CIS Agents
  try {
    const cisAgentPath = path.join(__dirname, 'modules/cis/agents/creativity.agent.yaml');
    const agent = await agentLoader.loadAgent(cisAgentPath);
    logTest('CIS Module - Load creativity agent', agent.agent.metadata.name === 'Creativity');
  } catch (error) {
    logTest('CIS Module - Load creativity agent', false, error);
  }

  // Test 8: Check MAB Agent
  try {
    const mabAgentPath = path.join(__dirname, 'modules/mab/agents/builder.agent.yaml');
    const agent = await agentLoader.loadAgent(mabAgentPath);
    logTest('MAB Module - Load builder agent', agent.agent.metadata.name === 'Builder');
  } catch (error) {
    logTest('MAB Module - Load builder agent', false, error);
  }

  // Test 9: Verify Workflow Templates Exist
  try {
    const fs = await import('fs-extra');
    const templatePath = path.join(__dirname, 'modules/mam/workflows/plan-project/templates/PRD.md');
    const exists = await fs.pathExists(templatePath);
    logTest('MAM Workflows - PRD template exists', exists);
  } catch (error) {
    logTest('MAM Workflows - PRD template exists', false, error);
  }

  // Test 10: Verify Story Template
  try {
    const fs = await import('fs-extra');
    const templatePath = path.join(__dirname, 'modules/mam/workflows/create-story/templates/story.md');
    const exists = await fs.pathExists(templatePath);
    logTest('MAM Workflows - Story template exists', exists);
  } catch (error) {
    logTest('MAM Workflows - Story template exists', false, error);
  }

  // Test 11: Check State Machine
  try {
    const stateMachine = await import('./scripts/core/state-machine.js');
    logTest('State Machine - Module loads', stateMachine.default !== undefined);
  } catch (error) {
    logTest('State Machine - Module loads', false, error);
  }

  // Test 12: Verify Build Tools
  try {
    const fs = await import('fs-extra');
    const bundlerExists = await fs.pathExists(path.join(__dirname, 'scripts/build/bundler.js'));
    const validatorExists = await fs.pathExists(path.join(__dirname, 'scripts/build/validator.js'));
    const flattenerExists = await fs.pathExists(path.join(__dirname, 'scripts/build/flattener.js'));
    logTest('Build Tools - All tools exist', bundlerExists && validatorExists && flattenerExists);
  } catch (error) {
    logTest('Build Tools - All tools exist', false, error);
  }

  // Print Summary
  console.log(`\n${  '='.repeat(60)}`);
  console.log('Test Summary\n');
  console.log(`Total Tests: ${results.tests.length}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`);

  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests
      .filter((t) => !t.passed)
      .forEach((t) => {
        console.log(`   - ${t.name}`);
        if (t.error) {console.log(`     ${t.error.message}`);}
      });
  }

  console.log(`\n${  '='.repeat(60)}`);

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch((error) => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
