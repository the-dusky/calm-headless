/**
 * Simple script to check if Shopify API environment variables are set
 * This script loads environment variables from .env.local
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

function checkEnvVar(name) {
  return process.env[name] ? '✅ Set' : '❌ Missing';
}

function maskToken(token) {
  if (!token) return 'Not set';
  if (token.length <= 8) return '********';
  return token.substring(0, 4) + '...' + token.substring(token.length - 4);
}

console.log('Checking Shopify API credentials...');
console.log('-----------------------------------');
console.log('STOREFRONT API:');
console.log(`Store Domain: ${checkEnvVar('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN')} (${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'Not set'})`);
console.log(`Public Access Token: ${checkEnvVar('SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN')} (${maskToken(process.env.SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN)})`);
console.log(`Private Access Token: ${checkEnvVar('SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN')} (${maskToken(process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN)})`);

console.log('\nADMIN API:');
console.log(`Store Domain: ${checkEnvVar('NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN')} (${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'Not set'})`);
console.log(`Admin API Access Token: ${checkEnvVar('SHOPIFY_ADMIN_API_ACCESS_TOKEN')} (${maskToken(process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN)})`);

console.log('\nNote: This script only checks if the environment variables are set, not if they are valid.');
console.log('If all variables show as set but you still have authentication issues, verify the token values.');
