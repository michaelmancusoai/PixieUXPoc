# Dental Practice Management System

A comprehensive dental practice management system that provides intelligent scheduling, check-in/checkout processes, and clinical workflow optimization.

## Key Features

- Advanced appointment scheduling with drag-and-drop functionality
- Real-time status updates and notifications
- Operatory and provider-based calendar views
- Patient information management
- Check-in and checkout workflows
- Visual status indicators for efficient practice management

## Project Structure

- `/client`: Frontend React application
  - `/src/components/scheduling`: Core scheduling components
  - `/src/components/ui`: UI component library based on shadcn
  - `/src/components/ui/adapters`: UI component adapters for migration
  - `/src/hooks`: Custom hooks for application logic
  - `/src/lib`: Utility functions and constants
  - `/src/pages`: Application pages and routes
- `/server`: Backend Express application
  - `routes.ts`: API endpoints
  - `storage.ts`: Data storage implementation
- `/shared`: Shared TypeScript types and schemas
- `/examples`: Material UI migration examples

## Migration to Material UI

This project includes resources to facilitate migration to Material UI:

1. **Component Adapters**: Located in `client/src/components/ui/adapters/`, these provide abstraction layers between application code and UI components.

2. **Example Implementations**: Located in the `examples/` directory, these show how key components would be implemented using Material UI.

3. **Migration Guide**: See `MIGRATION.md` for detailed instructions on migrating this project to Material UI.

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm run dev` to start the development server
4. Open your browser to the local development URL

## Technologies Used

- React with TypeScript
- Express.js backend
- shadcn UI components
- TanStack Query for data fetching
- DnD Kit for drag-and-drop functionality
- date-fns for date manipulation