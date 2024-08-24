import React, { useState } from "react";
import { Container, Group, Burger, Button, Title, Avatar } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { IconCherry } from "@tabler/icons-react";

import classes from "./header.module.css";

const links = [
  { link: "/", label: "Home", authProtected: false },
  { link: "/recipes", label: "Recipes", authProtected: false },
  { link: "/my-recipes", label: "My Recipes", authProtected: true },
  { link: "/create", label: "Create", authProtected: true },
];

export function Header(): JSX.Element {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

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
        <Link to="/" className={classes.title}>
          <Group gap={5} visibleFrom="xs">
            <IconCherry stroke={1} size={28} />

            <Title order={2}>Recipe App</Title>
          </Group>
        </Link>

        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Group justify="center" grow>
          {!isAuthenticated && (
            <Button variant="default" onClick={() => loginWithRedirect()}>
              Log in
            </Button>
          )}

          {isAuthenticated && user && (
            <>
              <Avatar src={user.picture} alt={user.name}></Avatar>
              <Button variant="default" onClick={() => logout({ returnTo: window.location.origin })}>
                Log out
              </Button>
            </>
          )}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
