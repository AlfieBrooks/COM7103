import React from 'react';
import { SimpleGrid, Container } from '@mantine/core';
import { ImageCard } from './card';
import { Recipe } from '../types/recipes';

type RecipeList = {
  recipes: readonly Recipe[];
};

export function CardGrid({ recipes }: RecipeList): JSX.Element {
  const cards = recipes.map((recipe) => (
    <ImageCard
      key={recipe.id}
      id={recipe.id}
      title={recipe.title}
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
