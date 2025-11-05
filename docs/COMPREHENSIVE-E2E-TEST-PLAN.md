# MADACE v3.0 Comprehensive E2E Test Plan

**Generated**: 2025-11-05
**Version**: v3.0-beta
**Test Mode**: 🔥 YOLO MODE (No Simplification)
**Status**: Planning Phase

---

## 1. Executive Summary

This document outlines a comprehensive end-to-end testing strategy for MADACE v3.0-beta using Playwright and Chrome DevTools MCP server integration. All tests will be executed in "YOLO Mode" - meaning comprehensive, aggressive testing without simplification.

**Scope**: Full application testing from UI to database
**Tools**: Playwright, Chrome DevTools MCP, Jest, Prisma
**Coverage Target**: 100% of user-facing features
**Architecture Testing**: Top-down from UI → API → Business Logic → Database

---

## 2. Testing Strategy

### 2.1 Test Pyramid

```
               ┌─────────────┐
               │  E2E Tests  │  ← Playwright (This Plan)
               │  (UI Flow)  │
               └─────────────┘
              ┌───────────────┐
              │ Integration   │  ← API Routes + Database
              │    Tests      │
              └───────────────┘
           ┌──────────────────────┐
           │    Unit Tests        │  ← Business Logic
           │  (Existing Jest)     │
           └──────────────────────┘
```

### 2.2 YOLO Mode Testing Philosophy

**YOLO Mode** = **Y**ou **O**nly **L**ive **O**nce Testing
- Test EVERYTHING, not just happy paths
- Include edge cases, error cases, race conditions
- Test data validation, security, performance
- No mocking in E2E tests (use real database, real API calls)
- Test concurrent operations
- Test with large datasets
- Test error recovery and resilience

### 2.3 Test Layers

1. **UI Layer** (Playwright + Chrome DevTools)
   - User interactions (clicks, forms, navigation)
   - Visual rendering (snapshots, screenshots)
   - Accessibility (ARIA, keyboard navigation)
   - Responsive design (mobile, tablet, desktop)

2. **API Layer** (Playwright API context)
   - HTTP requests/responses
   - Error handling
   - Data validation
   - Authentication/authorization

3. **Database Layer** (Prisma Direct)
   - Data persistence
   - Transactions
   - Constraints
   - Migrations

4. **Real-time Layer** (WebSocket)
   - Chat streaming (SSE)
   - Collaboration (Yjs)
   - Presence awareness

---

## 3. Test Coverage Map

### 3.1 Agent Management (8 test suites)

**Routes**: `/agents`, `/agents/[id]`, `/agents/create`, `/agents/manage`

**Test Suites**:
1. **Agent List & Discovery**
   - Display all agents from database
   - Filter by module (MAM, MAB, CIS)
   - Search by name/title
   - Sort by various fields
   - Pagination (if implemented)
   - Empty state handling

2. **Agent Detail View**
   - Display full agent information
   - Show persona details
   - Display menu options
   - Show prompts and critical actions
   - Handle missing agent (404)

3. **Agent Creation (MAB Module)**
   - 5-step wizard navigation
   - Step 1: Basic info validation
   - Step 2: Persona configuration
   - Step 3: Menu builder
   - Step 4: Prompts editor
   - Step 5: Review and submit
   - Database persistence
   - Validation errors
   - Duplicate name prevention

4. **Agent Editing**
   - Load existing agent data
   - Update fields
   - Validate changes
   - Save to database
   - Optimistic UI updates

5. **Agent Duplication**
   - Clone existing agent
   - Append "(Copy)" to name
   - Preserve all fields
   - Create new database entry

6. **Agent Deletion**
   - Soft delete vs hard delete
   - Confirmation dialog
   - Database cleanup
   - Cascade delete (relationships)

7. **Agent Import/Export**
   - Export as JSON
   - Import from JSON
   - YAML import (from file system)
   - Validation during import

8. **Agent Search & Filtering**
   - Fuzzy search
   - Filter by multiple criteria
   - Real-time filtering
   - No results state

### 3.2 Chat Interface (7 test suites)

**Routes**: `/chat`, `/agents/[id]/memory`

**Test Suites**:
1. **Chat Session Management**
   - Create new session
   - List sessions
   - Delete session
   - Switch between sessions
   - Session persistence

2. **Message Flow**
   - Send user message
   - Receive AI response
   - Streaming responses (SSE)
   - Message rendering (Markdown, code blocks)
   - Message threading
   - Message editing
   - Message deletion

3. **Agent Selection**
   - Select agent from dropdown
   - Agent context loading
   - Agent persona display
   - Switch agents mid-conversation

4. **LLM Provider Selection**
   - Runtime provider switching
   - Gemini, Claude, OpenAI, Local (Ollama)
   - API key validation
   - Model selection
   - Streaming support per provider

5. **Memory Management**
   - Save conversation memory
   - Load memory in context
   - Memory pruning (30/90/∞ days)
   - Importance scoring
   - Memory search
   - Memory deletion

6. **Code Blocks & Syntax Highlighting**
   - Render code blocks
   - Syntax highlighting
   - Copy code button
   - Language detection
   - Inline code

7. **Error Handling & Recovery**
   - Network errors
   - API errors (rate limits, auth)
   - Streaming errors
   - Retry mechanisms
   - Error messages to user

### 3.3 Workflow Execution (5 test suites)

**Routes**: `/workflows`, `/status`

**Test Suites**:
1. **Workflow List**
   - Display all workflows
   - Show workflow status
   - Filter by status
   - Sort workflows

2. **Workflow Execution**
   - Execute workflow step
   - Progress tracking
   - Step dependencies
   - Sub-workflow execution
   - Error handling in steps

3. **State Machine Transitions**
   - BACKLOG → TODO
   - TODO → IN_PROGRESS
   - IN_PROGRESS → DONE
   - One-at-a-time enforcement (TODO)
   - One-at-a-time enforcement (IN_PROGRESS)
   - Invalid transition prevention

4. **Workflow State Persistence**
   - Save state to database
   - Load state from database
   - Sync with workflow-status.md
   - State recovery after error

5. **Workflow Templates**
   - Load workflow from YAML
   - Template rendering
   - Variable substitution
   - Conditional steps

### 3.4 Kanban/Status Board (4 test suites)

**Routes**: `/status`, `/kanban`

**Test Suites**:
1. **Board Display**
   - Four columns: BACKLOG, TODO, IN_PROGRESS, DONE
   - Display stories in correct columns
   - Story cards with metadata
   - Drag-and-drop zones

2. **Story Management**
   - Create new story
   - Edit story details
   - Move story between columns
   - Delete story
   - Story validation

3. **Drag-and-Drop**
   - Drag story to adjacent column
   - Enforce state machine rules
   - Visual feedback during drag
   - Drop validation
   - Undo functionality

4. **Real-time Sync**
   - Database updates
   - File system sync (workflow-status.md)
   - Multi-user collaboration
   - Conflict resolution

### 3.5 Setup Wizard (3 test suites)

**Routes**: `/setup`, `/cli-setup`

**Test Suites**:
1. **Web Setup Wizard**
   - Step 1: Project Info
   - Step 2: LLM Config
   - Step 3: Module Config
   - Step 4: Summary
   - Navigation (Next, Previous, Finish)
   - Validation at each step
   - Save configuration
   - Config file generation

2. **CLI Setup**
   - Initialize madace.config.yaml
   - Interactive prompts
   - Validation
   - Default values

3. **Configuration Loading**
   - Load existing config
   - Edit configuration
   - Apply changes
   - Environment variable override

### 3.6 IDE Features (6 test suites)

**Routes**: `/ide`

**Test Suites**:
1. **Monaco Editor**
   - Load file in editor
   - Syntax highlighting (20+ languages)
   - IntelliSense autocomplete
   - Multi-file tabs
   - Save file
   - Keyboard shortcuts

2. **File Explorer**
   - Display file tree
   - Navigate directories
   - Create file/folder
   - Rename file/folder
   - Delete file/folder
   - File permissions

3. **Integrated Terminal**
   - Open terminal
   - Execute commands (whitelist)
   - Command output display
   - Command history
   - Resizable panel

4. **Real-time Collaboration**
   - WebSocket connection
   - Yjs CRDT sync
   - Shared cursors
   - Presence awareness
   - Multi-user editing

5. **In-app Chat**
   - Send chat message
   - Receive messages
   - User presence
   - Message history

6. **IDE Settings**
   - Theme selection
   - Font size
   - Key bindings
   - Editor preferences

### 3.7 Memory Management (4 test suites)

**Routes**: `/agents/[id]/memory`

**Test Suites**:
1. **Memory Dashboard**
   - List all memory entries
   - Filter by agent
   - Filter by importance
   - Search memory content
   - Sort by date/importance

2. **Memory CRUD**
   - Create memory entry
   - Read memory details
   - Update memory
   - Delete memory

3. **Memory Pruning**
   - Automatic pruning (30 days)
   - Semi-automatic (90 days)
   - Permanent (never delete)
   - Importance decay
   - Access tracking

4. **Memory in Context**
   - Load relevant memories
   - Context window management
   - Memory ranking
   - Memory embedding (if implemented)

### 3.8 Settings & Configuration (3 test suites)

**Routes**: `/settings`, `/llm-test`

**Test Suites**:
1. **Application Settings**
   - Update settings
   - Save preferences
   - Reset to defaults
   - Environment variables

2. **LLM Configuration**
   - Configure providers
   - Test connections
   - Validate API keys
   - Model selection
   - Provider-specific settings

3. **Database Management**
   - View database stats
   - Run migrations
   - Backup/restore
   - Clear data (with confirmation)

### 3.9 API Integration (10 test suites)

**Routes**: All `/api/v3/*` endpoints

**Test Suites**:
1. **Agent API** (`/api/v3/agents`)
   - GET all agents
   - GET agent by ID
   - POST create agent
   - PUT update agent
   - DELETE agent
   - POST duplicate agent
   - POST export agent
   - POST import agent
   - GET search agents

2. **Chat API** (`/api/v3/chat`)
   - POST create session
   - GET list sessions
   - GET session by ID
   - POST send message
   - GET messages (paginated)
   - DELETE session
   - GET session memory
   - POST save memory
   - DELETE prune memory

3. **NLU API** (`/api/v3/nlu`)
   - POST parse query
   - GET NLU status
   - Entity extraction
   - Intent recognition

4. **Workflow API** (`/api/workflows`)
   - GET list workflows
   - GET workflow by ID
   - POST execute step
   - GET workflow state
   - DELETE reset state

5. **Status API** (`/api/status`)
   - GET status by type/ID
   - PATCH update status
   - State machine validation

6. **Error Handling**
   - 400 Bad Request
   - 401 Unauthorized
   - 404 Not Found
   - 500 Internal Server Error
   - Validation errors
   - Database errors

7. **Rate Limiting**
   - Request throttling
   - Burst handling
   - Rate limit headers
   - 429 Too Many Requests

8. **Authentication** (if implemented)
   - Login/logout
   - JWT tokens
   - Session management
   - Protected routes

9. **CORS & Security**
   - CORS headers
   - CSRF protection
   - XSS prevention
   - SQL injection prevention

10. **Performance**
    - Response times
    - Large payload handling
    - Concurrent requests
    - Database connection pooling

---

## 4. Test Data Strategy

### 4.1 Test Database

**Strategy**: Use SQLite test database, reset before each test suite

```typescript
// Setup
beforeAll(async () => {
  await prisma.$executeRaw`DELETE FROM Agent`;
  await prisma.$executeRaw`DELETE FROM ChatSession`;
  // ... reset all tables
});
```

### 4.2 Seed Data

**Agents**: 10 test agents (3 MAM, 3 MAB, 3 CIS, 1 custom)
**Chat Sessions**: 5 sessions with varying message counts
**Workflows**: 3 workflows in different states
**Stories**: 10 stories across all status columns
**Memory**: 20 memory entries with varying importance

### 4.3 Edge Case Data

- Empty strings
- Very long strings (10,000+ chars)
- Special characters (SQL injection attempts)
- Unicode/emoji
- Null values
- Invalid JSON
- Missing required fields

---

## 5. Chrome DevTools Integration

### 5.1 Available MCP Tools

From the Chrome DevTools MCP server:
- `take_snapshot` - A11y tree snapshot for element inspection
- `take_screenshot` - Visual regression testing
- `click` - Element interactions
- `fill` - Form inputs
- `navigate_page` - Page navigation
- `evaluate_script` - Execute JavaScript
- `list_network_requests` - Network monitoring
- `list_console_messages` - Console error detection
- `wait_for` - Wait for text/elements

### 5.2 Test Patterns

**Pattern 1: Snapshot-based Testing**
```typescript
// Take snapshot, find element by text, interact
const snapshot = await chromeDevTools.take_snapshot();
const button = findElementByText(snapshot, "Create Agent");
await chromeDevTools.click({ uid: button.uid });
```

**Pattern 2: Network Monitoring**
```typescript
// Monitor API calls
await chromeDevTools.navigate_page({ url: "/agents" });
const requests = await chromeDevTools.list_network_requests();
const agentRequests = requests.filter(r => r.url.includes('/api/v3/agents'));
expect(agentRequests).toHaveLength(1);
```

**Pattern 3: Console Error Detection**
```typescript
// Detect console errors
const messages = await chromeDevTools.list_console_messages({ types: ['error'] });
expect(messages).toHaveLength(0); // No errors expected
```

---

## 6. Test Execution Plan

### 6.1 Execution Order

1. **Setup**: Reset database, start dev server
2. **Smoke Tests**: Basic page loads, API health checks
3. **Agent Tests**: CRUD operations
4. **Chat Tests**: Messaging and streaming
5. **Workflow Tests**: Execution and state machine
6. **IDE Tests**: Editor and collaboration
7. **Integration Tests**: Cross-feature workflows
8. **Teardown**: Stop server, cleanup

### 6.2 Parallelization

- Run test suites in parallel (Playwright workers)
- Each worker gets isolated database
- Use different ports for parallel servers

### 6.3 Timeouts

- Page navigation: 30s
- API requests: 10s
- Streaming responses: 60s (LLM can be slow)
- WebSocket connection: 5s

---

## 7. Success Criteria

### 7.1 Test Pass Criteria

- ✅ All tests pass (100%)
- ✅ No console errors
- ✅ No network errors (except expected 404s)
- ✅ No accessibility violations
- ✅ Response times < 3s (API), < 5s (pages)
- ✅ No memory leaks
- ✅ No unhandled promise rejections

### 7.2 Coverage Targets

- **Code Coverage**: 80%+ (measured by Jest)
- **Feature Coverage**: 100% (all user-facing features)
- **API Coverage**: 100% (all endpoints tested)
- **UI Coverage**: 100% (all pages and components)

---

## 8. Failure Analysis Plan

When tests fail:

### 8.1 Root Cause Analysis

1. **Categorize Failure**
   - UI issue (rendering, interaction)
   - API issue (status code, data format)
   - Database issue (constraint, transaction)
   - Business logic issue (validation, calculation)
   - Configuration issue (environment, setup)

2. **Identify Layer**
   - Presentation Layer (React components)
   - API Layer (route handlers)
   - Service Layer (business logic)
   - Data Layer (Prisma, database)
   - Infrastructure Layer (Next.js, Node.js)

3. **Document Issue**
   - Error message
   - Stack trace
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/snapshots

### 8.2 Fix Strategy

1. **Architecture-level fixes** (if needed)
   - Database schema changes
   - API contract changes
   - Component structure refactoring

2. **Code-level fixes**
   - Bug fixes in business logic
   - UI component fixes
   - Error handling improvements
   - Validation additions

3. **Test fixes** (if test is incorrect)
   - Update expectations
   - Fix test data
   - Adjust timeouts

### 8.3 Regression Prevention

- Add test case for fixed bug
- Update documentation
- Code review
- Deploy to staging before production

---

## 9. Test Implementation Files

### 9.1 File Structure

```
e2e-tests/
├── comprehensive/
│   ├── agents/
│   │   ├── agent-list.spec.ts
│   │   ├── agent-detail.spec.ts
│   │   ├── agent-create.spec.ts
│   │   ├── agent-edit.spec.ts
│   │   ├── agent-duplicate.spec.ts
│   │   ├── agent-delete.spec.ts
│   │   ├── agent-import-export.spec.ts
│   │   └── agent-search.spec.ts
│   ├── chat/
│   │   ├── session-management.spec.ts
│   │   ├── message-flow.spec.ts
│   │   ├── agent-selection.spec.ts
│   │   ├── llm-provider.spec.ts
│   │   ├── memory-management.spec.ts
│   │   ├── code-blocks.spec.ts
│   │   └── error-recovery.spec.ts
│   ├── workflows/
│   │   ├── workflow-list.spec.ts
│   │   ├── workflow-execution.spec.ts
│   │   ├── state-machine.spec.ts
│   │   ├── state-persistence.spec.ts
│   │   └── workflow-templates.spec.ts
│   ├── kanban/
│   │   ├── board-display.spec.ts
│   │   ├── story-management.spec.ts
│   │   ├── drag-and-drop.spec.ts
│   │   └── real-time-sync.spec.ts
│   ├── setup/
│   │   ├── web-setup.spec.ts
│   │   ├── cli-setup.spec.ts
│   │   └── config-loading.spec.ts
│   ├── ide/
│   │   ├── monaco-editor.spec.ts
│   │   ├── file-explorer.spec.ts
│   │   ├── terminal.spec.ts
│   │   ├── collaboration.spec.ts
│   │   ├── chat.spec.ts
│   │   └── settings.spec.ts
│   ├── memory/
│   │   ├── memory-dashboard.spec.ts
│   │   ├── memory-crud.spec.ts
│   │   ├── memory-pruning.spec.ts
│   │   └── memory-context.spec.ts
│   ├── settings/
│   │   ├── app-settings.spec.ts
│   │   ├── llm-config.spec.ts
│   │   └── database-mgmt.spec.ts
│   └── api/
│       ├── agent-api.spec.ts
│       ├── chat-api.spec.ts
│       ├── nlu-api.spec.ts
│       ├── workflow-api.spec.ts
│       ├── status-api.spec.ts
│       ├── error-handling.spec.ts
│       ├── rate-limiting.spec.ts
│       ├── auth.spec.ts
│       ├── security.spec.ts
│       └── performance.spec.ts
├── fixtures/
│   ├── agents.json
│   ├── sessions.json
│   ├── workflows.json
│   └── stories.json
├── helpers/
│   ├── db-setup.ts
│   ├── chrome-devtools.ts
│   └── test-data.ts
└── playwright.config.comprehensive.ts
```

### 9.2 Shared Helpers

```typescript
// e2e-tests/helpers/db-setup.ts
export async function resetDatabase() {
  await prisma.agent.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.workflowState.deleteMany();
  // ... all tables
}

export async function seedTestData() {
  // Insert test agents, sessions, etc.
}

// e2e-tests/helpers/chrome-devtools.ts
export class ChromeDevToolsHelper {
  async findElementByText(text: string) {
    const snapshot = await chromeDevTools.take_snapshot();
    // Parse snapshot, find element
    return element;
  }

  async waitForNetworkIdle() {
    // Wait for no network activity
  }

  async assertNoConsoleErrors() {
    const errors = await chromeDevTools.list_console_messages({ types: ['error'] });
    expect(errors).toHaveLength(0);
  }
}
```

---

## 10. Reporting

### 10.1 Test Report Format

Generated after test run:
- **Summary**: Pass/fail counts, duration
- **Failed Tests**: Details for each failure
- **Root Causes**: Categorized by layer
- **Fixes Applied**: Code changes made
- **Screenshots**: Visual evidence of failures
- **Network Logs**: API call failures
- **Console Logs**: JavaScript errors

### 10.2 Metrics

- Test execution time
- Test flakiness (retries needed)
- Code coverage delta
- Performance regression (if any)

---

## 11. Implementation Timeline

**Phase 1: Test Infrastructure** (30 mins)
- Setup test database
- Configure Playwright
- Create helper functions

**Phase 2: Core Tests** (2 hours)
- Agent management tests
- Chat interface tests
- API integration tests

**Phase 3: Advanced Tests** (2 hours)
- Workflow tests
- IDE tests
- Real-time collaboration tests

**Phase 4: Execution & Fixes** (2-4 hours)
- Run all tests
- Analyze failures
- Fix root causes
- Re-run until green

**Total Estimated Time**: 6-8 hours

---

## 12. Risk Assessment

### 12.1 High-Risk Areas

1. **Real-time features**
   - WebSocket flakiness
   - Race conditions
   - Timing issues

2. **LLM Integration**
   - API rate limits
   - Slow responses
   - Provider outages

3. **Database**
   - Transaction conflicts
   - Migration issues
   - Connection pooling

4. **File System**
   - Permissions
   - Path resolution
   - Concurrent access

### 12.2 Mitigation

- Retry failed tests (max 3 times)
- Use generous timeouts for external services
- Mock LLM responses in critical tests
- Isolate test databases per worker

---

## Status

**Current Phase**: Planning Complete
**Next Step**: Implement test infrastructure
**YOLO Mode**: ACTIVE 🔥

---

**Document Version**: 1.0
**Last Updated**: 2025-11-05
**Author**: Claude Code (Anthropic)
