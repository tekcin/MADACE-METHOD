/**
 * Chrome DevTools MCP Helper for E2E Tests
 * Wraps MCP tools with convenient test-friendly methods
 */

export class ChromeTestHelper {
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Navigate to a page
   */
  async goto(path: string, timeout = 30000) {
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    console.log(`🌐 Navigating to: ${url}`);

    // Note: Actual navigation will be done by MCP tool in test
    return { url, timeout };
  }

  /**
   * Take snapshot and parse to find elements
   */
  parseSnapshot(snapshotText: string) {
    // Parse the snapshot text to extract elements with UIDs
    const elements: Array<{
      uid: string;
      text: string;
      role: string;
      tag: string;
    }> = [];

    // Simple parser - real implementation would be more robust
    const lines = snapshotText.split('\n');
    for (const line of lines) {
      // Look for patterns like: [uid:123] button "Click Me"
      const match = line.match(/\[uid:([^\]]+)\]\s+(\w+)\s+"([^"]+)"/);
      if (match) {
        elements.push({
          uid: match[1],
          role: match[2],
          text: match[3],
          tag: match[2]
        });
      }

      // Also look for: [uid:123] "Some Text"
      const simpleMatch = line.match(/\[uid:([^\]]+)\]\s+"([^"]+)"/);
      if (simpleMatch && !match) {
        elements.push({
          uid: simpleMatch[1],
          role: 'text',
          text: simpleMatch[2],
          tag: 'div'
        });
      }
    }

    return elements;
  }

  /**
   * Find element by text content
   */
  findByText(elements: any[], text: string, exact = false) {
    if (exact) {
      return elements.find(el => el.text === text);
    }
    return elements.find(el => el.text?.includes(text));
  }

  /**
   * Find element by role
   */
  findByRole(elements: any[], role: string, name?: string) {
    const matches = elements.filter(el => el.role === role);
    if (name) {
      return matches.find(el => el.text?.includes(name));
    }
    return matches[0];
  }

  /**
   * Find all elements by role
   */
  findAllByRole(elements: any[], role: string) {
    return elements.filter(el => el.role === role);
  }

  /**
   * Assert no console errors (helper for test assertions)
   */
  filterConsoleErrors(messages: any[]) {
    return messages.filter(msg =>
      msg.type === 'error' ||
      msg.level === 'error' ||
      msg.type === 'assert'
    );
  }

  /**
   * Filter network requests by URL pattern
   */
  filterNetworkRequests(requests: any[], pattern: string | RegExp) {
    if (typeof pattern === 'string') {
      return requests.filter(req => req.url?.includes(pattern));
    }
    return requests.filter(req => pattern.test(req.url || ''));
  }

  /**
   * Wait helper (for timing-dependent operations)
   */
  async wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Format test name
   */
  testName(description: string) {
    return `🧪 ${description}`;
  }

  /**
   * Log test step
   */
  logStep(step: string) {
    console.log(`   ✓ ${step}`);
  }

  /**
   * Log test error
   */
  logError(error: string) {
    console.error(`   ✗ ${error}`);
  }

  /**
   * Create screenshot filename
   */
  screenshotName(testName: string, suffix = '') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sanitized = testName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    return `${sanitized}-${suffix}-${timestamp}.png`;
  }
}

/**
 * Assertion helpers for tests
 */
export class TestAssertions {
  /**
   * Assert element exists
   */
  static assertElementExists(element: any, description: string) {
    if (!element) {
      throw new Error(`Element not found: ${description}`);
    }
  }

  /**
   * Assert text content
   */
  static assertTextContent(element: any, expectedText: string, exact = false) {
    if (!element) {
      throw new Error('Element is null or undefined');
    }

    const actualText = element.text || element.content || '';
    if (exact) {
      if (actualText !== expectedText) {
        throw new Error(`Expected text "${expectedText}", but got "${actualText}"`);
      }
    } else {
      if (!actualText.includes(expectedText)) {
        throw new Error(`Expected text to contain "${expectedText}", but got "${actualText}"`);
      }
    }
  }

  /**
   * Assert no console errors
   */
  static assertNoConsoleErrors(messages: any[]) {
    const errors = messages.filter(msg =>
      msg.type === 'error' ||
      msg.level === 'error'
    );

    if (errors.length > 0) {
      const errorDetails = errors.map(e =>
        `${e.type}: ${e.text || e.message}`
      ).join('\n');
      throw new Error(`Found ${errors.length} console errors:\n${errorDetails}`);
    }
  }

  /**
   * Assert HTTP status
   */
  static assertHttpStatus(request: any, expectedStatus: number) {
    if (request.status !== expectedStatus) {
      throw new Error(
        `Expected HTTP ${expectedStatus}, but got ${request.status} for ${request.url}`
      );
    }
  }

  /**
   * Assert network request made
   */
  static assertNetworkRequest(requests: any[], pattern: string | RegExp) {
    const matches = requests.filter(req => {
      if (typeof pattern === 'string') {
        return req.url?.includes(pattern);
      }
      return pattern.test(req.url || '');
    });

    if (matches.length === 0) {
      throw new Error(`No network requests found matching: ${pattern}`);
    }

    return matches[0];
  }

  /**
   * Assert element count
   */
  static assertElementCount(elements: any[], expectedCount: number, description: string) {
    if (elements.length !== expectedCount) {
      throw new Error(
        `Expected ${expectedCount} elements for "${description}", but found ${elements.length}`
      );
    }
  }
}

/**
 * Test data generators
 */
export class TestDataGenerator {
  /**
   * Generate random agent data
   */
  static randomAgent() {
    const id = Math.random().toString(36).substring(7);
    return {
      name: `test-agent-${id}`,
      title: `Test Agent ${id.toUpperCase()}`,
      module: 'TEST',
      version: '1.0.0',
      icon: '🧪',
      persona: {
        name: `TestAgent${id}`,
        role: 'Test Agent',
        expertise: ['Testing', 'Validation'],
        tone: 'Test tone'
      },
      menu: {
        options: [
          { id: 'test-action', label: 'Test Action', action: 'test' }
        ]
      }
    };
  }

  /**
   * Generate random chat message
   */
  static randomMessage(role: 'user' | 'assistant' = 'user') {
    const messages = {
      user: [
        'Hello, how are you?',
        'Can you help me with this task?',
        'What is the status of the project?',
        'Please create a new feature',
        'Run the tests'
      ],
      assistant: [
        'I\'m doing well, thank you!',
        'Of course, I\'d be happy to help.',
        'The project is progressing well.',
        'I\'ll create that feature for you.',
        'Running tests now...'
      ]
    };

    const pool = messages[role];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /**
   * Generate random workflow
   */
  static randomWorkflow() {
    const id = Math.random().toString(36).substring(7);
    return {
      workflowId: `test-workflow-${id}`,
      currentStep: 0,
      status: 'pending',
      data: {
        name: `Test Workflow ${id}`,
        steps: ['step1', 'step2', 'step3']
      }
    };
  }
}

/**
 * Export singleton instance
 */
export const chromeHelper = new ChromeTestHelper();
export const assert = TestAssertions;
export const generate = TestDataGenerator;
