import React from "react";
import { Container } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { TextInput, Textarea, Group, Title, Button } from "@mantine/core";
import { TagsInput } from "@mantine/core";

import { useForm } from "@mantine/form";

export const Route = createFileRoute("/create")({
  component: Create,
});

function Create(): JSX.Element {
  const form = useForm({
    initialValues: {
      title: "",
      ingredients: ["1 Onion", "2 Tomatoes"],
      instructions: "",
    },
    // validate: {
    //   title: (value) => value.trim().length === 0,
    //   ingredients: (value) => value.trim().length === 0,
    //   instructions: (value) => value.trim().length === 0,
    // },
  });

  return (
    <Container>
      <Title order={1}>Create Recipe</Title>

      <form onSubmit={form.onSubmit(() => {})}>
        <TextInput
          label="Recipe Title"
          placeholder="Recipe Title"
          mt="md"
          name="title"
          variant="filled"
          {...form.getInputProps("title")}
        />
        {/* <TextInput
          label="Ingredients"
          placeholder="Ingredients"
          mt="md"
          name="Ingredients"
          variant="filled"
          {...form.getInputProps("ingredients")}
        /> */}
        <TagsInput
          label="Ingredient List"
          description="Press Enter to submit an ingredient, add up to 30 ingredients along with their quantities"
          placeholder="Enter ingredient"
          maxTags={30}
          clearable
          {...form.getInputProps("ingredients")}
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
          {...form.getInputProps("instructions")}
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
