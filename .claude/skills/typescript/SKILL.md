---
name: typescript
description: Make sure you read this before writing TypeScript code for the app. It contains important guidelines and conventions to follow.
---

# TypeScript Guidelines

## Code Style

- **Think as functional as possible. Avoid mutable state and side effects.**
- Think in value, function and type, not in objects, classes, and instances.
- Use `type` instead of `interface`.
- Use `const`.
- Use generator functions and iterators if event handlers need to emit multiple values over time.

## Toolchain

- Use `pnpm` for package management.
- Use Vite+ `vp` for all development tasks, including running the dev server, building, linting, formatting, and testing.
  - Use `vp i --filter <package>` to add dependencies.
  - Use `vp rm --filter <package>` to remove dependencies.
  - Use `vp fmt` to format code with oxfmt.
  - Use `vp lint` to lint code with oxlint.
  - Prefer to use `vp check` and `vp check --fix` for normal development, which runs both lint and fmt with type checking.
  - Use `vp test` or `vp test --coverage` for gathering test coverage to run tests with Vitest.

## Development Workflow

- Write code.
- Run `vp check --fix` to format and lint code with type checking.
