# Sparkline Marketing — Responsive Design Specification

> **Platform:** Sparkline Marketing Intelligence & Strategy Platform  
> **Phase:** Prompt 05 — Responsive Design, Accessibility & UX Optimization  
> **Status:** Fully Audited & Verified

---

## 1. Breakpoint System & Grid Architecture

Sparkline Marketing employs a mobile-first responsive architecture built on Tailwind CSS breakpoints, with fluid containers that eliminate horizontal overflow across all screen widths from 320px smartphones to 4K ultra-wide monitors.

| Breakpoint | Viewport Range | Target Devices | Layout Behavior |
|---|---|---|---|
| **xs** | `320px – 480px` | Small smartphones (iPhone SE, Galaxy A) | Single-column stack, full-width touch cards, 16px horizontal padding, mobile navigation drawer. |
| **sm** | `640px – 767px` | Large smartphones & phablets | 2-column metric grids, wrapped button clusters, off-canvas navigation. |
| **md** | `768px – 1023px` | Tablets & small laptops (iPad, Surface) | 2–3 column grids, desktop top navigation on marketing pages, collapsible mobile drawer on dashboard. |
| **lg** | `1024px – 1279px` | Standard laptops & desktop screens | Fixed dark navy sidebar (`w-72`), multi-column editorial marketing layout, multi-layered hero graphics. |
| **xl** | `1280px – 1535px` | High-resolution laptops & monitors | 4-column metric grids, expanded dashboard data tables, full sidebar navigation. |
| **2xl** | `&ge; 1536px` | Ultra-wide displays | Centered `max-w-7xl` workspace container, preserved reading line lengths (&le; 75ch). |

---

## 2. Navigation Responsiveness

### A. Public Website Navigation (`Navbar.tsx`)
- **Desktop (`&ge; 768px`)**:
  - Horizontal menu bar with hover/click dropdowns (`relative` popovers with `z-50`).
  - Right CTA actions (*Log In* and *Get Started Free*).
- **Mobile (`< 768px`)**:
  - Prominent hamburger toggle button (`p-2 rounded-lg min-h-[44px] min-w-[44px]`).
  - Off-canvas dropdown menu featuring primary links, nested sub-links, and full-width CTA buttons.
  - **Scroll Lock**: Activates `document.body.style.overflow = 'hidden'` when open to prevent background scrolling.
  - **Auto-Dismiss**: Automatically closes on route navigation or when pressing the `Escape` key.

### B. Dashboard Sidebar (`Sidebar.tsx`)
- **Desktop (`&ge; 1024px`)**:
  - Fixed dark navy (`#071329`) sidebar anchored to the left viewport edge.
  - Smooth width transition between expanded mode (`288px` / `w-72`) and compact rail mode (`80px` / `w-20`).
  - Tooltips pop dynamically on hover when in collapsed rail mode to preserve usability.
  - Workspace margin dynamically offsets (`lg:pl-72` &harr; `lg:pl-20`).
- **Mobile & Tablet (`< 1024px`)**:
  - Sidebar transitions off-canvas (`-translate-x-full lg:translate-x-0`).
  - Triggered by the TopBar hamburger menu (`onMenuClick`).
  - Backdrop overlay (`bg-sparkline-midnight/80 backdrop-blur-sm`) isolates the drawer.
  - Scroll lock locks the body to prevent background scrolling behind the drawer.
  - Closes on navigation link clicks, backdrop taps, or `Escape` key.

---

## 3. Data Tables & Card Stacking

### A. Horizontal Overflow Protection
- Data tables (such as Recent Projects on `/dashboard` and Campaign Matrices on `/design-system`) are wrapped in `-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto` with a specified `min-w-[580px]`.
- On narrow viewports, the card containing the table maintains consistent padding while the table scrolls horizontally with momentum scrolling (`-webkit-overflow-scrolling: touch`), eliminating page-level horizontal scrollbars.

### B. Metric & Action Grids
- 4-metric layouts utilize responsive CSS grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4`.
- On mobile devices, cards stack into a clean vertical rhythm with minimum touch hit areas (&ge; 44px).

---

## 4. Charts & Data Visualizations

- All Recharts graphs (`SparklinePerformanceChart`, `SparklineAreaChart`, `SparklineBarChart`, `SparklineLineChart`) are wrapped in `ResponsiveContainer` instances with explicit aspect ratios and `minWidth={100}` to prevent zero-dimension rendering exceptions during orientation switches.
- SVG path vectors in the Hero Section use `viewBox="0 0 400 110"` and `w-full h-full` to scale crisply from 320px smartphones to 4K displays.

---

## 5. Viewport-Bounded Popovers & Dropdowns

- Interactive dropdowns (`NotificationMenu`, `HelpMenu`, `UserProfileMenu`) utilize viewport-bounded maximum widths:
  ```css
  w-[calc(100vw-1.5rem)] sm:w-80 max-w-sm right-0
  ```
- This prevents right-anchored menus from clipping off the left edge of the screen on 320px–375px mobile displays.

---

## 6. Form Controls on Mobile

- All form controls (`TextInput`, `TextArea`, `SelectInput`, `SearchInput`, `CurrencyInput`, `NumberInput`, `Checkbox`, `RadioGroup`, `DateInput`) enforce minimum touch heights of 44px.
- Labels are positioned vertically above inputs to prevent horizontal wrapping bottlenecks on mobile devices.
- Number stepper buttons (`+` and `-`) provide generous touch targets with visible pressed states.

