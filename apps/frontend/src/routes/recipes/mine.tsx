import React from 'react';
import { Container, Title } from '@mantine/core';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { CardGrid } from '../../components/grid';
import { getUserRecipes } from '../../queries/get-user-recipes';

export const Route = createFileRoute('/recipes/mine')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  loader: ({ context: { queryClient, auth } }) => queryClient.ensureQueryData(getUserRecipes(auth.access_token)),
  component: MyRecipes,
});

function MyRecipes(): JSX.Element {
  const { data: recipes } = Route.useLoaderData();
  console.log('Log ~ Index ~ recipes:', recipes);

  return (
    <Container>
      <Title order={2}>My Recipes{recipes.count ? ` (${recipes.count})` : ''}</Title>
      <CardGrid recipes={recipes.data} />
    </Container>
  );
}
