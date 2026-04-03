---
name: test
description: Make sure you read this when you write code for the app in any language. You should write tests when you write code. This skill contains important guidelines and conventions to follow.
---

# Test Guidelines

## Implementation Workflow

You should follow t-wada's "test-driven development with a fast feedback loop" approach:

1. Write a failing test that defines a function or feature.
2. Run the test to see it fail.
3. Write the minimum code needed to pass the test.
4. Run the test to see it pass.
5. Refactor the code while keeping the test passing.

## Testing Strategy & Tools

- **Unit tests**: Test individual functions and components in isolation. Use mocks/stubs for dependencies. Focus on edge cases and error handling.
  - You should use `vp test --coverage` to run vitest with coverage report.
- **Integration tests**: Test interactions between components and modules. Use real dependencies where possible. Focus on critical paths and user flows.
  - You should use `vp test`
- **End-to-end tests**: Test the entire application from the user's perspective. Use Playwright. Focus on core features and regression testing.

## Test Organization

- Place unit tests in the same directory as the code they test, with a `.test.ts` suffix.
- Place integration tests in a separate `tests` directory.
- Place end-to-end tests in a separate `e2e` directory.

## Test Principles

- Tests should be deterministic and repeatable.
- One test should test one thing. Avoid testing multiple behaviors in a single test.
