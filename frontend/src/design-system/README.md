# Error-IQ Design System

A comprehensive design system for the Error-IQ platform, providing consistent UI components, design tokens, and utilities for building cohesive user experiences.

## 🎨 Design Principles

### Consistency
- Unified color palette and typography
- Consistent spacing and sizing scales
- Standardized component APIs

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Performance
- Optimized component rendering
- Efficient CSS custom properties
- Lazy loading support

### Scalability
- Modular architecture
- Theme extension capabilities
- Responsive design patterns

## 📚 Core Concepts

### Design Tokens
```typescript
import { COLORS, TYPOGRAPHY, SPACING } from '@design-system';

// Use design tokens
const styles = {
  color: COLORS.primary[500],
  fontSize: TYPOGRAPHY.sizes.base,
  padding: SPACING[4]
};
```

### Component Variants
```typescript
import { Button } from '@design-system';

// Use component variants
<Button variant="primary" size="md">
  Click me
</Button>
```

### Utility Functions
```typescript
import { cn } from '@design-system';

// Combine classes efficiently
const classes = cn(
  'base-class',
  variant && `variant-${variant}`,
  disabled && 'disabled'
);
```

## 🧩 Components

### Button
```typescript
import { Button } from '@design-system';

<Button
  variant="primary"
  size="md"
  loading={false}
  leftIcon={<Icon />}
  onClick={handleClick}
>
  Action
</Button>
```

**Props:**
- `variant`: `primary | secondary | success | error | warning`
- `style`: `solid | outline | ghost`
- `size`: `xs | sm | md | lg | xl`
- `loading`: `boolean`
- `leftIcon`/`rightIcon`: `ReactNode`
- `fullWidth`: `boolean`

### Input
```typescript
import { Input } from '@design-system';

<Input
  label="Email"
  type="email"
  variant="default"
  size="md"
  helperText="Enter your email address"
  leftIcon={<MailIcon />}
  error={validationError}
/>
```

**Props:**
- `variant`: `default | error | success | warning`
- `size`: `xs | sm | md | lg`
- `label`: `string`
- `helperText`/`error`/`success`/`warning`: `string`
- `leftIcon`/`rightIcon`: `ReactNode`
- `fullWidth`: `boolean`

## 🎨 Design Tokens

### Colors
```typescript
import { COLORS } from '@design-system';

// Primary colors
const primaryColor = COLORS.primary[500]; // #3b82f6

// Semantic colors
const successColor = COLORS.success[500]; // #22c55e
const errorColor = COLORS.error[500];     // #ef4444
```

### Typography
```typescript
import { TYPOGRAPHY, TEXT_PRESETS } from '@design-system';

// Font sizes
const baseSize = TYPOGRAPHY.sizes.base; // 1rem

// Text presets
const headingStyles = TEXT_PRESETS.heading.h1;
const bodyStyles = TEXT_PRESETS.body.base;
```

### Spacing
```typescript
import { SPACING } from '@design-system';

// Spacing scale
const smallGap = SPACING[2];  // 0.5rem
const mediumGap = SPACING[4]; // 1rem
const largeGap = SPACING[8];  // 2rem
```

## 🛠️ Utilities

### Class Name Utility
```typescript
import { cn } from '@design-system';

// Efficiently combine classes
const buttonClasses = cn(
  'btn',
  variant && `btn-${variant}`,
  size && `btn-${size}`,
  disabled && 'btn-disabled',
  className
);
```

### Variant Creator
```typescript
import { createVariants } from '@design-system';

const buttonVariants = createVariants({
  primary: {
    solid: 'bg-blue-600 text-white',
    outline: 'border border-blue-600 text-blue-600'
  },
  secondary: {
    solid: 'bg-gray-600 text-white',
    outline: 'border border-gray-600 text-gray-600'
  }
});

const classes = buttonVariants('primary', 'solid');
```

### Component Class Generator
```typescript
import { createComponentClasses } from '@design-system';

const getButtonClasses = createComponentClasses('button', {
  primary: {
    solid: 'bg-blue-600 text-white',
    outline: 'border border-blue-600 text-blue-600'
  }
});

const classes = getButtonClasses({
  variant: 'primary',
  size: 'md',
  disabled: false,
  className: 'custom-class'
});
```

## 🎯 Usage Guidelines

### Component Patterns
1. **Always use design tokens** instead of hardcoded values
2. **Prefer component variants** over custom styling
3. **Use semantic color names** for better theming support
4. **Implement proper loading states** for better UX

### Accessibility
1. **Always provide labels** for form inputs
2. **Use semantic HTML** elements
3. **Support keyboard navigation** in custom components
4. **Provide proper ARIA labels** when needed

### Performance
1. **Use memoization** for expensive components
2. **Lazy load** non-critical components
3. **Optimize re-renders** with proper dependency arrays
4. **Use CSS custom properties** for dynamic theming

## 🚀 Migration Guide

### From Existing Components
```typescript
// Old approach
<button className="btn btn-primary btn-lg" onClick={handleClick}>
  Click me
</button>

// New approach
import { Button } from '@design-system';

<Button variant="primary" size="lg" onClick={handleClick}>
  Click me
</Button>
```

### From Inline Styles
```typescript
// Old approach
<div style={{ padding: '1rem', color: '#3b82f6' }}>
  Content
</div>

// New approach
import { SPACING, COLORS } from '@design-system';

<div style={{
  padding: SPACING[4],
  color: COLORS.primary[500]
}}>
  Content
</div>
```

## 📖 API Reference

### Components
- `Button`: Primary action component
- `Input`: Form input component
- `Card`: Content container component
- `Modal`: Overlay dialog component
- `Toast`: Notification component

### Utilities
- `cn()`: Class name utility
- `createVariants()`: Variant generator
- `createComponentClasses()`: Component class generator

### Tokens
- `COLORS`: Color palette
- `TYPOGRAPHY`: Typography scale
- `SPACING`: Spacing scale
- `SIZES`: Component sizing

## 🔧 Development

### Adding New Components
1. Create component in `src/design-system/components/`
2. Add TypeScript types in `Component.types.ts`
3. Add styles in `Component.styles.ts`
4. Export from `Component/index.ts`
5. Add to main `design-system/index.ts`

### Extending Design Tokens
1. Add new tokens to appropriate file in `src/design-system/tokens/`
2. Update CSS custom properties if needed
3. Export from main index file
4. Update documentation

### Testing Components
```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@design-system';

test('Button renders correctly', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

This design system provides a solid foundation for building consistent, accessible, and performant user interfaces across the Error-IQ platform.
