# Suggested Commands

## Development Commands
- `pnpm docs:dev` - Run development server with hot reload
- `pnpm docs:build` - Build site for production
- `pnpm docs:preview` - Preview production build locally
- `pnpm install` - Install dependencies

## Testing & Quality Commands
- `pnpm test` - Run tests with Vitest
- `pnpm test:ui` - Run tests with UI interface
- `pnpm typecheck` - Run TypeScript type checking (tsc --noEmit)

## Utility Commands (Darwin/macOS)
- `git` - Located at `/usr/bin/git`
- `ls` - Aliased to `lsd` (enhanced ls)
- `grep` - Located at `/usr/bin/grep`
- `find` - Located at `/usr/bin/find`
- `cd` - Change directory
- `pwd` - Print working directory

## Background Process Management
- **MUST use ghost**: `ghost run <command>` for background processes
- Never use `&`, `nohup`, `screen`, or `tmux`
- Use `--` when command has options: `ghost run ls -- -la`