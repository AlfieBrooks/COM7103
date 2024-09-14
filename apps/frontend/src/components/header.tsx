import React, { useState } from 'react';
import { Container, Group, Burger, Button, Title, Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from '@tanstack/react-router';
import { IconCherry } from '@tabler/icons-react';

import classes from './header.module.css';
import { supabase } from '../main';

const links = [
  { link: '/', label: 'Home', authProtected: false },
  { link: '/recipes', label: 'Recipes', authProtected: false },
  { link: '/recipes/mine', label: 'My Recipes', authProtected: true },
  { link: '/recipes/create', label: 'Create', authProtected: true },
];

export function Header({ user }: { user: {} }): JSX.Element {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);

  // const signIn = async () => {
  //   const { error } = await supabase.auth.signOut();
  //   console.log("Log ~ signOut ~ error:", error);
  // };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    console.log('Log ~ signOut ~ error:', error);
  };

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
          {!user && (
            <Button variant="default" onClick={() => loginWithRedirect()}>
              Log in
            </Button>
          )}

          {user && (
            <>
              <Avatar src={user.picture} alt={user.name}></Avatar>
              <Button variant="default" onClick={() => signOut()}>
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
