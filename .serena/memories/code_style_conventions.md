# Code Style & Conventions

## TypeScript Configuration
- **Target**: ES2020
- **Module**: ESNext
- **Strict Mode**: Enabled (strict: true)
- **Module Resolution**: Node
- **No Type Assertions**: Avoid using `as` for type casting
- Use explicit types and type guards instead

## File Structure
- TypeScript files in `.vitepress/` directory
- Test files use `.test.ts` suffix
- Configuration files use `.mts` extension

## Testing
- Use Vitest with globals enabled
- Test environment: Node (not happy-dom)
- Test files co-located with source files

## Code Quality Standards (from global CLAUDE.md)
- **Type Safety**:
  - No Type Casting: Avoid using type assertions (`as`)
  - Explicit Types: Define clear return types for functions
  - Type Guards: Use proper type guards for runtime checks
  - Type Inference: Let the type system infer types where appropriate

## Import Style
- Use ES modules
- esModuleInterop and allowSyntheticDefaultImports enabled

## Build Configuration
- Isolated modules for faster builds
- Force consistent casing in file names
- Skip lib check for faster compilation
- Resolve JSON modules enabled