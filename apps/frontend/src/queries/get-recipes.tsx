import { queryOptions } from '@tanstack/react-query';
import axios from 'axios';

export const getRecipes = queryOptions({
  queryKey: ['recipes'],
  queryFn: async () => {
    try {
      return await axios.get(`${import.meta.env.VITE_API_URL}/recipes`);
    } catch (error) {
      throw new Error('Failed to fetch recipes');
    }
  },
});
