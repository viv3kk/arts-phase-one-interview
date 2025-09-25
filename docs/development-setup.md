# Multi-Tenant Storefront - Development Guide

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and test different tenants:

### Testing Different Tenants

#### Method 1: Query Parameter (Easiest for development)

- Default tenant: http://localhost:3000
- InstaShop: http://localhost:3000?tenant=abc-rentals
- XYZ Cars: http://localhost:3000?tenant=xyz-cars

#### Method 2: Subdomain (Production-like)

Add these entries to your `/etc/hosts` file:

```
127.0.0.1 abc-rentals.localhost
127.0.0.1 xyz-cars.localhost
```

Then visit:

- Default: http://localhost:3000
- InstaShop: http://abc-rentals.localhost:3000
- XYZ Cars: http://xyz-cars.localhost:3000

## Theme System (Tailwind v4)

This project uses **Tailwind v4's CSS-first configuration** with semantic design tokens for multi-tenant theming.

### Semantic Design Tokens

- `--color-primary`: Main brand color
- `--color-secondary`: Accent/secondary brand color
- `--color-background`: Page background
- `--color-surface`: Cards, modals, elevated surfaces
- `--color-text`: Primary text color
- `--color-muted`: Subdued/secondary text
- `--color-border`: Border color
- `--color-primary-hover`: Interactive hover states
- `--color-secondary-hover`: Secondary hover states
- `--font-body`: Body/paragraph font
- `--font-heading`: Titles/headings font

### Usage in Components

#### Semantic Tailwind Classes (Recommended)

```jsx
<button className="bg-primary text-background hover:bg-primary-hover">
  Primary Button
</button>

<h1 className="text-primary font-heading">
  Primary Heading
</h1>

<div className="bg-surface border border-border p-4">
  <p className="text-text font-body">Content</p>
  <p className="text-muted">Secondary text</p>
</div>
```

#### Direct CSS Variables (For custom styling)

```jsx
<div style={{ backgroundColor: 'var(--color-primary)' }}>
  Custom styled element
</div>
```

### Why Semantic Naming?

- **Reusable**: `bg-primary` works for any tenant
- **Maintainable**: No tenant-specific class names
- **Flexible**: Easy to add new tenants without code changes
- **Standard**: Follows design system best practices

## Tenant Configuration

Tenant configurations are stored in `config/tenants/`:

- `config/tenants.json` - Registry of all tenants
- `config/tenants/default.json` - Default fallback configuration
- `config/tenants/abc-rentals.json` - InstaShop configuration
- `config/tenants/xyz-cars.json` - XYZ Cars configuration

### Adding a New Tenant

1. Create a new configuration file in `config/tenants/`:

```json
{
  "id": "new-tenant",
  "name": "New Tenant Name",
  "theme": {
    "primary": "#3b82f6",
    "secondary": "#6b7280",
    "background": "#ffffff",
    "text": "#1f2937"
  },
  "content": {
    "hero": {
      "headline": "Welcome to New Tenant",
      "description": "Your description here"
    },
    "about": {
      "title": "About Us",
      "content": "About content here"
    },
    "contact": {
      "phone": "+1-555-0000",
      "email": "info@newtenant.com"
    }
  },
  "metadata": {
    "title": "New Tenant - Car Rentals",
    "description": "New tenant description"
  }
}
```

2. Add the tenant to `config/tenants.json`:

```json
{
  "tenants": {
    "new-tenant": {
      "id": "new-tenant",
      "name": "New Tenant Name",
      "status": "active",
      "configFile": "new-tenant.json"
    }
  }
}
```

3. Test with: http://localhost:3000?tenant=new-tenant

## Testing

Run the theme configuration test:

```bash
node test-theme.js
```

This will validate all tenant configurations and show their theme colors.

## Troubleshooting

### Buttons Not Visible

If buttons appear invisible, check:

1. CSS custom properties are being set correctly
2. Theme validation is passing
3. Browser developer tools show the CSS variables

### Theme Not Updating

1. Check that the tenant ID is being detected correctly
2. Verify the tenant configuration file exists and is valid
3. Check browser console for any JavaScript errors

### Tailwind Classes Not Working

With Tailwind v4, classes are auto-generated from `@theme` in globals.css:

```css
/* globals.css */
@theme {
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  /* ... other tokens */
}
```

This automatically creates utilities like `bg-primary`, `text-secondary`, etc.
Make sure CSS custom properties are being set correctly in the document root.
