/**
 * Database Setup Helper for Comprehensive E2E Tests
 * Handles database reset and seeding for test isolation
 * FIXED VERSION - Matches actual Prisma schema
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Reset database - delete all data from all tables
 * WARNING: This deletes ALL data!
 */
export async function resetDatabase() {
  console.log('🗑️  Resetting database...');

  // Delete in correct order to respect foreign key constraints
  await prisma.agentMemory.deleteMany();
  await prisma.chatMessage.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.lLMUsage.deleteMany();
  await prisma.stateMachine.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.config.deleteMany();

  console.log('✅ Database reset complete');
}

/**
 * Seed test data - insert realistic test data
 */
export async function seedTestData() {
  console.log('🌱 Seeding test data...');

  // Seed users first (required for chat sessions)
  const users = await seedUsers();
  console.log(`   ✅ Created ${users.length} test users`);

  // Seed projects (required for workflows)
  const projects = await seedProjects();
  console.log(`   ✅ Created ${projects.length} test projects`);

  // Seed agents
  const agents = await seedAgents(projects[0].id);
  console.log(`   ✅ Created ${agents.length} test agents`);

  // Seed chat sessions
  const sessions = await seedChatSessions(agents[0].id, users[0].id, projects[0].id);
  console.log(`   ✅ Created ${sessions.length} test chat sessions`);

  // Seed workflows
  const workflows = await seedWorkflows(projects[0].id);
  console.log(`   ✅ Created ${workflows.length} test workflows`);

  console.log('✅ Test data seeding complete');

  return { agents, sessions, workflows, users, projects };
}

/**
 * Seed test users
 */
async function seedUsers() {
  const users = [
    {
      email: 'test@madace.test',
      name: 'Test User'
    },
    {
      email: 'admin@madace.test',
      name: 'Admin User'
    }
  ];

  const createdUsers = [];
  for (const user of users) {
    const created = await prisma.user.create({ data: user });
    createdUsers.push(created);
  }

  return createdUsers;
}

/**
 * Seed test projects
 */
async function seedProjects() {
  const projects = [
    {
      name: 'Test Project',
      description: 'Project for E2E testing'
    }
  ];

  const createdProjects = [];
  for (const project of projects) {
    const created = await prisma.project.create({ data: project });
    createdProjects.push(created);
  }

  return createdProjects;
}

/**
 * Seed test agents
 */
async function seedAgents(projectId: string) {
  const agents = [
    // MAM Agents
    {
      name: 'pm',
      title: 'Product Manager',
      module: 'MAM',
      version: '1.0.0',
      icon: '📋',
      projectId,
      persona: {
        name: 'PM',
        role: 'Product Manager',
        expertise: ['Product Strategy', 'Requirements', 'Stakeholder Management'],
        tone: 'Professional and strategic'
      },
      menu: {
        options: [
          { id: 'create-prd', label: 'Create PRD', action: 'create-prd' },
          { id: 'analyze-market', label: 'Analyze Market', action: 'analyze-market' }
        ]
      },
      prompts: {
        greeting: "Hello! I'm your Product Manager. How can I help with your product?",
        farewell: "Great session! Let's build something amazing."
      }
    },
    {
      name: 'sm',
      title: 'Scrum Master',
      module: 'MAM',
      version: '1.0.0',
      icon: '🎯',
      projectId,
      persona: {
        name: 'SM',
        role: 'Scrum Master',
        expertise: ['Agile Methodology', 'Sprint Planning', 'Team Coordination'],
        tone: 'Facilitative and encouraging'
      },
      menu: {
        options: [
          { id: 'plan-sprint', label: 'Plan Sprint', action: 'plan-sprint' },
          { id: 'daily-standup', label: 'Daily Standup', action: 'daily-standup' }
        ]
      },
      prompts: {}
    },
    {
      name: 'dev',
      title: 'Developer',
      module: 'MAM',
      version: '1.0.0',
      icon: '💻',
      projectId,
      persona: {
        name: 'Dev',
        role: 'Software Developer',
        expertise: ['Coding', 'Architecture', 'Testing'],
        tone: 'Technical and precise'
      },
      menu: {
        options: [
          { id: 'write-code', label: 'Write Code', action: 'write-code' },
          { id: 'review-pr', label: 'Review PR', action: 'review-pr' }
        ]
      },
      prompts: {}
    },

    // MAB Agents
    {
      name: 'analyst',
      title: 'Business Analyst',
      module: 'MAB',
      version: '1.0.0',
      icon: '📊',
      projectId,
      persona: {
        name: 'Analyst',
        role: 'Business Analyst',
        expertise: ['Requirements Analysis', 'Process Modeling', 'Documentation'],
        tone: 'Analytical and thorough'
      },
      menu: {
        options: [
          { id: 'gather-requirements', label: 'Gather Requirements', action: 'gather-requirements' }
        ]
      },
      prompts: {}
    },

    // CIS Agents
    {
      name: 'tester',
      title: 'QA Engineer',
      module: 'CIS',
      version: '1.0.0',
      icon: '🧪',
      projectId,
      persona: {
        name: 'Tester',
        role: 'QA Engineer',
        expertise: ['Testing', 'Quality Assurance', 'Bug Tracking'],
        tone: 'Detail-oriented and methodical'
      },
      menu: {
        options: [
          { id: 'write-tests', label: 'Write Tests', action: 'write-tests' },
          { id: 'run-tests', label: 'Run Tests', action: 'run-tests' }
        ]
      },
      prompts: {}
    },

    // Custom Agent for testing
    {
      name: 'custom-agent',
      title: 'Custom Test Agent',
      module: 'CUSTOM',
      version: '1.0.0',
      icon: '🎨',
      projectId,
      persona: {
        name: 'Custom',
        role: 'Test Agent',
        expertise: ['Testing', 'Validation'],
        tone: 'Helpful and friendly'
      },
      menu: {
        options: [
          { id: 'custom-action', label: 'Custom Action', action: 'custom-action' }
        ]
      },
      prompts: {}
    }
  ];

  const createdAgents = [];
  for (const agent of agents) {
    const created = await prisma.agent.create({ data: agent });
    createdAgents.push(created);
  }

  return createdAgents;
}

/**
 * Seed test chat sessions
 * ChatSession schema: userId, agentId, startedAt, endedAt?, projectId?
 */
async function seedChatSessions(agentId: string, userId: string, projectId: string) {
  const sessions = [
    {
      userId,
      agentId,
      projectId
    },
    {
      userId,
      agentId,
      projectId
    },
    {
      userId,
      agentId,
      projectId,
      endedAt: new Date() // Archived/ended session
    }
  ];

  const createdSessions = [];
  for (const session of sessions) {
    const created = await prisma.chatSession.create({
      data: session
    });

    // Add some messages (ChatMessage schema: sessionId, role, content, timestamp)
    await prisma.chatMessage.create({
      data: {
        sessionId: created.id,
        role: 'user',
        content: 'Hello, this is a test message'
      }
    });

    await prisma.chatMessage.create({
      data: {
        sessionId: created.id,
        role: 'agent',
        content: 'This is a test response from the assistant'
      }
    });

    createdSessions.push(created);
  }

  return createdSessions;
}

/**
 * Seed test workflows
 * Workflow schema: name, description, steps (Json), state? (Json), projectId
 */
async function seedWorkflows(projectId: string) {
  const workflows = [
    {
      name: 'Test Workflow 1',
      description: 'First test workflow',
      projectId,
      steps: [
        { id: 'step1', name: 'Step 1', action: 'action1' },
        { id: 'step2', name: 'Step 2', action: 'action2' },
        { id: 'step3', name: 'Step 3', action: 'action3' }
      ],
      state: {
        currentStep: 0,
        status: 'pending'
      }
    },
    {
      name: 'Test Workflow 2',
      description: 'Second test workflow',
      projectId,
      steps: [
        { id: 'step1', name: 'Step 1', action: 'action1' },
        { id: 'step2', name: 'Step 2', action: 'action2' }
      ],
      state: {
        currentStep: 1,
        status: 'in-progress'
      }
    }
  ];

  const createdWorkflows = [];
  for (const workflow of workflows) {
    const created = await prisma.workflow.create({ data: workflow });
    createdWorkflows.push(created);
  }

  return createdWorkflows;
}

/**
 * Get test agent by name
 */
export async function getTestAgent(name: string) {
  return await prisma.agent.findUnique({ where: { name } });
}

/**
 * Clean up - disconnect from database
 */
export async function cleanup() {
  await prisma.$disconnect();
}

/**
 * Full setup - reset and seed
 */
export async function fullTestSetup() {
  await resetDatabase();
  const data = await seedTestData();
  return data;
}
