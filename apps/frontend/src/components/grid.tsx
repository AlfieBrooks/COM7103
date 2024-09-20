import React from 'react';
import { SimpleGrid, Container } from '@mantine/core';
import { ImageCard } from './card';
import { CustomRecipe } from '../types/recipes';

type RecipeList = {
  recipes: readonly CustomRecipe[];
};

export function CardGrid({ recipes }: RecipeList): JSX.Element {
  const cards = recipes.map((recipe) => (
    <ImageCard
      key={recipe.id}
      id={recipe.id}
      title={recipe.title}
      image={recipe.image}
      date={recipe.createdAt}
      isPending={recipe.isPending}
    />
  ));

  return (
    <Container py="xl">
      <SimpleGrid cols={{ base: 1, sm: 2 }}>{cards}</SimpleGrid>
    </Container>
  );
}
