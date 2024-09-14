import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const getUserRecipes = (token: string) =>
  queryOptions({
    queryKey: ['userRecipes'],
    queryFn: async () => {
      try {
        return await axios.get(`${import.meta.env.VITE_API_URL}/recipes/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        throw new Error('Failed to fetch user recipes');
      }
    },
  });
