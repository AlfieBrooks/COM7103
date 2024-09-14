import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const getRecipe = (recipeId: string) =>
  queryOptions({
    queryKey: ['recipes', { recipeId }],
    queryFn: async () => {
      try {
        return await axios.get(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}`);
      } catch (error) {
        throw new Error('Failed to fetch recipe');
      }
    },
  });
