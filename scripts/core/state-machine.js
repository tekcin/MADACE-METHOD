/**
 * Story State Machine - Core Engine
 * Manages story lifecycle: BACKLOG → TODO → IN PROGRESS → DONE
 *
 * Critical Rules:
 * - Only ONE story in TODO at a time
 * - Only ONE story in IN PROGRESS at a time
 * - Single source of truth: mam-workflow-status.md
 * - No searching - always read from status file
 * - Atomic state transitions
 */

import fs from 'fs-extra';

/**
 * Story states
 */
export const STATES = {
  BACKLOG: 'BACKLOG',
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
};

/**
 * Story status values (in story files)
 */
export const STATUS = {
  DRAFT: 'Draft',
  READY: 'Ready',
  IN_REVIEW: 'In Review',
  DONE: 'Done',
};

/**
 * State Machine Manager
 */
class StateMachine {
  constructor(statusFilePath) {
    this.statusFilePath = statusFilePath;
    this.state = null;
  }

  /**
   * Load current state from status file
   */
  async load() {
    try {
      const content = await fs.readFile(this.statusFilePath, 'utf8');
      this.state = this.parseStatusFile(content);
      return this.state;
    } catch (error) {
      throw new Error(`Failed to load state from ${this.statusFilePath}: ${error.message}`);
    }
  }

  /**
   * Parse status file into structured state
   */
  parseStatusFile(content) {
    const lines = content.split('\n');
    const state = {
      backlog: [],
      todo: null,
      inProgress: null,
      done: [],
      currentPhase: null,
    };

    let currentSection = null;

    for (const line of lines) {
      // Detect current phase
      if (line.includes('**Current Phase:**')) {
        const match = line.match(/Phase (\d+)/);
        if (match) {
          state.currentPhase = parseInt(match[1], 10);
        }
      }

      // Detect sections
      if (line.startsWith('## BACKLOG')) {
        currentSection = 'backlog';
        continue;
      } else if (line.startsWith('## TODO')) {
        currentSection = 'todo';
        continue;
      } else if (line.startsWith('## IN PROGRESS')) {
        currentSection = 'inProgress';
        continue;
      } else if (line.startsWith('## DONE')) {
        currentSection = 'done';
        continue;
      }

      // Parse story entries
      if (currentSection && line.trim().startsWith('-')) {
        const story = this.parseStoryLine(line);
        if (story) {
          if (currentSection === 'backlog') {
            state.backlog.push(story);
          } else if (currentSection === 'todo') {
            state.todo = story;
          } else if (currentSection === 'inProgress') {
            state.inProgress = story;
          } else if (currentSection === 'done') {
            state.done.push(story);
          }
        }
      }
    }

    return state;
  }

  /**
   * Parse a single story line
   * Format: - [ID] Title (filename.md) [Status: Draft/Ready/Done] [Points: N] [Date: YYYY-MM-DD]
   */
  parseStoryLine(line) {
    const story = {
      id: null,
      title: null,
      filename: null,
      status: null,
      points: null,
      date: null,
    };

    // Extract ID
    const idMatch = line.match(/\[([A-Z0-9-]+)\]/);
    if (idMatch) {
      story.id = idMatch[1];
    }

    // Extract filename
    const filenameMatch = line.match(/\(([^)]+\.md)\)/);
    if (filenameMatch) {
      story.filename = filenameMatch[1];
    }

    // Extract title (between ] and ()
    const titleMatch = line.match(/\]\s+([^(]+?)\s+\(/);
    if (titleMatch) {
      story.title = titleMatch[1].trim();
    }

    // Extract status
    const statusMatch = line.match(/Status:\s*([^\]]+)\]/);
    if (statusMatch) {
      story.status = statusMatch[1].trim();
    }

    // Extract points
    const pointsMatch = line.match(/Points:\s*(\d+)/);
    if (pointsMatch) {
      story.points = parseInt(pointsMatch[1], 10);
    }

    // Extract date
    const dateMatch = line.match(/Date:\s*(\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      story.date = dateMatch[1];
    }

    return story.id ? story : null;
  }

  /**
   * Save current state to status file
   */
  async save() {
    try {
      const content = this.generateStatusFile(this.state);
      await fs.writeFile(this.statusFilePath, content, 'utf8');
    } catch (error) {
      throw new Error(`Failed to save state to ${this.statusFilePath}: ${error.message}`);
    }
  }

  /**
   * Generate status file content from state
   */
  generateStatusFile(state) {
    const lines = [];

    lines.push('# MAM Workflow Status');
    lines.push('');
    lines.push(`**Current Phase:** Phase ${state.currentPhase || 4}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // BACKLOG section
    lines.push('## BACKLOG');
    lines.push('');
    lines.push('Stories to be drafted (ordered by priority):');
    lines.push('');
    if (state.backlog.length > 0) {
      state.backlog.forEach((story) => {
        lines.push(this.formatStoryLine(story));
      });
    } else {
      lines.push('_No stories in backlog_');
    }
    lines.push('');

    // TODO section
    lines.push('## TODO');
    lines.push('');
    lines.push('Story ready for drafting (only ONE at a time):');
    lines.push('');
    if (state.todo) {
      lines.push(this.formatStoryLine(state.todo));
    } else {
      lines.push('_No story in TODO_');
    }
    lines.push('');

    // IN PROGRESS section
    lines.push('## IN PROGRESS');
    lines.push('');
    lines.push('Story being implemented (only ONE at a time):');
    lines.push('');
    if (state.inProgress) {
      lines.push(this.formatStoryLine(state.inProgress));
    } else {
      lines.push('_No story in progress_');
    }
    lines.push('');

    // DONE section
    lines.push('## DONE');
    lines.push('');
    lines.push('Completed stories:');
    lines.push('');
    if (state.done.length > 0) {
      state.done.forEach((story) => {
        lines.push(this.formatStoryLine(story));
      });
    } else {
      lines.push('_No completed stories_');
    }
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Format a story as a status file line
   */
  formatStoryLine(story) {
    let line = `- [${story.id}] ${story.title} (${story.filename})`;

    if (story.status) {
      line += ` [Status: ${story.status}]`;
    }

    if (story.points) {
      line += ` [Points: ${story.points}]`;
    }

    if (story.date) {
      line += ` [Date: ${story.date}]`;
    }

    return line;
  }

  /**
   * Validate state machine rules
   */
  validate() {
    const errors = [];
    const warnings = [];

    // Rule: Only ONE story in TODO
    if (this.state.todo && Array.isArray(this.state.todo)) {
      errors.push('TODO section contains multiple stories - only ONE allowed');
    }

    // Rule: Only ONE story in IN PROGRESS
    if (this.state.inProgress && Array.isArray(this.state.inProgress)) {
      errors.push('IN PROGRESS section contains multiple stories - only ONE allowed');
    }

    // Warning: Empty TODO while backlog has stories
    if (!this.state.todo && this.state.backlog.length > 0) {
      warnings.push('TODO is empty but BACKLOG has stories - consider moving next story to TODO');
    }

    // Warning: Empty IN PROGRESS while TODO has story
    if (!this.state.inProgress && this.state.todo) {
      warnings.push('IN PROGRESS is empty but TODO has a story - consider reviewing and approving TODO story');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Transition: Move story from BACKLOG to TODO
   */
  async backlogToTodo() {
    if (this.state.todo) {
      throw new Error('Cannot move to TODO: TODO already contains a story');
    }

    if (this.state.backlog.length === 0) {
      throw new Error('Cannot move to TODO: BACKLOG is empty');
    }

    // Move first story from backlog to TODO
    this.state.todo = this.state.backlog.shift();
    this.state.todo.status = STATUS.DRAFT;

    await this.save();
    return this.state.todo;
  }

  /**
   * Transition: Move story from TODO to IN PROGRESS
   */
  async todoToInProgress() {
    if (this.state.inProgress) {
      throw new Error('Cannot move to IN PROGRESS: IN PROGRESS already contains a story');
    }

    if (!this.state.todo) {
      throw new Error('Cannot move to IN PROGRESS: TODO is empty');
    }

    // Move story from TODO to IN PROGRESS
    this.state.inProgress = this.state.todo;
    this.state.inProgress.status = STATUS.READY;
    this.state.todo = null;

    // Move next story from BACKLOG to TODO
    if (this.state.backlog.length > 0) {
      this.state.todo = this.state.backlog.shift();
      this.state.todo.status = STATUS.DRAFT;
    }

    await this.save();
    return this.state.inProgress;
  }

  /**
   * Transition: Move story from IN PROGRESS to DONE
   */
  async inProgressToDone() {
    if (!this.state.inProgress) {
      throw new Error('Cannot move to DONE: IN PROGRESS is empty');
    }

    // Move story to DONE
    const story = this.state.inProgress;
    story.status = STATUS.DONE;
    story.date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    this.state.done.push(story);
    this.state.inProgress = null;

    await this.save();
    return story;
  }

  /**
   * Initialize status file from epics
   */
  async initializeFromEpics(epicsFilePath) {
    try {
      // Read epics file
      const epicsContent = await fs.readFile(epicsFilePath, 'utf8');
      const stories = this.extractStoriesFromEpics(epicsContent);

      // Initialize state
      this.state = {
        backlog: stories.slice(1), // All but first
        todo: stories[0] || null, // First story
        inProgress: null,
        done: [],
        currentPhase: 4, // Implementation phase
      };

      // Set initial status
      if (this.state.todo) {
        this.state.todo.status = STATUS.DRAFT;
      }

      await this.save();
      return this.state;
    } catch (error) {
      throw new Error(`Failed to initialize from epics: ${error.message}`);
    }
  }

  /**
   * Extract stories from Epics.md file
   */
  extractStoriesFromEpics(content) {
    const stories = [];
    const lines = content.split('\n');
    let currentEpic = null;

    for (const line of lines) {
      // Detect epic header
      if (line.startsWith('### Epic ')) {
        const match = line.match(/Epic (\d+):\s*(.+)/);
        if (match) {
          currentEpic = {
            id: parseInt(match[1], 10),
            title: match[2].trim(),
          };
        }
      }

      // Detect story line
      if (currentEpic && line.match(/^\d+\.\s+\*\*Story/)) {
        const story = this.parseEpicStoryLine(line, currentEpic);
        if (story) {
          stories.push(story);
        }
      }
    }

    return stories;
  }

  /**
   * Parse story line from Epics.md
   * Format: 1. **Story F31**: Title (N points)
   */
  parseEpicStoryLine(line) {
    const match = line.match(/\*\*Story ([A-Z0-9]+)\*\*:\s*(.+?)\s*\((\d+)\s+points?\)/);
    if (!match) {
      return null;
    }

    const storyId = match[1];
    const title = match[2].trim();
    const points = parseInt(match[3], 10);

    return {
      id: storyId,
      title,
      filename: `story-${storyId.toLowerCase()}.md`,
      status: null,
      points,
      date: null,
    };
  }

  /**
   * Get current story in TODO
   */
  getTodoStory() {
    return this.state?.todo || null;
  }

  /**
   * Get current story in IN PROGRESS
   */
  getInProgressStory() {
    return this.state?.inProgress || null;
  }

  /**
   * Get backlog stories
   */
  getBacklog() {
    return this.state?.backlog || [];
  }

  /**
   * Get done stories
   */
  getDone() {
    return this.state?.done || [];
  }

  /**
   * Get current phase
   */
  getCurrentPhase() {
    return this.state?.currentPhase || 4;
  }
}

export default StateMachine;
