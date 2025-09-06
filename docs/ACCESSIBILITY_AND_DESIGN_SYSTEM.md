# ♿ Accessibility & Design System

## Overview

Guidelines and references for accessible UI and the platform design system.

## Accessibility

- WCAG 2.1 AA alignment for contrast, focus, semantics
- Keyboard: focus order, visible focus, skip links
- ARIA: roles and labels for complex controls
- Live regions for async updates (toasts, notifications)
- Testing: axe, keyboard audits, screen reader smoke tests

## Design System

- Location: `frontend/src/design-system/`
- Tokens: color, spacing, typography in `tokens/`
- Components: buttons, inputs, cards, badges (type-safe props)
- Theming: light/dark + brand overrides

## Usage

- Prefer DS components over ad-hoc elements
- Respect tokens; avoid hard-coded colors
- Provide variants and sizes, not custom one-off styles


