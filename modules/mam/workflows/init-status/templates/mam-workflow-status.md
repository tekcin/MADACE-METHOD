# MAM Workflow Status

**Project:** {{project_name}} **Last Updated:** {{date}} **Current Phase:**
{{current_phase}}

---

## Project Overview

- **Scale Level:** {{scale_level}}
- **Project Type:** {{project_type}}
- **Total Epics:** {{total_epics}}
- **Total Stories:** {{total_stories}}

---

## Epic Progress

{{#each epics}}

### Epic {{epic_number}}: {{epic_name}}

**Status:** {{epic_status}} **Progress:**
{{completed_stories}}/{{total_epic_stories}} stories completed
({{progress_percentage}}%)

{{/each}}

---

## Story State Machine

### BACKLOG ({{backlog_count}} stories)

{{#each backlog_stories}}

- [ ] {{story_id}}: {{story_title}} (Epic {{epic_number}}, {{story_points}}pts)
      {{/each}}

### TODO ({{todo_count}} story)

⚠️ **Rule:** Only ONE story in TODO at a time

{{#each todo_stories}}

- [ ] **{{story_id}}**: {{story_title}} (Epic {{epic_number}},
      {{story_points}}pts)
  - Selected on: {{selected_date}}
  - Status: Ready to start {{/each}}

### IN PROGRESS ({{in_progress_count}} story)

⚠️ **Rule:** Only ONE story in IN PROGRESS at a time

{{#each in_progress_stories}}

- [ ] **{{story_id}}**: {{story_title}} (Epic {{epic_number}},
      {{story_points}}pts)
  - Started on: {{started_date}}
  - Assigned to: {{assignee}}
  - Status: {{detailed_status}}
  - Blockers: {{blockers}} {{/each}}

### DONE ({{done_count}} stories)

{{#each done_stories}}

- [x] {{story_id}}: {{story_title}} (Epic {{epic_number}},
      {{story_points}}pts) - Completed {{completed_date}} {{/each}}

---

## Current Sprint

**Sprint:** {{current_sprint}} **Sprint Goal:** {{sprint_goal}} **Sprint
Duration:** {{sprint_start}} to {{sprint_end}}

---

## Velocity Tracking

- **Average Velocity:** {{average_velocity}} pts/week
- **This Sprint:** {{sprint_velocity}} pts
- **Projected Completion:** {{projected_completion}}

---

## Blockers and Risks

{{blockers_and_risks}}

---

## Next Steps

{{next_steps}}

---

_Generated and maintained by MADACE-METHOD Workflow Status System_ _Last
automated update: {{last_update}}_
