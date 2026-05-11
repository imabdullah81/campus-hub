---
name: CampusHub
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191b23'
  surface-container: '#1d2027'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2ec'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#e1e2ec'
  inverse-on-surface: '#2e3038'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#ffb786'
  on-tertiary: '#502400'
  tertiary-container: '#df7412'
  on-tertiary-container: '#461f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#10131a'
  on-background: '#e1e2ec'
  surface-variant: '#32353c'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is engineered for a high-energy university ecosystem, blending the sophistication of a modern SaaS platform with the futuristic dynamism of a tech startup. The brand personality is efficient, trustworthy, and forward-thinking. 

The aesthetic is anchored in **Glassmorphism**, utilizing translucent layers and deep background blurs to create a sense of digital depth and "airiness" despite the dark palette. It prioritizes high-contrast interactions to ensure students can navigate the marketplace with speed and precision. The visual language is minimal but expressive, using light as a primary navigator through subtle glows and soft shadows.

## Colors
The color palette utilizes a deep "Midnight Navy" (#0B0F19) for the primary canvas to allow accent colors to pop with maximum vibrancy. 

- **Primary Accent Blue (#3B82F6):** Used for primary actions, focus states, and key navigational elements.
- **Secondary Purple (#8B5CF6):** Used for creative categories, premium listings, and secondary call-to-actions.
- **Glass Overlays:** Surfaces are created using semi-transparent variations of the surface color (e.g., `rgba(22, 29, 47, 0.7)`) with a `backdrop-filter: blur(12px)`.
- **Gradients:** Use a linear gradient from Primary Blue to Secondary Purple for high-impact elements like "Post a Listing" buttons or featured cards.

## Typography
The design system employs **Inter** for its incredible legibility and technical feel. The type hierarchy is designed to be highly scannable. 

Headlines use tighter letter spacing and heavier weights to create a sense of authority and modernity. Body text remains spacious to ensure long listing descriptions are readable in dark mode. Small labels use an increased letter spacing and a semi-bold weight to maintain clarity against blurred backgrounds.

## Layout & Spacing
This design system follows a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout emphasizes generous white space (or "dark space") to prevent the glassmorphic elements from feeling cluttered.

- **Desktop:** 1280px max-width container, 24px gutters, and 48px side margins.
- **Mobile:** Full-width fluid container with 16px side margins.
- **Rhythm:** All vertical spacing must be a multiple of 4px. Use "stack" units (8px, 16px, 32px) to define relationships between elements within cards and sections.

## Elevation & Depth
Depth in this design system is conveyed through **Backdrop Blurs** and **Tonal Layering** rather than traditional heavy shadows.

1.  **Level 0 (Base):** The dark background (#0B0F19).
2.  **Level 1 (Cards/Sections):** Surface color (#161D2F) with 70% opacity, 1px subtle border (#ffffff10), and a 12px blur.
3.  **Level 2 (Modals/Popovers):** Surface color with 90% opacity, a 24px blur, and a soft "Primary Blue" tinted shadow (`0px 20px 40px rgba(0, 0, 0, 0.4)`).
4.  **Interactive Glows:** Hovering over a card should trigger a subtle internal glow or a slight increase in border opacity.

## Shapes
The shape language is friendly yet structured, using **Rounded (0.5rem - 1.5rem)** corners. 

- Standard components (Inputs, Buttons) use `0.75rem` (12px).
- Containers and Marketplace Cards use `1rem` (16px).
- High-level wrappers or featured sections may use `1.5rem` (24px).
- Small tags and chips use a **Pill** shape for distinct visual separation from the rectangular grid.

## Components
- **Buttons:** Primary buttons use a solid #3B82F6 fill with white text. Secondary buttons use a glass effect with a #ffffff15 border. Text is always semi-bold.
- **Input Fields:** Semi-transparent dark backgrounds with a 1px border. On focus, the border transitions to Primary Blue with a subtle outer glow.
- **Marketplace Cards:** The core component. Features a glassmorphic background, 16px corner radius, and a top-aligned image. Metadata (price, location) uses Secondary Purple for emphasis.
- **Chips/Tags:** Used for categories (e.g., "Textbooks", "Electronics"). High-contrast background (Primary Blue at 10% opacity) with Primary Blue text.
- **Navigation Bar:** A floating glass element at the top of the viewport with a `saturate(180%)` and `blur(20px)` filter to allow content to scroll underneath beautifully.
- **Checkboxes:** Custom square-round toggles that fill with the Primary Blue gradient when active.