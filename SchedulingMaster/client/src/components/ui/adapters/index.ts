/**
 * UI Component Adapters
 * 
 * This index file exports all UI component adapters that facilitate
 * migration between different UI libraries.
 */

// Export individual components
export * from './Button';
export * from './Tooltip';
export * from './DropdownMenu';

// Export theme utilities
export * from './themeUtils';

// Create a note about migration
/**
 * MIGRATION GUIDE:
 * 
 * To migrate to Material UI:
 * 
 * 1. Update each adapter file to import from @mui/material instead of shadcn components
 * 2. Adapt the component implementation to maintain the same props interface
 * 3. Convert styling patterns (Tailwind classes to sx props, etc.)
 * 4. Update themeUtils.ts to properly map between your theme system and Material UI
 * 
 * Because application components import from these adapters rather than directly
 * from UI libraries, you only need to update the adapter implementations.
 */