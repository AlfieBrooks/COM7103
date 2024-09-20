import React, { useEffect, useState } from 'react';
import { Container, Title, Text, Center, Loader } from '@mantine/core';
import { createFileRoute, ErrorComponent, redirect } from '@tanstack/react-router';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CardGrid } from '../../components/grid';
import { getUserRecipes } from '../../queries/get-user-recipes';
import { CustomRecipe } from '../../types/recipes';

interface Result {
  recipe: CustomRecipe;
  isCompleted: boolean;
}

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
  errorComponent: ({ error }) => {
    return <ErrorComponent error={error} />;
  },
});

const fetchImageStatus = async (recipeId: string) => {
  const imageUrl = `${import.meta.env.VITE_IMAGE_URL}/recipe-image/${recipeId}`;
  try {
    const response = await axios.get(imageUrl, { responseType: 'blob' });
    const image = URL.createObjectURL(response.data);
    return { image, isCompleted: true };
  } catch (error) {
    return { image: null, isCompleted: false };
  }
};

function MyRecipes(): JSX.Element {
  const { auth } = Route.useRouteContext();
  const {
    data: { data: recipes },
  } = useSuspenseQuery(getUserRecipes(auth.access_token));
  console.log('Log ~ MyRecipes ~ recipes:', recipes);

  const [pendingRecipes, setPendingRecipes] = useState<CustomRecipe[]>([]);
  const [completedRecipes, setCompletedRecipes] = useState<CustomRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Log ~ useEffect ~ recipes?.data:', recipes?.data);
    if (recipes?.data) {
      setPendingRecipes(recipes.data);
      setIsLoading(true);
    }
  }, [recipes]);

  const { data, isSuccess } = useQuery<Result[], Error>({
    queryKey: ['checkImageStatus'],
    queryFn: async () => {
      const results = await Promise.all(
        pendingRecipes.map(async (recipe) => {
          const { image, isCompleted } = await fetchImageStatus(recipe.id);

          let modifiedRecipe = recipe;
          if (image) {
            modifiedRecipe = { ...recipe, image, isPending: false };
          } else {
            modifiedRecipe = { ...recipe, isPending: true };
          }
          return { recipe: modifiedRecipe, isCompleted };
        }),
      );
      return results;
    },
    refetchInterval: 10000, // Poll every 10 seconds
    enabled: pendingRecipes.length > 0,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const completed = data.filter((result) => result.isCompleted).map((result) => result.recipe);
      const submitted = data.filter((result) => !result.isCompleted).map((result) => result.recipe);

      setCompletedRecipes((prev) => {
        const uniqueRecipes = new Set([...prev, ...completed]);
        return Array.from(uniqueRecipes);
      });
      setPendingRecipes(submitted);
      setIsLoading(false);
    }
  }, [isSuccess, data]);

  return (
    <Container>
      <Title order={2}>My Recipes{recipes.count ? ` (${recipes.count})` : ''}</Title>
      {/* <CardGrid recipes={recipes.data} /> */}
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
