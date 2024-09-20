import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { Recipe } from '../types/recipes';

export const getUserRecipes = (token: string) =>
  queryOptions({
    queryKey: ['userRecipes'],
    queryFn: async () => {
      return await axios.get<Recipe[]>(`${import.meta.env.VITE_API_URL}/recipes/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
  });
