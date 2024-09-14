import React from 'react';
import { SimpleGrid, Container } from '@mantine/core';
// import classes from "./grid.module.css";
import { ImageCard } from './card';
import { Recipe } from '../types/recipes';

const mockdata = [
  {
    title: 'Fruit and ice cream',
    author: 'John Doe',
    image:
      'https://images.unsplash.com/photo-1703849293013-5430be487639?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
    date: 'August 18, 2022',
  },
  {
    title: 'Pasta and vegetables',
    author: 'Jane Doe',
    image:
      'https://images.unsplash.com/photo-1703848987117-0bd6015474b7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
    date: 'August 27, 2022',
  },
  {
    title: 'Meat and cheese',
    author: 'John Doe',
    image:
      'https://images.unsplash.com/photo-1703848747157-830cab9e178a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
    date: 'September 9, 2022',
  },
  {
    title: 'Ecuador meat',
    author: 'Jane Doe',
    image:
      'https://images.unsplash.com/photo-1514944617518-12c7891ec602?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
    date: 'September 12, 2022',
  },
];
// https://images.unsplash.com/photo-1703849293013-5430be487639?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
// https://images.unsplash.com/photo-1703848987117-0bd6015474b7?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
// https://images.unsplash.com/photo-1703848747157-830cab9e178a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
// https://images.unsplash.com/photo-1514944617518-12c7891ec602?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D

export function CardGrid({ recipes }: { recipes: Recipe[] }): JSX.Element {
  const cards = recipes.map((recipe) => (
    // <ImageCard key={recipe.title} title={recipe.title} author={recipe.author} image={recipe.image} date={recipe.date} />
    <ImageCard key={recipe.id} id={recipe.id} title={recipe.title} date={recipe.createdAt} />
  ));

  return (
    <Container py="xl">
      <SimpleGrid cols={{ base: 1, sm: 2 }}>{cards}</SimpleGrid>
    </Container>
  );
}
