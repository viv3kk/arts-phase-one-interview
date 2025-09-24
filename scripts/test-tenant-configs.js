#!/usr/bin/env node

/**
 * Test script for validating tenant configurations
 * This script validates all tenant configurations and tests the multi-tenant functionality
 */

const fs = require('fs')
const path = require('path')

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
}

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function validateTenantConfig(config, tenantId) {
  const errors = []
  const warnings = []

  // Required fields validation
  if (!config.id) errors.push('Missing required field: id')
  if (!config.name) errors.push('Missing required field: name')
  if (!config.theme) errors.push('Missing required field: theme')
  if (!config.content) errors.push('Missing required field: content')
  if (!config.metadata) errors.push('Missing required field: metadata')

  // Theme validation
  if (config.theme) {
    const requiredThemeFields = ['primary', 'secondary', 'background', 'text']
    requiredThemeFields.forEach(field => {
      if (!config.theme[field]) {
        errors.push(`Missing required theme field: ${field}`)
      } else if (!/^#[0-9a-fA-F]{6}$/.test(config.theme[field])) {
        warnings.push(
          `Invalid color format for theme.${field}: ${config.theme[field]}`,
        )
      }
    })
  }

  // Content validation
  if (config.content) {
    if (!config.content.hero)
      errors.push('Missing required field: content.hero')
    if (!config.content.about)
      errors.push('Missing required field: content.about')
    if (!config.content.contact)
      warnings.push('Missing optional field: content.contact')

    if (config.content.hero) {
      if (!config.content.hero.headline)
        errors.push('Missing required field: content.hero.headline')
      if (!config.content.hero.description)
        errors.push('Missing required field: content.hero.description')
    }

    if (config.content.about) {
      if (!config.content.about.title)
        errors.push('Missing required field: content.about.title')
      if (!config.content.about.content)
        errors.push('Missing required field: content.about.content')
    }
  }

  // Metadata validation
  if (config.metadata) {
    if (!config.metadata.title)
      errors.push('Missing required field: metadata.title')
    if (!config.metadata.description)
      errors.push('Missing required field: metadata.description')

    // SEO validation
    if (config.metadata.seo) {
      const seo = config.metadata.seo

      // Keywords validation
      if (seo.keywords && !Array.isArray(seo.keywords)) {
        errors.push('SEO keywords must be an array')
      }

      // Favicon validation
      if (seo.favicon && typeof seo.favicon !== 'string') {
        errors.push('SEO favicon must be a string path')
      }

      // Open Graph validation
      if (seo.openGraph) {
        if (seo.openGraph.image && typeof seo.openGraph.image !== 'string') {
          errors.push('Open Graph image must be a string URL')
        }
        if (
          seo.openGraph.type &&
          !['website', 'article', 'profile'].includes(seo.openGraph.type)
        ) {
          warnings.push(
            `Open Graph type "${seo.openGraph.type}" may not be optimal for car rental sites`,
          )
        }
      }

      // Twitter validation
      if (seo.twitter) {
        if (
          seo.twitter.card &&
          !['summary', 'summary_large_image'].includes(seo.twitter.card)
        ) {
          warnings.push(
            `Twitter card type "${seo.twitter.card}" may not be optimal`,
          )
        }
      }

      // Canonical base validation
      if (seo.canonicalBase && !seo.canonicalBase.startsWith('http')) {
        errors.push(
          'Canonical base must be a full URL starting with http/https',
        )
      }
    }
  }

  // ID consistency check
  if (config.id && config.id !== tenantId) {
    warnings.push(
      `Config ID (${config.id}) doesn't match tenant ID (${tenantId})`,
    )
  }

  return { errors, warnings }
}

function testTenantConfigurations() {
  log('🧪 Testing Tenant Configurations', colors.blue)
  log('================================', colors.blue)

  const configDir = path.join(process.cwd(), 'config')
  const tenantsFile = path.join(configDir, 'tenants.json')
  const tenantsDir = path.join(configDir, 'tenants')

  // Check if main config files exist
  if (!fs.existsSync(tenantsFile)) {
    log('❌ Main tenants.json file not found', colors.red)
    return false
  }

  if (!fs.existsSync(tenantsDir)) {
    log('❌ Tenants directory not found', colors.red)
    return false
  }

  let allValid = true

  try {
    // Load main tenants configuration
    const tenantsConfig = JSON.parse(fs.readFileSync(tenantsFile, 'utf8'))
    log('✅ Main tenants.json loaded successfully', colors.green)

    // Test default configuration
    const defaultConfigFile = path.join(tenantsDir, tenantsConfig.default)
    if (fs.existsSync(defaultConfigFile)) {
      try {
        const defaultConfig = JSON.parse(
          fs.readFileSync(defaultConfigFile, 'utf8'),
        )
        const validation = validateTenantConfig(defaultConfig, 'default')

        log(
          `\n📋 Testing default configuration (${tenantsConfig.default}):`,
          colors.blue,
        )
        if (validation.errors.length === 0) {
          log('  ✅ Default configuration is valid', colors.green)
        } else {
          log('  ❌ Default configuration has errors:', colors.red)
          validation.errors.forEach(error => log(`    - ${error}`, colors.red))
          allValid = false
        }

        if (validation.warnings.length > 0) {
          log('  ⚠️  Warnings:', colors.yellow)
          validation.warnings.forEach(warning =>
            log(`    - ${warning}`, colors.yellow),
          )
        }
      } catch (error) {
        log(`  ❌ Error parsing default config: ${error.message}`, colors.red)
        allValid = false
      }
    } else {
      log(
        `❌ Default configuration file not found: ${defaultConfigFile}`,
        colors.red,
      )
      allValid = false
    }

    // Test individual tenant configurations
    for (const [tenantId, tenantInfo] of Object.entries(
      tenantsConfig.tenants,
    )) {
      const configFile = path.join(tenantsDir, tenantInfo.configFile)

      log(`\n📋 Testing tenant: ${tenantId} (${tenantInfo.name})`, colors.blue)

      if (!fs.existsSync(configFile)) {
        log(`  ❌ Configuration file not found: ${configFile}`, colors.red)
        allValid = false
        continue
      }

      try {
        const config = JSON.parse(fs.readFileSync(configFile, 'utf8'))
        const validation = validateTenantConfig(config, tenantId)

        if (validation.errors.length === 0) {
          log('  ✅ Configuration is valid', colors.green)
        } else {
          log('  ❌ Configuration has errors:', colors.red)
          validation.errors.forEach(error => log(`    - ${error}`, colors.red))
          allValid = false
        }

        if (validation.warnings.length > 0) {
          log('  ⚠️  Warnings:', colors.yellow)
          validation.warnings.forEach(warning =>
            log(`    - ${warning}`, colors.yellow),
          )
        }

        // Test theme colors
        if (config.theme) {
          log(`  🎨 Theme colors:`, colors.blue)
          log(`    Primary: ${config.theme.primary}`, colors.reset)
          log(`    Secondary: ${config.theme.secondary}`, colors.reset)
        }
      } catch (error) {
        log(`  ❌ Error parsing config: ${error.message}`, colors.red)
        allValid = false
      }
    }
  } catch (error) {
    log(`❌ Error loading main configuration: ${error.message}`, colors.red)
    return false
  }

  log('\n' + '='.repeat(50), colors.blue)
  if (allValid) {
    log('🎉 All tenant configurations are valid!', colors.green)
  } else {
    log(
      '❌ Some configurations have errors. Please fix them before proceeding.',
      colors.red,
    )
  }

  return allValid
}

function testHostnameExtraction() {
  log('\n🌐 Testing Hostname Extraction Logic', colors.blue)
  log('====================================', colors.blue)

  // Test cases for hostname extraction
  const testCases = [
    { hostname: 'abc-rentals.localhost:3000', expected: 'abc-rentals' },
    { hostname: 'xyz-cars.localhost:3000', expected: 'xyz-cars' },
    { hostname: 'test-rental.localhost:3000', expected: 'test-rental' },
    { hostname: 'localhost:3000', expected: 'default' },
    { hostname: 'abc-rentals.yourdomain.com', expected: 'abc-rentals' },
    { hostname: 'unknown-tenant.localhost:3000', expected: 'default' },
    { hostname: '', expected: 'default' },
  ]

  // Simple hostname extraction logic (matches the middleware logic)
  function extractTenantFromHostname(hostname) {
    if (!hostname) return 'default'

    const parts = hostname.split('.')
    if (parts.length < 2) return 'default'

    const subdomain = parts[0]

    // Check if subdomain is a known tenant
    const tenantsConfig = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'config', 'tenants.json'),
        'utf8',
      ),
    )
    if (tenantsConfig.tenants[subdomain]) {
      return subdomain
    }

    return 'default'
  }

  let allPassed = true

  testCases.forEach(({ hostname, expected }) => {
    const result = extractTenantFromHostname(hostname)
    const passed = result === expected

    if (passed) {
      log(`  ✅ ${hostname} → ${result}`, colors.green)
    } else {
      log(`  ❌ ${hostname} → ${result} (expected: ${expected})`, colors.red)
      allPassed = false
    }
  })

  log('\n' + '='.repeat(50), colors.blue)
  if (allPassed) {
    log('🎉 All hostname extraction tests passed!', colors.green)
  } else {
    log('❌ Some hostname extraction tests failed.', colors.red)
  }

  return allPassed
}

function main() {
  log('🚀 Multi-Tenant Configuration Test Suite', colors.blue)
  log('=========================================', colors.blue)

  const configValid = testTenantConfigurations()
  const hostnameValid = testHostnameExtraction()

  log('\n📊 Test Summary:', colors.blue)
  log('===============', colors.blue)
  log(
    `Configuration Tests: ${configValid ? '✅ PASSED' : '❌ FAILED'}`,
    configValid ? colors.green : colors.red,
  )
  log(
    `Hostname Tests: ${hostnameValid ? '✅ PASSED' : '❌ FAILED'}`,
    hostnameValid ? colors.green : colors.red,
  )

  const overallSuccess = configValid && hostnameValid
  log(
    `\nOverall Result: ${overallSuccess ? '🎉 SUCCESS' : '❌ FAILURE'}`,
    overallSuccess ? colors.green : colors.red,
  )

  if (overallSuccess) {
    log('\n💡 Next steps:', colors.blue)
    log('- Run `npm run dev` to start the development server', colors.reset)
    log('- Test different tenants using:', colors.reset)
    log('  • http://abc-rentals.localhost:3000', colors.reset)
    log('  • http://xyz-cars.localhost:3000', colors.reset)
    log('  • http://test-rental.localhost:3000', colors.reset)
    log('  • http://localhost:3000 (default)', colors.reset)
  }

  process.exit(overallSuccess ? 0 : 1)
}

if (require.main === module) {
  main()
}
