import React from 'react';
import { Container, Title } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import { getRecipe } from '../../queries/get-recipe';
import { RecipeDetails } from '../../components/recipe';

export const Route = createFileRoute('/recipes/$id')({
  component: Recipe,
  loader: ({ context: { queryClient }, params: { id } }) => queryClient.ensureQueryData(getRecipe(id)),
});

function Recipe(): JSX.Element {
  const { data: recipe } = Route.useLoaderData();
  console.log('Log ~ Index ~ recipes:', recipe);

  return (
    <Container>
      {/* <Title order={2}></Title> */}
      <RecipeDetails recipe={recipe.data} />
    </Container>
  );
}
