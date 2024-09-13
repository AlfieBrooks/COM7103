import React from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { Header } from '../components/header';

export const Route = createRootRoute({
  loader: ({ context }) => context.auth.user.user_metadata,
  component: RouteComponent,
});

function RouteComponent() {
  const user = Route.useLoaderData();

  return (
    <>
      <Header user={user} />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
