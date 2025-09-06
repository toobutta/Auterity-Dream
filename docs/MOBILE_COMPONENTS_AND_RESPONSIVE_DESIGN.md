# 📱 Mobile Components & Responsive Design

## Overview

Documentation for mobile-focused components and responsive layout patterns.

## Components

- Location: `frontend/src/components/mobile/`
  - `MobileNavigation.tsx` — mobile nav patterns and routes
  - `ResponsiveGrid.tsx` — responsive grid helpers
  - `SwipeableCard.tsx` — touch-first card interactions
  - `TouchButton.tsx`, `TouchFeedback.tsx` — touch affordances

## Patterns

- Breakpoints: sm/md/lg/xl mapped to grid columns
- Touch targets: min 44px; spacing tokens; safe-area insets
- Performance: lazy routes, reduce motion, image srcset

## Accessibility

- Focus rings for keyboard; semantics for screen readers
- High-contrast mode and prefers-reduced-motion


