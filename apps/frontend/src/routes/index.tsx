import React from "react";
import { Container } from "@mantine/core";
import { Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { CardGrid } from "../components/grid";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index(): JSX.Element {
  return (
    <Container>
      <Title order={2}>Homepage</Title>
      <CardGrid />
    </Container>
  );
}

export default Index;
