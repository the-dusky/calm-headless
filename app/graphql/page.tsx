"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GraphQLPlayground() {
  const [query, setQuery] = useState<string>('');
  const [variables, setVariables] = useState<string>('{}');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [envStatus, setEnvStatus] = useState<{
    storeDomain: boolean;
    storefrontPublic: boolean;
    storefrontPrivate: boolean;
  }>({ storeDomain: false, storefrontPublic: false, storefrontPrivate: false });

  // Sample queries
  const sampleQueries = {
    products: `
# Get first 10 products with their details
{
  products(first: 10) {
    edges {
      node {
        id
        title
        description
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
      }
    }
  }
}`,
    collections: `
# Get first 10 collections with their details
{
  collections(first: 10) {
    edges {
      node {
        id
        title
        description
        handle
        image {
          url
          altText
        }
        products(first: 5) {
          edges {
            node {
              title
              handle
            }
          }
        }
      }
    }
  }
}`,
    customerLogin: `
# Customer login mutation (requires email and password)
mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}

# Variables:
# {
#   "input": {
#     "email": "customer@example.com",
#     "password": "password123"
#   }
# }
`,
    cart: `
# Create a cart and add items
mutation cartCreate($input: CartInput!) {
  cartCreate(input: $input) {
    cart {
      id
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  title
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}

# Variables:
# {
#   "input": {
#     "lines": [
#       {
#         "quantity": 1,
#         "merchandiseId": "gid://shopify/ProductVariant/12345678901234"
#       }
#     ]
#   }
# }
`
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleVariablesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setVariables(e.target.value);
  };

  const handleSampleQuery = (queryType: string) => {
    if (queryType in sampleQueries) {
      setQuery(sampleQueries[queryType as keyof typeof sampleQueries]);
    }
  };

  useEffect(() => {
    // Set a default query when component mounts
    setQuery(sampleQueries.products);
    
    // Check environment variables
    checkEnvironmentVariables();
  }, []);

  // Function to check environment variables
  const checkEnvironmentVariables = async () => {
    try {
      const response = await fetch('/api/test-env');
      const data = await response.json();
      
      setEnvStatus({
        storeDomain: data.shopify.storeDomain !== 'Not set',
        storefrontPublic: data.shopify.storefrontPublicToken !== 'Not set',
        storefrontPrivate: data.shopify.storefrontPrivateToken !== 'Not set',
      });
    } catch (err) {
      console.error('Error checking environment variables:', err);
    }
  };

  const executeQuery = async () => {
    if (!query.trim()) {
      setError('Please enter a GraphQL query');
      return;
    }

    setLoading(true);
    setError(null);
    setResult('');
    
    try {
      let parsedVariables = {};
      try {
        parsedVariables = variables ? JSON.parse(variables) : {};
      } catch (err) {
        setError('Invalid JSON in variables');
        setLoading(false);
        return;
      }

      console.log('Executing Storefront API query via server endpoint...');
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: parsedVariables
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          const errorMessages = Array.isArray(errorData.errors)
            ? errorData.errors.map((e: any) => e.message || JSON.stringify(e)).join('\n')
            : JSON.stringify(errorData.errors);
          throw new Error(`GraphQL Error: ${errorMessages}`);
        } else if (errorData.error) {
          throw new Error(`API Error: ${errorData.error}`);
        } else {
          throw new Error(`HTTP Error ${response.status}`);
        }
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Error executing query:', err);
      setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline mb-2 inline-block">
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold">GraphQL Playground</h1>
        <p className="text-gray-600 mt-2">
          Test your GraphQL queries against the Shopify Storefront API
        </p>
        
        {/* Environment Configuration Status */}
        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <h2 className="text-md font-semibold mb-2">Environment Configuration Status</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <span className={`inline-block w-4 h-4 rounded-full mr-2 ${envStatus.storeDomain ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Store Domain</span>
            </div>
            <div className="flex items-center">
              <span className={`inline-block w-4 h-4 rounded-full mr-2 ${envStatus.storefrontPublic ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Storefront Public Token</span>
            </div>
            <div className="flex items-center">
              <span className={`inline-block w-4 h-4 rounded-full mr-2 ${envStatus.storefrontPrivate ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Storefront Private Token</span>
            </div>
          </div>
          {(!envStatus.storeDomain || !envStatus.storefrontPublic || !envStatus.storefrontPrivate) && (
            <div className="mt-2 text-sm text-red-600">
              Missing environment variables detected. Please check your .env.local file.
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Sample Queries</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSampleQuery('products')}
            className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
          >
            Products
          </button>
          <button
            onClick={() => handleSampleQuery('collections')}
            className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
          >
            Collections
          </button>
          <button
            onClick={() => handleSampleQuery('customerLogin')}
            className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
          >
            Customer Login
          </button>
          <button
            onClick={() => handleSampleQuery('cart')}
            className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
          >
            Cart
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
              GraphQL Query
            </label>
            <textarea
              id="query"
              value={query}
              onChange={handleQueryChange}
              className="w-full h-80 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your GraphQL query here..."
            />
          </div>

          <div className="mb-4">
            <label htmlFor="variables" className="block text-sm font-medium text-gray-700 mb-1">
              Variables (JSON)
            </label>
            <textarea
              id="variables"
              value={variables}
              onChange={handleVariablesChange}
              className="w-full h-32 p-3 border border-gray-300 rounded-md font-mono text-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder='{"key": "value"}'
            />
          </div>

          <button
            onClick={executeQuery}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Executing...' : 'Execute Query'}
          </button>
        </div>

        <div>
          <div className="mb-2 flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Result</label>
            {result && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result);
                }}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Copy to clipboard
              </button>
            )}
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}
          <div className="w-full h-[500px] p-3 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm overflow-auto">
            <pre>{result || 'Execute a query to see results here...'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
