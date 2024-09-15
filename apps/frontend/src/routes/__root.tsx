import React from 'react';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { Header } from '../components/header';
import { QueryClient } from '@tanstack/react-query';
import { Session } from '@supabase/supabase-js';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRouteWithContext<{
  auth: Session;
  queryClient: QueryClient;
}>()({
  loader: ({ context }) => context.auth.user.user_metadata,
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    );
  },
});

function RootComponent() {
  const user = Route.useLoaderData();

  return (
    <>
      <Header user={user} />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
