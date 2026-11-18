# Sparkline Marketing — Design System Documentation

> **"Think Strategy. Predict Growth. Market Smarter."**

The Sparkline Marketing Design System establishes the visual foundation, brand token architecture, typography hierarchy, and UI guidelines for the entire SaaS marketing intelligence platform.

---

## 1. Brand Color Palette & Tokens

Sparkline Marketing is built on an exact 8-color brand palette inspired by analytics charts, intelligence algorithms, and SaaS data command centers.

### 1.1 Core Brand Palette

| Color Name | Hex Code | Purpose & Application |
| :--- | :--- | :--- |
| **Midnight Navy** | `#071329` | Primary dark surface, main dashboard sidebar, premium dark elements |
| **Deep Slate** | `#152238` | Secondary dark background, dark card containers, subtle dark borders |
| **Electric Blue** | `#0C65F4` | Primary brand accent, primary CTA buttons, active state indicators |
| **Royal Purple** | `#593090` | Strategic AI features, algorithmic confidence markers, intelligence tags |
| **Magenta** | `#C52B85` | Creative marketing highlights, high-converting copy alerts, peak markers |
| **Sky Cyan** | `#2292D9` | Technical metrics, data elements, analytics highlights, sparkline nodes |
| **Growth Orange** | `#E37C33` | Growth curves, high-priority opportunities, ad spend indicators, warnings |
| **Cloud White** | `#F5F7FC` | Primary workspace background, light surface canvas |

### 1.2 Color Distribution
- **55%**: Light backgrounds and white surfaces (`#F5F7FC`, `#FFFFFF`)
- **25%**: Navy and deep slate navigation (`#071329`, `#152238`)
- **15%**: Blue, purple, and magenta strategic accents (`#0C65F4`, `#593090`, `#C52B85`)
- **5%**: Cyan and orange metrics highlights (`#2292D9`, `#E37C33`)

### 1.3 Extended Accessible Color Scales
Accessible tints and shades are defined in `src/styles/tokens.ts` for all interactive states:
- `50`: Light background fills (e.g. `bg-blue-50`, `bg-purple-50`)
- `200`: Subtle borders and outlines (e.g. `border-blue-200`)
- `500`: Standard brand color
- `600`: Hover states (e.g. `hover:bg-blue-600`)
- `700`: Active and pressed states (e.g. `active:bg-blue-700`)
- `800`: Deep contrast text on light badge backgrounds

---

## 2. Typography Hierarchy

### 2.1 Font Families
- **Headings & Titles**: `Plus Jakarta Sans`, `Inter`, sans-serif
- **Body & Controls**: `Inter`, system-ui, sans-serif
- **Data, Ratios & Code**: `ui-monospace`, `SFMono-Regular`, `Menlo`, monospace

### 2.2 Scale Tokens
- **Display Headings**: `3.75rem` (60px), weight: 800, line-height: 1.1, tracking: -0.03em
- **Page Titles (H1)**: `2.5rem` (40px), weight: 700, line-height: 1.2, tracking: -0.025em
- **Section Headings (H2)**: `1.875rem` (30px), weight: 700, line-height: 1.25, tracking: -0.02em
- **Card Headings (H3)**: `1.375rem` (22px), weight: 600, line-height: 1.3, tracking: -0.015em
- **Subheadings (H4)**: `1.125rem` (18px), weight: 600, line-height: 1.35, tracking: -0.01em
- **Body Text**: `0.875rem` (14px) – `1rem` (16px), weight: 400, line-height: 1.5–1.6
- **Labels & Microcopy**: `0.75rem` (12px), weight: 500–600, line-height: 1.4
- **Overline / Badges**: `0.6875rem` (11px), weight: 700, tracking: 0.08em, uppercase

---

## 3. Spacing, Radii & Elevation

### 3.1 Border Radius Tokens
- `sm`: `0.375rem` (6px) — Badges, small pills, code tags
- `md`: `0.5rem` (8px) — Buttons, form inputs, tooltips
- `lg`: `0.75rem` (12px) — Inner sub-containers, dialog actions
- `xl`: `1rem` (16px) — Cards, dropdowns, opportunity widgets
- `2xl`: `1.25rem` (20px) — Major workspace cards, visual compositions
- `3xl`: `1.5rem` (24px) — Modal dialogs, hero containers
- `full`: `9999px` — Avatars, status dots, metric pills

### 3.2 Shadow & Elevation Tokens
- `subtle`: `0 1px 3px 0 rgba(7, 19, 41, 0.05)` — Subtle cards, input borders
- `card`: `0 4px 6px -1px rgba(7, 19, 41, 0.06)` — Standard surface cards
- `cardHover`: `0 10px 15px -3px rgba(7, 19, 41, 0.08)` — Interactive hover state
- `premium`: `0 20px 25px -5px rgba(7, 19, 41, 0.1)` — Hero containers, key callouts
- `dropdown`: `0 12px 28px 0 rgba(7, 19, 41, 0.12)` — Menus, popovers
- `modal`: `0 25px 50px -12px rgba(7, 19, 41, 0.25)` — Dialog backdrops

---

## 4. Interaction & Accessibility Guidelines

- **Focus States**: Visible 2px focus ring (`focus-visible:ring-2 focus-visible:ring-sparkline-blue`).
- **Touch Targets**: Minimum 44x44px interactive target for mobile buttons and navigation controls.
- **Color Contrast**: All text combinations meet or exceed WCAG 2.1 AA (4.5:1 for regular text, 3:1 for large text).
- **Reduced Motion**: Respects `prefers-reduced-motion: reduce` by disabling transitions and animations.
- **Semantic ARIA**: Proper roles on dialogs (`role="dialog"`), alerts (`role="alert"`), tooltips (`role="tooltip"`), and progress bars (`role="progressbar"`).

