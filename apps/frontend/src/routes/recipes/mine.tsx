import React, { useEffect, useState } from 'react';
import { Container, Title, Text, Center, Loader } from '@mantine/core';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { QueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CardGrid } from '../../components/grid';
import { RecipeResponse } from '../../queries/get-user-recipes';
import { Recipe } from '../../types/recipes';

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
  component: MyRecipes,
  errorComponent: () => {
    return (
      <Container>
        <Title order={2}>No Recipes Found</Title>
        <Link to="/recipes/create">Create a new recipe</Link>
      </Container>
    );
  },
});

function MyRecipes(): JSX.Element {
  const [pendingRecipes, setPendingRecipes] = useState<Recipe[]>([]);
  const [completedRecipes, setCompletedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = Route.useRouteContext();
  const { data: recipeResponse } = useQuery({
    queryKey: ['getUserRecipes'],
    queryFn: async () => {
      const response = await axios.get<RecipeResponse>(`${import.meta.env.VITE_API_URL}/recipes/user`, {
        headers: {
          Authorization: `Bearer ${auth.access_token}`,
        },
      });
      return response;
    },
    refetchInterval: pendingRecipes.length > 0 ? 10000 : 0, // Poll every 10 seconds
  });

  useEffect(() => {
    const recipes = recipeResponse?.data.data;
    if (recipes) {
      setPendingRecipes(recipes.filter((recipe) => recipe.isPending));
      setCompletedRecipes(recipes.filter((recipe) => !recipe.isPending));
      setIsLoading(false);
    }
  }, [recipeResponse]);

  return (
    <Container>
      <Title order={2}>My Recipes{recipeResponse?.data.count ? ` (${recipeResponse?.data.count})` : ''}</Title>
      {isLoading && (
        <Center>
          <Loader size="lg" />
        </Center>
      )}
      {!isLoading && (
        <div>
          <Title order={2} mt="md">
            Pending Recipes
          </Title>
          {pendingRecipes.length === 0 ? <Text>No pending recipes</Text> : <CardGrid recipes={pendingRecipes} />}

          <Title order={2} mt="md">
            Completed Recipes
          </Title>
          {completedRecipes.length === 0 ? <Text>No completed recipes</Text> : <CardGrid recipes={completedRecipes} />}
        </div>
      )}
    </Container>
  );
}
