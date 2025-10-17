# LLM HTML Dashboard Style Guide
## Ultra-Compact Pastel Glassmorphic Aesthetic

### 🎯 MANDATORY DESIGN PRINCIPLES

#### 1. MAXIMUM DATA DENSITY
- **Never waste vertical space** - Pack information tightly with minimal gaps
- **Use every pixel efficiently** - Inline visualizations, condensed layouts
- **Multi-column approach** - 2-4 columns based on content width
- **Collapsible sections** - Use `<details>` for expandable content areas
- **Tabbed interfaces** - For organizing related data groups

#### 2. ULTRA-COMPACT SPACING
```css
/* MANDATORY SPACING VALUES */
--micro-gap: 4px;          /* Between related elements */
--small-gap: 8px;          /* Between form elements */
--section-gap: 12px;       /* Between logical sections */
--row-height: 20px;        /* Standard row height */
--compact-row: 16px;       /* Ultra-compact row height */
--section-padding: 16px;   /* Internal section padding */
```

#### 3. PASTEL ON DARK FOUNDATION
```css
/* CORE COLOR PALETTE - NEVER DEVIATE */
--bg-primary: #0a0a0f;        /* Main background */
--bg-secondary: #151520;      /* Card backgrounds */
--bg-tertiary: #1a1a2e;       /* Input/section backgrounds */

/* PASTEL ACCENT COLORS */
--pastel-blue: #87ceeb;       /* Primary accent */
--pastel-green: #98fb98;      /* Success/positive */
--pastel-pink: #ffb6c1;       /* Secondary accent */
--pastel-purple: #dda0dd;     /* Tertiary accent */
--pastel-yellow: #f0e68c;     /* Warning/highlight */
--pastel-orange: #ffa07a;     /* Alert/attention */

/* TEXT COLORS */
--text-primary: #e8e8f0;      /* Main text */
--text-secondary: #a0a0b0;    /* Secondary text */
--text-muted: #70707a;        /* Muted/helper text */
```

### 🪟 GLASSMORPHIC FOUNDATION

#### Base Card Structure
```css
.glass-card {
    background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.05) 0%, 
        rgba(255, 255, 255, 0.02) 100%);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 8px;
    padding: var(--section-padding);
    margin-bottom: var(--section-gap);
}
```

#### Glass Variants
```css
.glass-input {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    border-radius: 4px;
    padding: 6px 10px;
    height: var(--row-height);
}

.glass-button {
    background: linear-gradient(135deg, 
        rgba(135, 206, 235, 0.2) 0%, 
        rgba(135, 206, 235, 0.1) 100%);
    border: 1px solid var(--pastel-blue);
    backdrop-filter: blur(10px);
    border-radius: 4px;
    padding: 4px 12px;
    color: var(--pastel-blue);
    transition: all 0.2s ease;
}
```

### 📊 INLINE VISUALIZATION REQUIREMENTS

#### Mini Progress Bars
```css
.mini-progress {
    width: 60px;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
    margin: 0 8px;
}

.mini-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--pastel-green), var(--pastel-blue));
    transition: width 0.3s ease;
}
```

#### Micro Charts (Sparklines)
```css
.sparkline {
    width: 80px;
    height: 16px;
    display: inline-block;
    vertical-align: middle;
    margin: 0 6px;
}

.micro-donut {
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
    margin: 0 4px;
}
```

#### Status Indicators
```css
.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 6px;
    vertical-align: middle;
}

.status-online { background: var(--pastel-green); }
.status-warning { background: var(--pastel-yellow); }
.status-error { background: var(--pastel-orange); }
.status-offline { background: var(--text-muted); }
```

### 🏗️ LAYOUT STRUCTURE

#### Standard HTML Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Title</title>
    <style>
        /* Include all CSS rules from this guide */
    </style>
</head>
<body class="dashboard-body">
    <div class="dashboard-container">
        <header class="dashboard-header">
            <h1>Dashboard Title</h1>
            <div class="header-controls"><!-- Quick actions --></div>
        </header>
        
        <main class="dashboard-grid">
            <section class="glass-card"><!-- Content --></section>
        </main>
    </div>
</body>
</html>
```

#### Responsive Grid System
```css
.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--section-gap);
    padding: var(--section-gap);
}

@media (min-width: 1200px) {
    .dashboard-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1600px) {
    .dashboard-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
```

#### Collapsible Sections
```html
<details class="glass-details" open>
    <summary class="glass-summary">
        <span>Section Title</span>
        <div class="summary-indicators">
            <span class="status-dot status-online"></span>
            <span class="mini-metric">142</span>
        </div>
    </summary>
    <div class="details-content">
        <!-- Ultra-compact content -->
    </div>
</details>
```

### 📋 DATA PRESENTATION PATTERNS

#### Compact Tables
```css
.compact-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
}

.compact-table th,
.compact-table td {
    padding: 4px 8px;
    height: var(--row-height);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    text-align: left;
    vertical-align: middle;
}

.compact-table th {
    background: rgba(255, 255, 255, 0.02);
    color: var(--text-secondary);
    font-weight: 500;
}
```

#### Key-Value Pairs
```css
.kv-pair {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: var(--row-height);
    padding: 2px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.kv-key {
    color: var(--text-secondary);
    font-size: 0.85rem;
}

.kv-value {
    color: var(--text-primary);
    font-weight: 500;
    font-size: 0.9rem;
}
```

#### Metric Cards
```html
<div class="metric-card">
    <div class="metric-header">
        <span class="metric-label">Revenue</span>
        <span class="metric-change">+12%</span>
    </div>
    <div class="metric-value">$45,678</div>
    <div class="metric-visual">
        <div class="mini-progress">
            <div class="mini-progress-fill" style="width: 75%"></div>
        </div>
        <span class="metric-target">Goal: $60k</span>
    </div>
</div>
```

### 🎨 COLOR USAGE RULES

#### Color Assignment Logic
- **Blue (--pastel-blue)**: Primary actions, links, main metrics
- **Green (--pastel-green)**: Success states, positive trends, online status
- **Pink (--pastel-pink)**: Secondary highlights, user-related items
- **Purple (--pastel-purple)**: Special categories, premium features
- **Yellow (--pastel-yellow)**: Warnings, pending states, attention items
- **Orange (--pastel-orange)**: Errors, critical alerts, negative trends

#### Gradient Applications
```css
.gradient-blue { background: linear-gradient(135deg, var(--pastel-blue), var(--pastel-purple)); }
.gradient-green { background: linear-gradient(135deg, var(--pastel-green), var(--pastel-blue)); }
.gradient-warm { background: linear-gradient(135deg, var(--pastel-pink), var(--pastel-orange)); }
```

### 🔧 INTERACTIVE ELEMENTS

#### Form Controls
```css
.form-group {
    display: flex;
    flex-direction: column;
    gap: var(--micro-gap);
    margin-bottom: var(--small-gap);
}

.form-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
    margin-bottom: 2px;
}

.form-inline {
    display: flex;
    align-items: center;
    gap: var(--small-gap);
    flex-wrap: wrap;
}
```

#### Tabs System
```css
.tab-container {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: var(--section-gap);
}

.tab-list {
    display: flex;
    gap: var(--micro-gap);
}

.tab-button {
    background: none;
    border: none;
    padding: 6px 12px;
    color: var(--text-secondary);
    border-radius: 4px 4px 0 0;
    cursor: pointer;
    transition: all 0.2s ease;
}

.tab-button.active {
    background: var(--bg-tertiary);
    color: var(--pastel-blue);
    border-bottom: 2px solid var(--pastel-blue);
}
```

### 🚫 FORBIDDEN PRACTICES

#### Never Use
- Large margins or padding (>20px)
- Bright, saturated colors on dark backgrounds
- White or light backgrounds
- Card shadows (use glassmorphic borders instead)
- Icons without text unless absolutely necessary
- Single-column layouts on desktop
- Empty whitespace
- Traditional material design patterns
- Bootstrap or similar framework styles

#### Typography Don'ts
- Font sizes larger than 1.2rem for body text
- Font weights heavier than 600
- Line heights greater than 1.4
- Letter spacing wider than 0.02em

### ✅ VALIDATION CHECKLIST

#### Before Delivery, Verify:
- [ ] Dark background (#0a0a0f) is used
- [ ] All cards have glassmorphic styling with backdrop-filter
- [ ] Spacing uses only defined CSS custom properties
- [ ] Colors are exclusively from the pastel palette
- [ ] No element has padding/margin >20px
- [ ] Inline visualizations are present for metrics
- [ ] Multi-column layout is implemented
- [ ] Collapsible sections using `<details>` are included
- [ ] Text is compact and efficiently laid out
- [ ] All interactive elements have hover states
- [ ] Responsive grid adapts to screen sizes
- [ ] No forbidden practices are present

#### Performance Requirements
- [ ] CSS is inlined (no external stylesheets)
- [ ] No JavaScript dependencies unless absolutely necessary
- [ ] Images are optimized or replaced with CSS graphics
- [ ] File size under 50KB total

### 📝 IMPLEMENTATION NOTES

#### JavaScript Integration
When JavaScript is required:
```javascript
// Use vanilla JS, avoid frameworks
// Keep it minimal and efficient
document.addEventListener('DOMContentLoaded', function() {
    // Initialize interactive elements
    initializeTabs();
    updateRealTimeMetrics();
});
```

#### Animation Guidelines
```css
/* Subtle animations only */
.fade-in { animation: fadeIn 0.3s ease-in; }
.slide-up { animation: slideUp 0.2s ease-out; }

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
```

### 🎯 FINAL REMINDERS

1. **Data density is king** - Pack maximum information in minimum space
2. **Glassmorphic effects are mandatory** - Every card needs backdrop-filter
3. **Pastel colors only** - Never deviate from the defined palette
4. **4px gaps are standard** - Maintain ultra-compact spacing
5. **Inline visuals everywhere** - Progress bars, dots, mini charts
6. **Multi-column responsive** - Never waste horizontal space
7. **Dark foundation always** - Light themes are forbidden

This style guide ensures consistent, ultra-compact, pastel glassmorphic dashboards that maximize information density while maintaining visual elegance.