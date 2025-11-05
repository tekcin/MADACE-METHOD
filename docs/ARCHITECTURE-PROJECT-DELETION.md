# Project Deletion Architecture

## Overview

Complete architecture for safe project deletion with cascade handling, permission checks, and user confirmation.

## Current Status

### ✅ Backend (Already Implemented)

1. **API Endpoint**: `DELETE /api/v3/projects/[id]`
   - Location: `app/api/v3/projects/[id]/route.ts`
   - Permission: Owner only
   - Returns: 200 (success) or 403/500 (error)

2. **Service Layer**: `deleteProject(projectId, userId)`
   - Location: `lib/services/project-service.ts`
   - Validates owner permission
   - Handles cascade deletion via Prisma

3. **Database Schema**: Cascade behavior
   ```
   Project deletion cascades to:
   ✅ Workflows (onDelete: Cascade)
   ✅ StateMachine (stories) (onDelete: Cascade)
   ✅ ProjectMember (onDelete: Cascade)
   ⚠️ Config (onDelete: SetNull) - Configs kept, projectId nullified
   ⚠️ ChatSession (onDelete: SetNull) - Sessions kept, projectId nullified
   ⚠️ Agent - No cascade (need to verify Prisma default)
   ```

### 📋 Frontend (To Be Implemented)

Need to add UI components for project deletion.

---

## Architecture Design

### 1. UI Components

#### A. DeleteProjectButton Component
**Location**: `components/features/projects/DeleteProjectButton.tsx`

**Props**:
```typescript
interface DeleteProjectButtonProps {
  project: ProjectWithMembers;
  onDeleteSuccess?: () => void;
  variant?: 'icon' | 'button' | 'menu-item';
}
```

**Features**:
- Shows delete button (icon/button/menu-item variants)
- Opens confirmation modal on click
- Disabled if user is not owner

#### B. DeleteProjectModal Component
**Location**: `components/features/projects/DeleteProjectModal.tsx`

**Props**:
```typescript
interface DeleteProjectModalProps {
  project: ProjectWithMembers;
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess?: () => void;
}
```

**Features**:
- **Warning Section**: Shows what will be deleted
  - Project name and description
  - Count of agents, workflows, stories
  - Count of chat sessions (will be orphaned)
  - Count of configs (will be orphaned)
- **Confirmation Input**: Type project name to confirm
- **Delete Button**: Disabled until name typed correctly
- **Loading State**: Shows during deletion
- **Error Handling**: Displays error messages

#### C. ProjectSettings Page
**Location**: `app/projects/[id]/settings/page.tsx`

**Features**:
- Project info (name, description)
- Members list
- Danger zone section with delete button

---

### 2. User Flows

#### Flow 1: Delete from Project Selector Dropdown
```
1. User hovers over project in ProjectSelector dropdown
2. Three-dot menu icon appears
3. Click menu → "Delete Project" option
4. DeleteProjectModal opens
5. User confirms deletion
6. Project deleted, user redirected to another project
```

#### Flow 2: Delete from Project Settings Page
```
1. User navigates to /projects/[id]/settings
2. Scrolls to "Danger Zone" section
3. Clicks "Delete Project" button
4. DeleteProjectModal opens
5. User confirms deletion
6. Project deleted, user redirected to projects list
```

---

### 3. Cascade Deletion Details

When a project is deleted, the following happens:

#### ✅ Deleted (Cascade)
- **Workflows**: All workflows and their execution states
- **StateMachine**: All stories (BACKLOG/TODO/IN_PROGRESS/DONE)
- **ProjectMember**: All member relationships

#### ⚠️ Orphaned (SetNull)
- **ChatSession**: Sessions remain but `projectId` becomes null
- **Config**: Configs remain but `projectId` becomes null

#### ❓ Undefined Behavior
- **Agent**: Need to verify Prisma default behavior
  - If `onDelete: Cascade` → Agents deleted
  - If `onDelete: Restrict` → Deletion blocked if agents exist
  - If `onDelete: SetNull` → Agents kept, `projectId` nullified

**Recommendation**: Update Prisma schema to `onDelete: SetNull` for agents to preserve custom agents.

---

### 4. Permission System

```typescript
// Only owners can delete projects
const canDelete = userRole === 'owner';

// Check in deleteProject service:
const member = await prisma.projectMember.findFirst({
  where: {
    projectId,
    userId,
    role: 'owner',
  },
});

if (!member) {
  throw new Error('Permission denied: Only owners can delete projects');
}
```

---

### 5. API Flow

```typescript
// Client-side
const deleteProject = async (projectId: string) => {
  const response = await fetch(`/api/v3/projects/${projectId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete project');
  }

  return response.json();
};

// Server-side (already implemented)
export async function DELETE(request, { params }) {
  const { id } = await params;
  const userId = getCurrentUserId();

  await deleteProject(id, userId); // Throws if not owner

  return NextResponse.json({
    success: true,
    message: 'Project deleted successfully',
  });
}
```

---

### 6. Error Handling

#### Client-Side Errors
- **Not Owner**: "Only project owners can delete projects"
- **Network Error**: "Failed to connect to server"
- **Server Error**: Display server error message
- **Unknown Error**: "An unexpected error occurred"

#### Server-Side Errors (already handled)
- **403 Forbidden**: User is not owner
- **404 Not Found**: Project doesn't exist
- **500 Internal Server Error**: Database error

---

### 7. UX Considerations

#### Confirmation Modal Design
```
┌─────────────────────────────────────────────┐
│  ⚠️  Delete Project "My Project"            │
├─────────────────────────────────────────────┤
│                                             │
│  This action CANNOT be undone. The         │
│  following data will be permanently         │
│  deleted or orphaned:                       │
│                                             │
│  ✓ Deleted (Permanent)                      │
│    • 5 workflows                            │
│    • 12 stories (BACKLOG/TODO/etc)          │
│    • 3 project members                      │
│                                             │
│  ⚠️ Orphaned (Kept without project)         │
│    • 8 chat sessions                        │
│    • 2 configurations                       │
│    • 3 custom agents                        │
│                                             │
│  Type the project name to confirm:          │
│  ┌───────────────────────────────────────┐  │
│  │ My Project                            │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [ Cancel ]  [ Delete Project (Disabled) ]  │
└─────────────────────────────────────────────┘
```

#### Loading State
- Show spinner on delete button
- Disable cancel button
- Display "Deleting project..."

#### Success State
- Toast notification: "Project deleted successfully"
- Redirect to another project or projects list
- Update ProjectContext to remove deleted project

---

### 8. Testing Checklist

#### Unit Tests
- [ ] DeleteProjectButton renders correctly
- [ ] DeleteProjectModal shows correct cascade info
- [ ] Confirmation input validation works
- [ ] Delete button disabled until valid input

#### Integration Tests
- [ ] DELETE API endpoint works for owners
- [ ] DELETE API endpoint blocks non-owners (403)
- [ ] Cascade deletion works correctly
- [ ] ProjectContext updates after deletion

#### E2E Tests
- [ ] User can delete project from dropdown
- [ ] User can delete project from settings page
- [ ] Confirmation modal prevents accidental deletion
- [ ] Error messages display correctly
- [ ] Success redirect works

---

### 9. Implementation Files

```
# New Files to Create
components/features/projects/DeleteProjectButton.tsx
components/features/projects/DeleteProjectModal.tsx
app/projects/[id]/settings/page.tsx

# Files to Modify
components/features/ProjectSelector.tsx (add delete button)
lib/context/ProjectContext.tsx (handle deletion in context)
prisma/schema.prisma (verify/update Agent onDelete behavior)

# Backend (Already Complete)
✅ app/api/v3/projects/[id]/route.ts
✅ lib/services/project-service.ts
```

---

### 10. Prisma Schema Update (Recommended)

```prisma
model Agent {
  id        String   @id @default(cuid())
  name      String   @unique
  // ... other fields
  projectId String?

  project Project? @relation(fields: [projectId], references: [id], onDelete: SetNull)

  @@index([projectId])
}
```

**Rationale**: Custom agents created by users should be preserved even if project is deleted, allowing them to be reassigned to other projects.

---

## Implementation Priority

### Phase 1: Core Functionality (1-2 hours)
1. Create DeleteProjectModal component
2. Create DeleteProjectButton component
3. Add to ProjectSelector dropdown
4. Test basic deletion flow

### Phase 2: Enhanced UX (1 hour)
5. Create ProjectSettings page
6. Add danger zone section
7. Improve confirmation modal design
8. Add loading/success/error states

### Phase 3: Testing & Polish (1 hour)
9. Write unit tests
10. Write E2E tests
11. Update Prisma schema for agents
12. Documentation

**Total Estimated Time**: 3-4 hours

---

## Security Considerations

1. **Permission Check**: Already enforced at service layer (owner only)
2. **CSRF Protection**: Next.js API routes have built-in protection
3. **SQL Injection**: Prevented by Prisma ORM
4. **Confirmation**: Requires typing project name (prevents accidental deletion)
5. **Audit Trail**: Consider logging project deletions to database

---

## Future Enhancements

1. **Soft Delete**: Add `deletedAt` timestamp instead of hard delete
2. **Restore Functionality**: Allow undoing deletion within 30 days
3. **Backup Before Delete**: Export project data as JSON
4. **Email Notification**: Notify all members when project is deleted
5. **Cascade Preview**: Show detailed list of what will be deleted
6. **Transfer Ownership**: Allow transferring project before deletion

---

## Related Documentation

- [Project Service API](../lib/services/project-service.ts)
- [Prisma Schema](../prisma/schema.prisma)
- [ProjectContext](../lib/context/ProjectContext.tsx)
- [API Reference](./API-REFERENCE.md)
