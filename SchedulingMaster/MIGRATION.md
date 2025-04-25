# Migration Guide for Dental Practice Management System

This document provides instructions for migrating this scheduling system to another Replit project using Material UI.

## Prerequisites

Before beginning the migration:

1. Create a new Replit project with React, TypeScript, Express, and MUI installed
2. Ensure the database and backend structure is set up in the target project

## Reference Example Implementations

Before starting the migration, review the example implementations in the `examples/` directory:

1. **MaterialUI_AppointmentChip.tsx**: Shows how to convert the appointment card component to Material UI
2. **MaterialUI_Theme.tsx**: Provides a Material UI theme configuration that maps to the current design system
3. **MaterialUI_CalendarGrid.tsx**: Demonstrates converting the calendar grid layout to Material UI

These examples serve as references for converting components from shadcn/Tailwind to Material UI.

## Step-by-Step Migration Process

### 1. Copy Schema and Data Models

First, transfer your data schema:

- Copy the entire `shared/schema.ts` file to the target project
- Copy the `server/storage.ts` file to the target project

### 2. Transfer Core Backend Logic

Move the backend implementation:

- Copy `server/routes.ts` to set up the API endpoints
- Copy `server/index.ts` as the main server entry point
- Update any environment-specific configurations as needed

### 3. Migrate UI Components Using Adapters

The project includes component adapters in `client/src/components/ui/adapters/` to simplify the migration:

1. Copy the entire `adapters` directory to your target project
2. Update each adapter implementation to use Material UI components:
   - Replace shadcn imports with equivalent MUI imports
   - Map props and variants to their MUI equivalents
   - Convert className-based styling to MUI's sx prop styling

For example, updating the Button adapter:

```tsx
// Before (using shadcn)
import { Button as ShadcnButton } from '@/components/ui/button';
export function Button({ children, className, ...props }) {
  return <ShadcnButton className={className} {...props}>{children}</ShadcnButton>;
}

// After (using Material UI)
import { Button as MuiButton } from '@mui/material';
export function Button({ children, className, variant, ...props }) {
  // Map shadcn variants to MUI variants (e.g., 'outline' -> 'outlined')
  const muiVariant = variant === 'outline' ? 'outlined' : 
                     variant === 'destructive' ? 'error' : variant;
  
  return (
    <MuiButton 
      variant={muiVariant} 
      className={className} // Or convert to sx prop
      {...props}
    >
      {children}
    </MuiButton>
  );
}
```

### 4. Migrate Application Components

Copy main application components with minimal changes:

1. Copy `client/src/components/scheduling/` directory to the target project
2. Update imports to use the adapter components:

```tsx
// Before
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';

// After
import { Tooltip, TooltipContent } from '@/components/ui/adapters';
```

### 5. Transfer Pages and Routes

Copy page components and update the routes:

1. Copy `client/src/pages/` to the target project
2. Copy `client/src/App.tsx` and update the router if needed
3. Update any Material UI-specific theming requirements

### 6. Migrate Hooks and Utilities

Copy application-specific hooks and utilities:

1. Copy `client/src/hooks/` to the target project 
2. Copy `client/src/lib/` ensuring any UI library-specific utilities are properly updated

### 7. Update Styling

Adjust styling approach to match Material UI:

1. If using CSS modules or global CSS, convert to Material UI's styling system
2. Update theme tokens in `themeUtils.ts` to match Material UI theme system
3. Consider using MUI's `ThemeProvider` for consistent theming

### 8. Testing and Refinement

After the migration:

1. Test all features to ensure they work correctly
2. Fix any styling inconsistencies
3. Optimize performance as needed

## Component-Specific Migration Notes

### Appointment Cards

The `AppointmentChip` component may require special attention:

1. Use MUI Paper or Card components for the base
2. Convert the status styling to use MUI's theme colors
3. Update the tooltip implementation to use MUI's Tooltip component

### Calendar View

The calendar grid may require significant updates:

1. Consider using MUI's Grid component for layout
2. Update the time indicators using MUI styling
3. Ensure drag and drop functionality works with MUI styling

## Technical Considerations

- Material UI uses a different CSS-in-JS approach than Tailwind/shadcn
- Component theme customization will need to be done through MUI's ThemeProvider
- Ensure proper type definitions for all MUI components