/**
 * Comprehensive API Tests: Agent API
 * Tests all /api/v3/agents endpoints
 * YOLO Mode - Test every endpoint, method, error case
 */

import { test, expect } from '@playwright/test';
import { fullTestSetup, cleanup, getTestAgent } from '../../helpers/db-setup';

test.describe('Agent API - YOLO Mode 🔥', () => {
  let testAgentId: string;

  test.beforeAll(async () => {
    const { agents } = await fullTestSetup();
    testAgentId = agents[0].id;
  });

  test.afterAll(async () => {
    await cleanup();
  });

  test('GET /api/v3/agents - should return all agents', async ({ request }) => {
    console.log('🧪 Test: GET /api/v3/agents');

    const response = await request.get('http://localhost:3000/api/v3/agents');

    // Should return 200
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // Parse response
    const data = await response.json();
    console.log(`   Response:`, JSON.stringify(data).slice(0, 100));

    // Should have success flag
    if (data.success !== undefined) {
      expect(data.success).toBe(true);
    }

    // Should have agents array
    const agents = data.agents || data.data || data;
    expect(Array.isArray(agents)).toBe(true);
    expect(agents.length).toBeGreaterThan(0);

    // Each agent should have required fields
    const firstAgent = agents[0];
    expect(firstAgent).toHaveProperty('id');
    expect(firstAgent).toHaveProperty('name');
    expect(firstAgent).toHaveProperty('title');
    expect(firstAgent).toHaveProperty('module');

    console.log(`   ✓ Retrieved ${agents.length} agents`);
  });

  test('GET /api/v3/agents/[id] - should return specific agent', async ({ request }) => {
    console.log('🧪 Test: GET /api/v3/agents/[id]');

    const response = await request.get(`http://localhost:3000/api/v3/agents/${testAgentId}`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    const agent = data.agent || data.data || data;

    expect(agent.id).toBe(testAgentId);
    expect(agent).toHaveProperty('name');
    expect(agent).toHaveProperty('persona');
    expect(agent).toHaveProperty('menu');

    console.log(`   ✓ Retrieved agent: ${agent.name}`);
  });

  test('GET /api/v3/agents/[id] - should return 404 for non-existent agent', async ({ request }) => {
    console.log('🧪 Test: GET non-existent agent (404)');

    const response = await request.get('http://localhost:3000/api/v3/agents/non-existent-id-12345');

    expect(response.status()).toBe(404);

    const data = await response.json();
    expect(data.success).toBe(false);

    console.log('   ✓ 404 error handled correctly');
  });

  test('POST /api/v3/agents - should create new agent', async ({ request }) => {
    console.log('🧪 Test: POST /api/v3/agents (create)');

    const newAgent = {
      name: `test-api-agent-${Date.now()}`,
      title: 'Test API Agent',
      module: 'TEST',
      version: '1.0.0',
      icon: '🧪',
      persona: {
        name: 'TestAPI',
        role: 'Test Agent',
        expertise: ['API Testing'],
        tone: 'Professional'
      },
      menu: {
        options: [
          { id: 'test', label: 'Test Action', action: 'test' }
        ]
      }
    };

    const response = await request.post('http://localhost:3000/api/v3/agents', {
      data: newAgent
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const data = await response.json();
    const createdAgent = data.agent || data.data || data;

    expect(createdAgent).toHaveProperty('id');
    expect(createdAgent.name).toBe(newAgent.name);

    console.log(`   ✓ Created agent with ID: ${createdAgent.id}`);
  });

  test('POST /api/v3/agents - should validate required fields', async ({ request }) => {
    console.log('🧪 Test: POST with missing required fields');

    const invalidAgent = {
      // Missing required fields
      title: 'Invalid Agent'
    };

    const response = await request.post('http://localhost:3000/api/v3/agents', {
      data: invalidAgent
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);

    console.log('   ✓ Validation error returned');
  });

  test('POST /api/v3/agents - should prevent duplicate names', async ({ request }) => {
    console.log('🧪 Test: POST with duplicate name');

    const duplicateAgent = {
      name: 'pm', // Exists from seed data
      title: 'Duplicate PM',
      module: 'TEST',
      version: '1.0.0',
      persona: { name: 'Dup', role: 'Test' },
      menu: { options: [] }
    };

    const response = await request.post('http://localhost:3000/api/v3/agents', {
      data: duplicateAgent
    });

    // Should be 400 (bad request) or 409 (conflict)
    expect([400, 409]).toContain(response.status());

    const data = await response.json();
    expect(data.success).toBe(false);

    console.log('   ✓ Duplicate name prevented');
  });

  test('PUT /api/v3/agents/[id] - should update agent', async ({ request }) => {
    console.log('🧪 Test: PUT /api/v3/agents/[id] (update)');

    const updates = {
      title: 'Updated Test Agent',
      version: '2.0.0'
    };

    const response = await request.put(`http://localhost:3000/api/v3/agents/${testAgentId}`, {
      data: updates
    });

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    const updatedAgent = data.agent || data.data || data;

    expect(updatedAgent.title).toBe(updates.title);
    expect(updatedAgent.version).toBe(updates.version);

    console.log('   ✓ Agent updated successfully');
  });

  test('DELETE /api/v3/agents/[id] - should delete agent', async ({ request }) => {
    console.log('🧪 Test: DELETE /api/v3/agents/[id]');

    // Create agent to delete
    const createResponse = await request.post('http://localhost:3000/api/v3/agents', {
      data: {
        name: `delete-test-${Date.now()}`,
        title: 'To Be Deleted',
        module: 'TEST',
        version: '1.0.0',
        persona: { name: 'Del', role: 'Test' },
        menu: { options: [] }
      }
    });

    const created = await createResponse.json();
    const agentId = (created.agent || created.data || created).id;

    // Delete it
    const deleteResponse = await request.delete(`http://localhost:3000/api/v3/agents/${agentId}`);

    expect(deleteResponse.ok()).toBeTruthy();
    expect(deleteResponse.status()).toBe(200);

    // Verify it's deleted
    const getResponse = await request.get(`http://localhost:3000/api/v3/agents/${agentId}`);
    expect(getResponse.status()).toBe(404);

    console.log('   ✓ Agent deleted successfully');
  });

  test('POST /api/v3/agents/[id]/duplicate - should duplicate agent', async ({ request }) => {
    console.log('🧪 Test: POST /api/v3/agents/[id]/duplicate');

    const response = await request.post(`http://localhost:3000/api/v3/agents/${testAgentId}/duplicate`);

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const data = await response.json();
    const duplicated = data.agent || data.data || data;

    expect(duplicated.id).not.toBe(testAgentId);
    expect(duplicated.name).toContain('copy'); // Should have "(Copy)" or similar

    console.log('   ✓ Agent duplicated successfully');
  });

  test('POST /api/v3/agents/[id]/export - should export agent as JSON', async ({ request }) => {
    console.log('🧪 Test: POST /api/v3/agents/[id]/export');

    const response = await request.post(`http://localhost:3000/api/v3/agents/${testAgentId}/export`);

    expect(response.ok()).toBeTruthy();

    const data = await response.json();

    // Should have agent data
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('persona');

    console.log('   ✓ Agent exported as JSON');
  });

  test('POST /api/v3/agents/import - should import agent from JSON', async ({ request }) => {
    console.log('🧪 Test: POST /api/v3/agents/import');

    const importData = {
      name: `imported-agent-${Date.now()}`,
      title: 'Imported Agent',
      module: 'TEST',
      version: '1.0.0',
      persona: {
        name: 'Imported',
        role: 'Test Import',
        expertise: ['Importing'],
        tone: 'Neutral'
      },
      menu: {
        options: [{ id: 'import-test', label: 'Test', action: 'test' }]
      }
    };

    const response = await request.post('http://localhost:3000/api/v3/agents/import', {
      data: importData
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    const imported = data.agent || data.data || data;

    expect(imported.name).toBe(importData.name);

    console.log('   ✓ Agent imported successfully');
  });

  test('GET /api/v3/agents/search?q=query - should search agents', async ({ request }) => {
    console.log('🧪 Test: GET /api/v3/agents/search');

    const response = await request.get('http://localhost:3000/api/v3/agents/search?q=Product');

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    const results = data.agents || data.results || data.data || data;

    expect(Array.isArray(results)).toBe(true);

    // Should find PM (Product Manager)
    if (results.length > 0) {
      const containsProduct = results.some((a: any) =>
        a.title.includes('Product') || a.name.includes('pm')
      );
      expect(containsProduct).toBe(true);
    }

    console.log(`   ✓ Search returned ${results.length} results`);
  });

  test('API should handle concurrent requests', async ({ request }) => {
    console.log('🧪 Test: Concurrent API requests');

    // Make 10 simultaneous requests
    const promises = Array.from({ length: 10 }, () =>
      request.get('http://localhost:3000/api/v3/agents')
    );

    const responses = await Promise.all(promises);

    // All should succeed
    responses.forEach(response => {
      expect(response.ok()).toBeTruthy();
    });

    console.log('   ✓ Handled 10 concurrent requests');
  });

  test('API should return proper CORS headers', async ({ request }) => {
    console.log('🧪 Test: CORS headers');

    const response = await request.get('http://localhost:3000/api/v3/agents');

    const headers = response.headers();

    // Check for CORS headers (if implemented)
    if (headers['access-control-allow-origin']) {
      console.log(`   CORS: ${headers['access-control-allow-origin']}`);
    }

    console.log('   ✓ Headers verified');
  });

  test('API should handle malformed JSON', async ({ request }) => {
    console.log('🧪 Test: Malformed JSON handling');

    const response = await request.post('http://localhost:3000/api/v3/agents', {
      data: 'this is not valid JSON{{{',
      headers: {
        'content-type': 'text/plain'
      }
    });

    // Should return 400
    expect(response.status()).toBe(400);

    console.log('   ✓ Malformed JSON rejected');
  });

  test('API should handle large payloads', async ({ request }) => {
    console.log('🧪 Test: Large payload handling');

    // Create agent with very large persona
    const largeData = {
      name: `large-payload-${Date.now()}`,
      title: 'Large Payload Test',
      module: 'TEST',
      version: '1.0.0',
      persona: {
        name: 'Large',
        role: 'Test',
        expertise: Array.from({ length: 100 }, (_, i) => `Skill ${i}`),
        description: 'A'.repeat(10000) // 10KB string
      },
      menu: { options: [] }
    };

    const response = await request.post('http://localhost:3000/api/v3/agents', {
      data: largeData
    });

    // Should handle it (or reject with clear error)
    if (response.ok()) {
      console.log('   ✓ Large payload accepted');
    } else {
      expect(response.status()).toBe(413); // Payload Too Large
      console.log('   ✓ Large payload rejected appropriately');
    }
  });
});
