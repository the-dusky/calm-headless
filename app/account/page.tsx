import { redirect } from 'next/navigation';
import { getCustomer } from '@/lib/shopify/customer-account-api/actions';
import { isAuthenticated } from '@/lib/shopify/customer-account-api/auth';
import LogoutButton from '@/components/auth/LogoutButton';

export default async function AccountPage() {
  // Check if the user is authenticated
  if (!isAuthenticated()) {
    redirect('/api/auth/login?redirectTo=/account');
  }

  // Get the customer data
  const customer = await getCustomer();

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            My Account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your account settings and view your order history.
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your personal details and preferences.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {customer?.firstName} {customer?.lastName}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {customer?.email}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {customer?.phone || 'Not provided'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <a
            href="/account/orders"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View Order History
          </a>
          <a
            href="/account/addresses"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Manage Addresses
          </a>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
