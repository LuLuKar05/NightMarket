# 🎨 NightMarket Color Palette

## Brand Colors

### Primary Colors
```css
--color-main: #371F76;        /* Main Color - Deep Purple */
--color-secondary: #F7F4EB;   /* Secondary Color - Cream White */
--color-third: #B9C0FF;       /* Third Color - Light Purple */
--color-shadow: #C8CEEE;      /* Shadow Color - Pale Lavender */
```

## Color Usage Guide

### Main Color (#371F76)
**Usage:** Primary buttons, header background gradient, footer background
- Connect wallet button background
- Header gradient (base color)
- Main brand identity

### Secondary Color (#F7F4EB)
**Usage:** Primary text color, button text
- Body text
- Button labels
- Wallet address display
- High-contrast readable text

### Third Color (#B9C0FF)
**Usage:** Accents, borders, hover states, headings
- Border colors
- Feature card headings
- Link colors
- Gradient accents
- Hover border highlights

### Shadow Color (#C8CEEE)
**Usage:** Subtle text, descriptions, secondary information
- Subtitle text
- Feature descriptions
- Footer text
- Secondary text elements
- Gradient text effects

## Component Color Mapping

### Header
- Background: `linear-gradient(135deg, #371F76 0%, #4a2d8f 100%)`
- Title: `linear-gradient(to right, #B9C0FF, #C8CEEE)`
- Subtitle: `#C8CEEE`
- Border: `#B9C0FF`

### Wallet Connect Button
- Background: `linear-gradient(135deg, #371F76 0%, #4a2d8f 100%)`
- Text: `#F7F4EB`
- Border: `#B9C0FF`
- Hover Shadow: `rgba(185, 192, 255, 0.4)`

### Connected Wallet Display
- Background: `rgba(185, 192, 255, 0.1)`
- Border: `rgba(185, 192, 255, 0.2)`
- Address Text: `#F7F4EB`
- Status Indicator: `#10b981` (green for connected)

### Feature Cards
- Background: `rgba(185, 192, 255, 0.05)`
- Border: `rgba(185, 192, 255, 0.2)`
- Hover Border: `#B9C0FF`
- Heading: `#B9C0FF`
- Description: `#C8CEEE`
- Hover Shadow: `rgba(185, 192, 255, 0.2)`

### Body/Background
- Base Background: `#1a0f2e`
- Gradient Background: `linear-gradient(135deg, #1a0f2e 0%, #2d1f4a 100%)`
- Text: `#F7F4EB`

### Links
- Normal: `#B9C0FF`
- Hover: `#C8CEEE`

### Footer
- Background: `rgba(55, 31, 118, 0.3)`
- Border: `rgba(185, 192, 255, 0.2)`
- Text: `#C8CEEE`

### Error Messages
- Background: `rgba(239, 68, 68, 0.1)`
- Border: `rgba(239, 68, 68, 0.3)`
- Text: Red (default)

## Accessibility Notes

- **Main (#371F76) on Secondary (#F7F4EB)**: WCAG AAA compliant (contrast ratio > 7:1)
- **Third (#B9C0FF) on Main (#371F76)**: WCAG AA compliant
- **Secondary (#F7F4EB) on Main (#371F76)**: Excellent readability

## Color Variations

### Transparency Layers
```css
/* Third color with alpha */
rgba(185, 192, 255, 0.05)  /* Very subtle backgrounds */
rgba(185, 192, 255, 0.1)   /* Card backgrounds */
rgba(185, 192, 255, 0.2)   /* Borders and dividers */
rgba(185, 192, 255, 0.3)   /* Hover states */
rgba(185, 192, 255, 0.4)   /* Active states/shadows */

/* Main color with alpha */
rgba(55, 31, 118, 0.3)     /* Footer background */
```

### Gradient Combinations
```css
/* Header gradient */
linear-gradient(135deg, #371F76 0%, #4a2d8f 100%)

/* Title gradient */
linear-gradient(to right, #B9C0FF, #C8CEEE)

/* Body gradient */
linear-gradient(135deg, #1a0f2e 0%, #2d1f4a 100%)

/* Button hover gradient (reversed) */
linear-gradient(135deg, #4a2d8f 0%, #371F76 100%)
```

## Dark Theme Values

The application uses a custom dark theme with these base colors:

```css
:root {
  color: #F7F4EB;              /* Primary text */
  background-color: #1a0f2e;   /* Base background */
}

body {
  background: linear-gradient(135deg, #1a0f2e 0%, #2d1f4a 100%);
}
```

## CSS Variables Usage

Define these in your root:
```css
:root {
  --color-main: #371F76;
  --color-secondary: #F7F4EB;
  --color-third: #B9C0FF;
  --color-shadow: #C8CEEE;
}
```

Then use throughout your CSS:
```css
.element {
  background-color: var(--color-main);
  color: var(--color-secondary);
  border-color: var(--color-third);
}
```

## Brand Identity

The color palette creates a **sophisticated, trustworthy, and modern** identity:
- **Purple (#371F76)**: Represents luxury, wisdom, and privacy
- **Cream (#F7F4EB)**: Provides warmth and readability
- **Light Purple (#B9C0FF)**: Adds a modern, tech-forward feel
- **Lavender (#C8CEEE)**: Creates subtle, elegant accents

Perfect for a privacy-focused financial application on the Midnight Network!

---

**Color Scheme Applied**: November 18, 2025  
**Files Updated**: `index.css`, `App.css`
