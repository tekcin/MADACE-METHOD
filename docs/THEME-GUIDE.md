# MADACE Dark Theme Guide

## Overview

The MADACE Dark Theme is a comprehensive styling system based on the Navigation sidebar design. It provides consistent dark mode styling across the entire application with excellent text contrast and visual hierarchy.

## Theme Location

- **Main Theme File**: `app/madace-theme.css`
- **Import Location**: `app/globals.css`
- **Base Component**: Navigation sidebar (`components/features/Navigation.tsx`)

## Color Palette

### Background Colors

```css
--madace-bg-primary: #1f2937 /* gray-800 - Main backgrounds, cards, panels */
  --madace-bg-secondary: #111827 /* gray-900 - Deeper backgrounds, page bg */
  --madace-bg-tertiary: #0f172a /* slate-900 - Darkest backgrounds */;
```

### Border Colors

```css
--madace-border-primary: #374151 /* gray-700 - Main borders */ --madace-border-secondary: #4b5563
  /* gray-600 - Lighter borders */;
```

### Text Colors

```css
--madace-text-primary: #ffffff /* white - Headings, important text */
  --madace-text-secondary: #d1d5db /* gray-300 - Body text (highly readable) */
  --madace-text-tertiary: #9ca3af /* gray-400 - Labels, secondary info */
  --madace-text-muted: #6b7280 /* gray-500 - Disabled, placeholders */;
```

### Accent Colors (Blue - Brand)

```css
--madace-blue-primary: #2563eb /* blue-600 - Brand color, primary buttons */
  --madace-blue-hover: #1d4ed8 /* blue-700 - Hover states */ --madace-blue-light: #bfdbfe
  /* blue-200 - Light accents, active text */ --madace-blue-dark: #1e3a8a
  /* blue-900 - Active backgrounds */;
```

### State Colors

```css
--madace-success: #10b981 /* green-500 */ --madace-warning: #f59e0b /* amber-500 */
  --madace-error: #ef4444 /* red-500 */ --madace-info: #3b82f6 /* blue-500 */;
```

## Usage

### 1. Utility Classes

The theme provides ready-to-use utility classes:

```jsx
// Backgrounds
<div className="madace-bg-primary">      {/* Main background */}
<div className="madace-bg-secondary">    {/* Deeper background */}
<div className="madace-bg-tertiary">     {/* Darkest background */}

// Text Colors
<h1 className="madace-text-primary">     {/* White - for headings */}
<p className="madace-text-secondary">    {/* Gray-300 - for body text */}
<span className="madace-text-tertiary">  {/* Gray-400 - for labels */}
<span className="madace-text-muted">     {/* Gray-500 - for disabled */}

// Borders
<div className="madace-border">          {/* Main border color */}
<div className="madace-border-light">    {/* Lighter border */}
```

### 2. Component Classes

Pre-styled component classes for common UI elements:

#### Cards & Panels

```jsx
<div className="madace-card">{/* Automatically styled with bg, border, and text colors */}</div>
```

#### Buttons

```jsx
{
  /* Primary Button */
}
<button className="madace-btn-primary">Click Me</button>;

{
  /* Secondary Button */
}
<button className="madace-btn-secondary">Cancel</button>;
```

#### Input Fields

```jsx
{/* Inputs are automatically styled */}
<input type="text" className="madace-input" />
<textarea className="madace-input" />
<select className="madace-input" />
```

#### Modals

```jsx
<div className="madace-modal-overlay">
  <div className="madace-modal">
    <div className="madace-modal-header">
      <h2 className="madace-modal-title">Modal Title</h2>
    </div>
    <div className="madace-modal-body">{/* Content */}</div>
    <div className="madace-modal-footer">{/* Footer buttons */}</div>
  </div>
</div>
```

#### Badges

```jsx
<span className="madace-badge madace-badge-blue">Active</span>
<span className="madace-badge madace-badge-green">Success</span>
<span className="madace-badge madace-badge-red">Error</span>
<span className="madace-badge madace-badge-gray">Default</span>
```

#### Alerts

```jsx
<div className="madace-alert madace-alert-info">Info message</div>
<div className="madace-alert madace-alert-success">Success message</div>
<div className="madace-alert madace-alert-warning">Warning message</div>
<div className="madace-alert madace-alert-error">Error message</div>
```

#### Tables

```jsx
<table className="madace-table">
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

### 3. Tailwind Dark Mode Integration

The theme uses **class-based dark mode** with Tailwind's `dark:` variants. The `<html>` element has `class="dark"` set globally, enabling all dark mode styles:

```jsx
{/* Use Tailwind's dark: variants for proper dark mode */}
<div className="bg-white dark:bg-gray-800">
<h2 className="text-gray-900 dark:text-white">Title</h2>
<p className="text-gray-600 dark:text-gray-300">Body text</p>
<div className="border-gray-200 dark:border-gray-700">Content</div>
```

**How it works:**
- `app/layout.tsx` sets `<html className="dark">`
- `app/globals.css` configures Tailwind v4: `@variant dark (html.dark &);`
- All `dark:` utility classes automatically apply
- No need for manual theme toggling - dark mode is always active

## Best Practices

### 1. Text Contrast

Follow this hierarchy for optimal readability:

```jsx
{
  /* Headings - Always use white */
}
<h1 className="font-bold text-white">Main Heading</h1>;

{
  /* Body Text - Use gray-300 for readability */
}
<p className="text-gray-300">This is highly readable body text with excellent contrast.</p>;

{
  /* Labels & Secondary Info - Use gray-400 */
}
<label className="text-sm font-medium text-gray-400">Field Label</label>;

{
  /* Disabled/Muted - Use gray-500 */
}
<span className="text-gray-500">Disabled text</span>;
```

### 2. Background Hierarchy

Create visual depth with background layers:

```jsx
{
  /* Page Background - Use gray-900 */
}
<body className="bg-gray-900">
  {/* Cards/Panels - Use gray-800 */}
  <div className="border border-gray-700 bg-gray-800">
    {/* Nested sections can use same or darker */}
    <header className="border-b border-gray-700 bg-gray-900">...</header>
  </div>
</body>;
```

### 3. Interactive States

Ensure clear interactive feedback:

```jsx
{
  /* Links/Buttons - Show clear hover states */
}
<button className="text-gray-300 hover:bg-gray-700 hover:text-white">Click Me</button>;

{
  /* Active States - Use blue accent */
}
<button className="bg-blue-900 text-blue-200">Active</button>;
```

### 4. Borders

Use consistent border styling:

```jsx
{/* Main borders - gray-700 */}
<div className="border border-gray-700">

{/* Subtle dividers - gray-700 with border-b */}
<div className="border-b border-gray-700">
```

## Migration Guide

### Converting Existing Components

**IMPORTANT:** KEEP `dark:` variant classes! The theme uses Tailwind's class-based dark mode.

#### Recommended Approach (Use dark: variants):

```jsx
<div className="bg-white dark:bg-gray-800">
  <h2 className="text-gray-900 dark:text-white">Title</h2>
  <p className="text-gray-600 dark:text-gray-300">Text</p>
</div>
```

This works because:
- `<html class="dark">` is set globally in `app/layout.tsx`
- All `dark:` variants automatically apply
- Future-proof if light mode is ever added

#### Alternative (Use madace-* utility classes):

```jsx
<div className="madace-bg-primary">
  <h2 className="madace-text-primary">Title</h2>
  <p className="madace-text-secondary">Text</p>
</div>
```

**Best Practice:** Use `dark:` variants for standard components. Use `madace-*` classes for custom components that need precise theme colors.

## Customization

### Extending the Theme

To add custom colors, edit `app/madace-theme.css`:

```css
:root {
  /* Add your custom colors */
  --madace-custom-color: #your-color;
}

/* Create utility classes */
.madace-custom-bg {
  background-color: var(--madace-custom-color);
}
```

### Project-Specific Overrides

Create a separate CSS file for project-specific styles:

```css
/* custom-theme.css */
@import './madace-theme.css';

/* Your overrides */
.special-component {
  background-color: var(--madace-bg-primary);
  /* ... */
}
```

## Accessibility

The theme includes accessibility features:

1. **High Contrast**: All text meets WCAG AA standards
2. **Focus Indicators**: Clear 2px blue outline on focused elements
3. **Reduced Motion**: Respects `prefers-reduced-motion` setting
4. **Print Styles**: Automatically converts to print-friendly colors

## Examples

### Complete Card Example

```jsx
<div className="madace-card p-6">
  <h3 className="madace-text-primary mb-4 text-lg font-semibold">Card Title</h3>
  <p className="madace-text-secondary mb-4">This is the card body with highly readable text.</p>
  <div className="flex gap-3">
    <button className="madace-btn-primary">Primary Action</button>
    <button className="madace-btn-secondary">Secondary Action</button>
  </div>
</div>
```

### Complete Form Example

```jsx
<form className="space-y-4">
  <div>
    <label className="madace-label mb-2 block">Username</label>
    <input type="text" className="madace-input w-full" placeholder="Enter username" />
  </div>

  <div>
    <label className="madace-label mb-2 block">Email</label>
    <input type="email" className="madace-input w-full" placeholder="Enter email" />
  </div>

  <button type="submit" className="madace-btn-primary">
    Submit
  </button>
</form>
```

## Support

For issues or questions about the theme:

1. Check this documentation
2. Review `app/madace-theme.css` for available classes
3. See `components/features/Navigation.tsx` for reference implementation

## Version

- **Version**: 1.0.0
- **Last Updated**: 2025-11-01
- **Based On**: Navigation Sidebar Design
