# Migration Examples

This directory contains example implementations of key components using Material UI to facilitate migration from shadcn to Material UI.

## Files

- **MaterialUI_AppointmentChip.tsx**: A complete implementation of the AppointmentChip component using Material UI components and styling patterns.
- **MaterialUI_Theme.tsx**: A Material UI theme configuration that maps the current design system colors and typography.
- **MaterialUI_CalendarGrid.tsx**: An implementation of the calendar grid using Material UI's styling approach.

## Usage

These example files demonstrate how to convert the existing components to Material UI, focusing on:

1. **Styling Approach**: Converting from Tailwind/className to Material UI's sx prop and styled components
2. **Component Structure**: Adapting shadcn component patterns to Material UI patterns
3. **Theme Integration**: Using Material UI's theming system instead of CSS variables

## Implementation Notes

### MaterialUI_AppointmentChip.tsx

This file demonstrates:

- Using Material UI's `styled` API for creating styled components
- Converting color-based styling to use Material UI's theme
- Using Material UI components like Box, Typography, Chip, and Tooltip
- Applying responsive styling with the sx prop

### MaterialUI_Theme.tsx

This file demonstrates:

- Creating a consistent Material UI theme that matches the current design system
- Mapping color variables from CSS/Tailwind to Material UI palette
- Configuring typography and spacing to match the current application
- Setting up component overrides for consistent styling across the app

### MaterialUI_CalendarGrid.tsx

This file demonstrates:

- Implementing a complex grid layout using Material UI's Box and styled components
- Converting Tailwind's grid system to Material UI's grid implementation
- Creating styled time slots and resource headers
- Managing layout-specific styling with the sx prop

## Migration Steps

When migrating a component to Material UI:

1. Reference the corresponding example file in this directory
2. Update the imports to use Material UI components
3. Convert Tailwind classes to Material UI styling:
   - Use the sx prop for direct styling
   - Use styled components for complex or reused styling
   - Use Material UI's theme values instead of hardcoded colors
4. Update event handlers and state management to match Material UI patterns
5. Test thoroughly to ensure functionality is preserved

## Integration with Adapter Pattern

These examples complement the adapter components in `client/src/components/ui/adapters/` by showing fully-converted Material UI implementations. The adapters provide an intermediate step that helps maintain interface compatibility during migration.