import React, { useState } from "react";
import { Container, Group, Burger, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";

import classes from "./header.module.css";

const links = [
  { link: "/", label: "Home" },
  { link: "/create", label: "Create" },
];

export function Header(): JSX.Element {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  const items = links.map((link) => (
    <Link
      key={link.label}
      to={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={() => {
        setActive(link.link);
      }}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        {/* <MantineLogo size={28} /> */}
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Group justify="center" grow pb="xl" px="md">
          <Link to="/login">
            <Button variant="default">Log in</Button>
          </Link>
          <Link to="/login">
            <Button>Sign up</Button>
          </Link>
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
