# Sparkline Marketing — Reusable Component Library Reference

This document provides a comprehensive API and component index for the Sparkline Marketing design system.

---

## 1. Navigation Components (`src/components/navigation/`)

### `MainNavbar`
Public marketing header with logo, desktop links, interactive dropdowns, and mobile menu toggle.
- **Props**: None (uses site configuration and React Router location).

### `DashboardSidebar` (or `Sidebar`)
Collapsible left sidebar for authenticated workspaces.
- **Props**:
  - `isOpen?: boolean` — Controls mobile drawer state.
  - `onClose?: () => void` — Mobile close callback.
  - `isCollapsed?: boolean` — Desktop collapsed state (icon-only mode).
  - `onToggleCollapse?: () => void` — Desktop collapse toggle callback.

### `Breadcrumbs` (`src/components/common/Breadcrumbs.tsx`)
Semantic breadcrumb navigation with home icon and truncated paths.
- **Props**:
  - `items: { label: string; href?: string }[]`

### `UserProfileMenu`
Interactive user avatar button with popover menu containing workspace switcher and settings links.
- **Props**: `userName`, `userEmail`, `workspaceName`, `avatarInitials`.

### `NotificationMenu`
Notification bell with unread badge and popover list of marketing alerts.
- **Props**: `className?: string`.

### `GlobalSearch`
Universal search bar and command palette triggered by clicking or pressing `Cmd+K` / `Ctrl+K`.
- **Props**: `className?: string`.

### `MobileNavigation`
Generic accessible slide-out mobile drawer with backdrop blur and focus trapping.
- **Props**: `isOpen`, `onClose`, `title`, `variant` ('light' | 'dark'), `children`, `footer`.

---

## 2. Button Components (`src/components/common/Button.tsx`)

Unified `Button` with polymorphic link support and loading state.
- **Variants**: `'primary'` | `'secondary'` | `'outline'` | `'ghost'` | `'gradient'` | `'icon'`
- **Sizes**: `'sm'` | `'md'` | `'lg'`
- **Props**:
  - `isLoading?: boolean`
  - `leftIcon?: React.ReactNode`
  - `rightIcon?: React.ReactNode`
  - `to?: string` (React Router link)
  - `href?: string` (External link)
  - Standard HTML button attributes.
- **Named Aliases**:
  - `PrimaryButton`
  - `SecondaryButton`
  - `OutlineButton`
  - `GhostButton`
  - `GradientButton`
  - `IconButton`

---

## 3. Card Components (`src/components/common/Card.tsx`)

- **`BaseCard` / `Card`**: Core container with variants (`default`, `subtle`, `dark`, `bordered`, `interactive`).
- **`FeatureCard`**: Highlights platform capabilities with icon, badge, title, description, and link.
- **`MetricCard`**: Displays numerical metrics with trend indicator, period, and optional micro-sparkline.
- **`AIInsightCard`**: Royal purple card displaying strategic AI insights and confidence meters.
- **`RecommendationCard`**: Actionable growth recommendation with priority tags (High, Medium, Low).
- **`AnalyticsCard`**: Data visualization card container with header actions and time filters.
- **`PricingCard`**: SaaS tier card with pricing, features checklist, and CTA button.

---

## 4. Form Components (`src/components/common/Form.tsx`)

- **`TextInput`**: Single-line text input with label, helper text, error text, and left/right icons.
- **`TextArea`**: Multi-line input with character counter and auto-resizing.
- **`SelectInput`**: Dropdown select with custom chevron and accessible options.
- **`SearchInput`**: Text input with search icon and instant clear (`X`) button.
- **`CurrencyInput`**: Financial input with currency selector (`USD`, `EUR`, `GBP`, `CAD`, etc.).
- **`NumberInput`**: Numeric input with decrement/increment stepper buttons and min/max clamps.
- **`FormLabel`**: Semantic label with optional required asterisk (`*`).
- **`FormError`**: Accessible error message with alert icon (`role="alert"`).
- **`FormHelperText`**: Contextual guidance text.

---

## 5. Data Visualization Components (`src/components/common/DataViz.tsx`)

- **`MetricDisplay`**: High-impact numerical display with prefix, suffix, and trend pill.
- **`TrendIndicator`**: Color-coded pill (+/-) with directional arrows.
- **`ProgressBar`**: Percentage bar with 6 brand color options and accessibility attributes.
- **`StatusBadge`**: Semantic status pill (`active`, `paused`, `draft`, `completed`, `warning`, `failed`).
- **`DataTable<T>`**: Sortable, responsive table with pagination controls and mobile responsiveness.
- **`EmptyState`**: Dashed border container with empty illustration, explanation, and action button.

---

## 6. Feedback Components (`src/components/common/Feedback.tsx`)

- **`ToastProvider` & `useToast()`**: Live viewport notification system supporting `success`, `warning`, `error`, and `info`.
- **`Tooltip`**: Accessible hover & focus tooltip with directional arrow.
- **`Modal`**: Accessible dialog with backdrop blur, keyboard ESC dismissal, and focus trapping.
- **`ConfirmationDialog`**: Specialized confirmation modal for destructive or permanent operations.
- **`LoadingSpinner`**: SVG spinner with brand styling and sizes (`sm`, `md`, `lg`).
- **`SkeletonLoader`**: Animated pulsing placeholder for text, cards, and charts.
- **`ErrorState`**: Error panel with retry button.

---

## 7. Marketing-Specific Components (`src/components/marketing/`)

- **`MarketingMetricCard`**: Comprehensive metric card with trend indicator and info tooltip.
- **`MarketingKPIBadge`**: KPI health pill with status dots (`optimal`, `at-risk`, `exceeding`, `underperforming`).
- **`MarketingRecommendationCard`**: Actionable growth recommendation with expected benefit summary.
- **`BudgetAllocationCard`**: Channel ad spend allocation with visual progress bar and target ROAS.
- **`CampaignStatusCard`**: Multi-platform ad set card with impressions, clicks, conversions, spend, and ROAS.
- **`AIAnalysisPanel`**: In-depth strategy card with model assumptions, confidence meter, and execution CTA.
- **`MarketingScoreCard`**: 100-point circular score widget with health evaluation and improvement steps.

---

## 8. Chart Design System (`src/components/charts/`)

- **`ChartContainer`**: Universal card wrapper for charts with demo data indicator and time filter slots.
- **`SparklineAreaChart`**: Recharts area chart with custom brand gradient fills and dark tooltips.
- **`SparklineLineChart`**: Multi-series line chart with configurable dash arrays and points.
- **`SparklineBarChart`**: Grouped or single bar chart with rounded tops.
- **`SparklineDonutChart`**: Donut chart with central metric value and legend.

