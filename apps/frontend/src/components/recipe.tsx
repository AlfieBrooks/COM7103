import React from 'react';
import { Card, Text, Group, Image, Title, Grid } from '@mantine/core';
import styles from './recipe.module.css';
import { Recipe } from '../types/recipes';

interface RecipeDetailsProps {
  readonly recipe: Recipe;
}

export function RecipeDetails({ recipe }: RecipeDetailsProps): JSX.Element {
  const { id, title, createdAt: date, ingredients, instructions } = recipe;
  const imageUrl = `${import.meta.env.VITE_IMAGE_URL}/recipe-image/${id}`;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={imageUrl} alt={title} height={280} />
      </Card.Section>

      <Group align="apart" mt="md" mb="xs">
        <Title order={2}>{title}</Title>
      </Group>

      <Text size="sm" c="dimmed">
        {new Date(date).toDateString()}
      </Text>

      <Grid mt="md">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Title order={3} mb="md">
            Ingredients
          </Title>
          <ul>
            {ingredients.map((ingredient) => (
              <li key={ingredient}>
                <Text size="sm">{ingredient}</Text>
              </li>
            ))}
          </ul>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Title order={3} mb="md">
            Instructions
          </Title>
          <Text size="sm" className={styles.instructions}>
            {instructions}
          </Text>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
