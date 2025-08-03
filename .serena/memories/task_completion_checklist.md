# Task Completion Checklist

## Must Do After Every Task

### 1. Run Type Checking
```bash
pnpm typecheck
```
- Ensure no TypeScript errors
- Fix any type issues without using `as` assertions

### 2. Run Tests
```bash
pnpm test
```
- All tests must pass
- Add new tests if implementing new features

### 3. Verify Development Server
```bash
pnpm docs:dev
```
- Check that changes work correctly in development
- Verify OGP image generation if modified

### 4. Build Verification
```bash
pnpm docs:build
```
- Ensure production build succeeds
- Check for any build warnings

### 5. Git Status Check
```bash
git status
```
- Review all changes before committing

## Important Rules (from global CLAUDE.md)

### Test-Driven Development (TDD) is MANDATORY
1. **RED Phase**: Write failing test FIRST
2. **GREEN Phase**: Write minimum code to pass
3. **REFACTOR Phase**: Improve code only after tests pass

### Tidy First Approach
- Separate structural changes from behavioral changes
- Never mix both in same commit
- Use `[STRUCTURAL]` or `[BEHAVIORAL]` commit prefixes

### Commit Discipline
- Only commit when ALL tests pass
- All linter warnings resolved
- Single logical unit of work per commit