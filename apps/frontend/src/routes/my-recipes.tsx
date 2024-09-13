import React from 'react';
import { Container, Title } from '@mantine/core';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { CardGrid } from '../components/grid';

export const Route = createFileRoute('/my-recipes')({
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
  component: MyRecipes,
});

function MyRecipes(): JSX.Element {
  return (
    <Container>
      <Title order={2}>My Recipes</Title>
      <CardGrid />
    </Container>
  );
}

export default MyRecipes;
