import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Recipe } from '../types/recipes';

export interface RecipeResponse {
  data: Recipe[];
  count: number;
  error?: string;
}

export const getUserRecipes = (token: string) =>
  queryOptions({
    queryKey: ['userRecipes'],
    queryFn: async () => {
      return await axios.get<RecipeResponse>(`${import.meta.env.VITE_API_URL}/recipes/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  });
