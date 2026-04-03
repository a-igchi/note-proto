---
name: react
description: Make sure you read this before reading or writing React code for the app. It contains important guidelines and conventions to follow.
---

# React Guidelines

- Make components as pure and dumb as possible. Think component = (props, state) => UI.
- Avoid using `useEffect`. Only use it for non-UI logic that must run on mount (e.g. initializing a library).
- For data fetching, use TanStack Query.
