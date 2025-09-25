# Development and Testing Guide

This guide covers how to develop and test the multi-tenant storefront application.

## Development Scripts

### Basic Development

```bash
# Start development server
npm run dev

# Start with Turbo (faster)
npm run dev:turbo

# Build for production
npm run build

# Start production server
npm start
```

### Code Quality

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type checking
npm run type-check

# Run all validations
npm run validate
```

### Tenant-Specific Development

```bash
# Start with specific tenant override (for testing)
npm run dev:abc      # InstaShop
npm run dev:xyz      # XYZ Cars
npm run dev:default  # Default tenant
```

### Testing

```bash
# Test tenant configurations
npm run test:config

# Clean build artifacts
npm run clean
```

## Multi-Tenant Testing

### Local Development URLs

Test different tenants using these URLs in development:

- **InstaShop**: http://abc-rentals.localhost:3000
- **XYZ Cars**: http://xyz-cars.localhost:3000
- **Test Rental Co**: http://test-rental.localhost:3000
- **Default**: http://localhost:3000

### Hosts File Configuration

For better local testing, add these entries to your `/etc/hosts` file:

```
127.0.0.1 abc-rentals.localhost
127.0.0.1 xyz-cars.localhost
127.0.0.1 test-rental.localhost
```

### Testing Checklist

When testing multi-tenant functionality, verify:

- [ ] Each tenant displays their unique branding colors
- [ ] Tenant-specific content appears correctly
- [ ] Navigation works across all pages
- [ ] Fallback to default tenant works for unknown subdomains
- [ ] Theme colors are applied consistently
- [ ] Contact information is tenant-specific
- [ ] Page titles and meta descriptions are customized

### Configuration Validation

Run the configuration test script to validate all tenant setups:

```bash
npm run test:config
```

This script will:

- Validate all tenant configuration files
- Check required fields and data types
- Test hostname extraction logic
- Verify theme color formats
- Ensure configuration consistency

### Adding New Tenants

1. Create a new configuration file in `config/tenants/`:

   ```json
   {
     "id": "new-tenant",
     "name": "New Tenant Name",
     "theme": {
       "primary": "#color",
       "secondary": "#color",
       "background": "#ffffff",
       "text": "#000000"
     },
     "content": {
       "hero": {
         "headline": "Your headline",
         "description": "Your description"
       },
       "about": {
         "title": "About title",
         "content": "About content"
       },
       "contact": {
         "phone": "+1-555-0000",
         "email": "contact@tenant.com",
         "address": "Address"
       }
     },
     "metadata": {
       "title": "Page title",
       "description": "Meta description"
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

3. Test the new tenant:

   ```bash
   npm run test:config
   ```

4. Access via: http://new-tenant.localhost:3000

### Environment Variables

For development, you can override tenant detection:

```bash
# Force a specific tenant
TENANT_OVERRIDE=abc-rentals npm run dev
```

### Debugging

Enable debug logging by setting:

```bash
DEBUG=tenant:* npm run dev
```

### Production Considerations

When deploying to production:

1. Update hostname patterns in middleware
2. Configure DNS for tenant subdomains
3. Set up SSL certificates for all subdomains
4. Update CORS settings if needed
5. Configure CDN for static assets

### Common Issues

**Issue**: Tenant not loading

- Check hostname spelling
- Verify tenant exists in `config/tenants.json`
- Run `npm run test:config` to validate configuration

**Issue**: Styles not applying

- Check theme color format (must be hex: #rrggbb)
- Verify CSS custom properties are being set
- Check browser developer tools for CSS variables

**Issue**: Content not displaying

- Verify all required content fields are present
- Check for JSON syntax errors
- Ensure fallback content is available

### Performance Tips

- Use `npm run dev:turbo` for faster development builds
- Run `npm run clean` if experiencing caching issues
- Use browser dev tools to monitor CSS custom property changes
- Test with network throttling to simulate real conditions
