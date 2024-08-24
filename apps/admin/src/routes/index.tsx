import React from "react";
import { Container } from "@mantine/core";
import { Title } from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { CardGrid } from "../components/grid";

export const Route = createFileRoute("/")({
  component: App,
});

function App(): JSX.Element {
  return (
    <>
      <Container>
        <Title order={1}>Homepage</Title>
        <CardGrid />
      </Container>
    </>
  );
}

export default App;
