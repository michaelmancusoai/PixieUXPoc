# UI Component Adapters

This directory contains adapter components that bridge between our application logic and specific UI libraries.

## Purpose

These adapter components make it easier to migrate between different UI libraries (shadcn, Material UI, etc.) by:

1. Encapsulating library-specific imports and implementation details
2. Providing a consistent interface for our application components
3. Reducing the number of places where UI library changes need to be made

## Migration Strategy

When migrating to Material UI:

1. Update the adapter components to import from Material UI instead of shadcn
2. Implement the adapter to maintain the same props interface
3. Update styling to match Material UI patterns (e.g., sx prop instead of className)

Application components should import from these adapters rather than directly from UI libraries:
```jsx
// GOOD
import { Button } from '@/components/ui/adapters/Button';

// AVOID
import { Button } from '@/components/ui/button';
```

## Example Adaption Process

For migrating a button component:

```jsx
// FROM shadcn (current implementation)
export function Button({ variant, size, className, ...props }) {
  return <ButtonUI variant={variant} size={size} className={className} {...props} />;
}

// TO Material UI
export function Button({ variant, size, className, ...props }) {
  // Map shadcn variants to Material UI variants
  const muiVariant = variant === 'outline' ? 'outlined' : variant;
  
  // Convert className to sx prop if needed
  return <ButtonMUI variant={muiVariant} size={size} sx={{ className }} {...props} />;
}
```