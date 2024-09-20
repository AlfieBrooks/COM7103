import React from 'react';
import { Container, Group, Burger, Button, Title, Avatar } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from '@tanstack/react-router';
import { IconCherry } from '@tabler/icons-react';
import { UserMetadata } from '@supabase/supabase-js';
import { supabase } from '../main';
import classes from './header.module.css';

const links = [
  { link: '/', label: 'Home', authProtected: false },
  { link: '/recipes/mine', label: 'My Recipes', authProtected: true },
  { link: '/recipes/create', label: 'Create', authProtected: true },
];

interface HeaderProps {
  readonly user?: UserMetadata;
}

export function Header({ user }: HeaderProps): JSX.Element {
  const [opened, { toggle }] = useDisclosure(false);

  // const signIn = async () => {
  //   const { error } = await supabase.auth.signOut();
  //   console.log("Log ~ signOut ~ error:", error);
  // };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    console.log('Log ~ signOut ~ error:', error);
  };

  const items = links.map((link) => (
    <Link key={link.label} to={link.link} className={classes.link} activeOptions={{ exact: true }}>
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
