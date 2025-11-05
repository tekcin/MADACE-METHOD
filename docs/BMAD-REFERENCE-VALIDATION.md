# BMAD-METHOD Reference Validation

**Date**: 2025-11-05
**Purpose**: Ensure all BMAD-METHOD references are accurate and prevent invalid URLs
**Status**: ✅ All references validated and corrected

---

## Summary of Issues Fixed

### ❌ Invalid Reference (Removed)

The following URL **does not exist** and should never be referenced:

```
https://raw.githubusercontent.com/tekcin/BMAD-METHOD/main/bmad/bmm/workflows/plan-project.md
```

**Why it's invalid**:

- BMAD workflows are **YAML files**, not markdown
- Workflows are organized in **nested subdirectories by phase**
- Workflow files are named `workflow.yaml`, not `plan-project.md`

---

## ✅ Correct BMAD Structure (Verified 2025-11-05)

### Agent Files

```
bmad/bmm/agents/
  ├── pm.md               ✅ Markdown format
  ├── analyst.md          ✅ Markdown format
  ├── architect.md        ✅ Markdown format
  ├── developer.md        ✅ Markdown format
  └── sm.md               ✅ Markdown format
```

**Format**: Markdown (`.md`)
**Example URL**: `https://github.com/tekcin/BMAD-METHOD/tree/main/bmad/bmm/agents`

### Workflow Files

```
bmad/bmm/workflows/
  ├── 1-analysis/
  ├── 2-plan-workflows/
  │   ├── prd/
  │   │   ├── workflow.yaml          ✅ YAML format
  │   │   ├── instructions.md
  │   │   ├── prd-template.md
  │   │   └── ...
  │   ├── tech-spec/
  │   │   └── workflow.yaml          ✅ YAML format
  │   └── ...
  ├── 3-solutioning/
  ├── 4-implementation/
  └── workflow-status/
```

**Format**: YAML (`workflow.yaml`)
**Organization**: Nested by phase and workflow type
**Example URL**: `https://github.com/tekcin/BMAD-METHOD/tree/main/bmad/bmm/workflows/2-plan-workflows/prd`

### Workflow YAML Structure

```yaml
name: prd
description: 'Unified PRD workflow for project levels 2-4'
author: BMad
config_source: '{project-root}/bmad/bmm/config.yaml'
project_name: '{config_source}:project_name'
output_folder: '{config_source}:output_folder'
# ... (variable interpolation with {var} syntax)
```

**Variable Syntax**: `{variable_name}` (curly braces, not Handlebars)

---

## Valid Reference Patterns

### ✅ DO Use These Patterns

1. **GitHub tree URLs** (directory views):

   ```
   https://github.com/tekcin/BMAD-METHOD/tree/main/bmad/bmm/agents
   https://github.com/tekcin/BMAD-METHOD/tree/main/bmad/bmm/workflows/2-plan-workflows
   ```

2. **GitHub raw URLs for actual files**:

   ```
   https://raw.githubusercontent.com/tekcin/BMAD-METHOD/main/bmad/bmm/agents/pm.md
   https://raw.githubusercontent.com/tekcin/BMAD-METHOD/main/bmad/bmm/workflows/2-plan-workflows/prd/workflow.yaml
   https://raw.githubusercontent.com/tekcin/BMAD-METHOD/main/bmad/core/config.yaml
   ```

3. **Local file paths** (for MADACE code):
   ```
   bmad/bmm/agents/pm.md
   bmad/bmm/workflows/2-plan-workflows/prd/workflow.yaml
   ```

### ❌ DO NOT Use These Patterns

1. **Non-existent markdown workflow files**:

   ```
   ❌ bmad/bmm/workflows/plan-project.md
   ❌ bmad/bmm/workflows/create-prd.md
   ❌ bmad/bmm/workflows/assess-scale.md
   ```

2. **Flat workflow file structure** (workflows are nested):

   ```
   ❌ bmad/bmm/workflows/plan-project.workflow.yaml
   ```

3. **Generic raw URLs without knowing structure**:
   ```
   ❌ https://raw.githubusercontent.com/tekcin/BMAD-METHOD/main/bmad/bmm/workflows/*.md
   ```

---

## Key Differences: BMAD vs MADACE

| Aspect                 | BMAD-METHOD                        | MADACE Method v3.0                 |
| ---------------------- | ---------------------------------- | ---------------------------------- |
| **Agent Format**       | Markdown (`.md`)                   | YAML (`.agent.yaml`)               |
| **Workflow Format**    | YAML (`workflow.yaml`)             | YAML (`.workflow.yaml`)            |
| **Agent Directory**    | `bmad/bmm/agents/` (flat)          | `madace/mam/agents/` (flat)        |
| **Workflow Directory** | `bmad/bmm/workflows/` (**nested**) | `madace/mam/workflows/` (**flat**) |
| **Variable Syntax**    | `{variable}`                       | `{{variable}}` (Handlebars)        |
| **Module Names**       | BMM, BMB                           | MAM, MAB                           |

---

## Files Updated (2025-11-05)

### 1. `/docs/BMAD-MADACE-COMPARISON.md`

**Changes**:

- ✅ Added warning section at top about BMAD structure
- ✅ Updated workflow format compatibility status: Unknown → Compatible
- ✅ Clarified BMAD uses YAML for workflows (not markdown)
- ✅ Added examples of actual BMAD workflow paths
- ✅ Updated conclusion to reflect workflow compatibility

**Lines Modified**: Lines 10-30 (warning section), Lines 28-29 (table), Lines 118-127 (examples), Lines 337-370 (workflow section), Lines 655-660 (conclusion)

### 2. `/ARCHITECTURE.md`

**Status**: ✅ No invalid references found

**BMAD Mentions**:

- Line 2664: "BMAD v6 agents" (general mention, no specific URLs)
- Line 2668: "BMAD v6 format" (format support mention)

**Action**: None required - references are general and correct

### 3. `/PRD.md`

**Status**: ✅ No BMAD references found

**Action**: None required

### 4. `/PLAN.md`

**Status**: ✅ No BMAD references found

**Action**: None required

---

## Validation Checklist

Before adding any BMAD reference to documentation:

- [ ] Have you verified the file exists in the BMAD repository?
- [ ] Are you using the correct file extension (`.md` for agents, `.yaml` for workflows)?
- [ ] For workflows, are you using the nested directory structure?
- [ ] Are you using a GitHub tree URL (for directories) or raw URL (for files)?
- [ ] Have you tested the URL in a browser to ensure it loads?

---

## Quick Reference: BMAD File Locations

### Agents (Markdown)

```bash
# List all agents
https://github.com/tekcin/BMAD-METHOD/tree/main/bmad/bmm/agents

# Individual agent (example)
https://raw.githubusercontent.com/tekcin/BMAD-METHOD/main/bmad/bmm/agents/pm.md
```

### Workflows (YAML)

```bash
# List all workflows
https://github.com/tekcin/BMAD-METHOD/tree/main/bmad/bmm/workflows

# PRD workflow (example)
https://github.com/tekcin/BMAD-METHOD/tree/main/bmad/bmm/workflows/2-plan-workflows/prd
https://raw.githubusercontent.com/tekcin/BMAD-METHOD/main/bmad/bmm/workflows/2-plan-workflows/prd/workflow.yaml

# Tech spec workflow (example)
https://github.com/tekcin/BMAD-METHOD/tree/main/bmad/bmm/workflows/2-plan-workflows/tech-spec
```

### Configuration

```bash
# Core config
https://raw.githubusercontent.com/tekcin/BMAD-METHOD/main/bmad/core/config.yaml

# BMM config
https://raw.githubusercontent.com/tekcin/BMAD-METHOD/main/bmad/bmm/config.yaml
```

---

## Future-Proofing

### When BMAD Structure Changes

If BMAD-METHOD changes its structure in future versions:

1. **Update this document** with new structure
2. **Update BMAD-MADACE-COMPARISON.md** with compatibility notes
3. **Test all existing references** in documentation
4. **Update converter scripts** if file formats change

### When Adding New BMAD References

1. **Verify the file exists** first (don't assume)
2. **Use GitHub tree URLs** for exploration
3. **Use raw URLs only** for files you've confirmed exist
4. **Document the reference** in this file
5. **Test the URL** before committing

---

## Contact

For questions about BMAD structure:

- BMAD-METHOD Repository: https://github.com/tekcin/BMAD-METHOD
- Issues: https://github.com/tekcin/BMAD-METHOD/issues

For questions about MADACE compatibility:

- MADACE Repository: https://github.com/tekcin/MADACE-Method-v2.0
- Compatibility Doc: `/docs/BMAD-MADACE-COMPARISON.md`

---

**Last Validated**: 2025-11-05
**Validator**: MADACE Core Team
**Status**: ✅ All references validated
