import React from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Container, TextInput, Textarea, Group, Title, Button, TagsInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const Route = createFileRoute('/recipes/create')({
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
  component: Create,
});

function Create(): JSX.Element {
  const token = Route.useRouteContext().auth?.access_token;
  const form = useForm({
    initialValues: {
      title: '',
      ingredients: ['1 Onion', '2 Tomatoes'],
      instructions: '',
    },
    validate: {
      title: (value) => value.trim().length === 0,
      ingredients: (values) => values.length === 0,
      instructions: (value) => value.trim().length === 0,
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (recipe: typeof form.values) => {
      try {
        return await axios.post(`${import.meta.env.VITE_API_URL}/recipes`, recipe, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        throw new Error('Failed to create recipe');
      }
    },
  });

  const handleSubmit = async (values: typeof form.values, event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    await mutateAsync(values);
  };

  return (
    <Container>
      <Title order={1}>Create Recipe</Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Recipe Title"
          placeholder="Recipe Title"
          mt="md"
          name="title"
          variant="filled"
          {...form.getInputProps('title')}
        />
        <TagsInput
          label="Ingredient List"
          description="Press Enter to submit an ingredient, add up to 30 ingredients along with their quantities"
          placeholder="Enter ingredient"
          maxTags={30}
          clearable
          {...form.getInputProps('ingredients')}
        />
        <Textarea
          mt="md"
          label="Instructions"
          placeholder="Instructions"
          maxRows={10}
          minRows={5}
          autosize
          name="instructions"
          variant="filled"
          {...form.getInputProps('instructions')}
        />

        <Group justify="center" mt="xl">
          <Button type="submit" size="md">
            Submit Recipe
          </Button>
        </Group>
      </form>
    </Container>
  );
}

export default Create;
