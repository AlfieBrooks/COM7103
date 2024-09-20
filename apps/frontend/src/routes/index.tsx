import React from 'react';
import { Container, Title } from '@mantine/core';
import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import { CardGrid } from '../components/grid';
import { getRecipes } from '../queries/get-recipes';

export const Route = createFileRoute('/')({
  component: Index,
  loader: ({ context: { queryClient } }) => queryClient.ensureQueryData(getRecipes),
  errorComponent: ({ error }) => {
    return <ErrorComponent error={error} />;
  },
});

function Index(): JSX.Element {
  const { data: recipes } = Route.useLoaderData();
  console.log('Log ~ Index ~ recipes:', recipes);

  return (
    <Container>
      <Title order={2}>All Recipes{recipes.count ? ` (${recipes.count})` : ''}</Title>
      <CardGrid recipes={recipes.data} />
    </Container>
  );
}
