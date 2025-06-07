import type { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN;

if (!storeDomain || !accessToken) {
  console.error('Missing required environment variables for GraphQL codegen');
  console.error('Make sure NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN are set in .env.local');
  process.exit(1);
}

const config: CodegenConfig = {
  schema: {
    [`https://${storeDomain}/api/2025-04/graphql.json`]: {
      headers: {
        'X-Shopify-Storefront-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    },
  },
  documents: ['lib/shopify/queries.ts'],
  generates: {
    './lib/shopify/generated/': {
      preset: 'client',
      plugins: [
        'typescript',
        'typescript-operations',
      ],
      config: {
        avoidOptionals: true,
        skipTypename: false,
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
  },
};

export default config;
