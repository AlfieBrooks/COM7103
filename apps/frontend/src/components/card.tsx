import React from 'react';
import { Card, Text, Group, Center } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import classes from './card.module.css';

export function ImageCard({
  id,
  title,
  author,
  image,
  date,
}: {
  id: string;
  title: string;
  author?: string;
  image?: string;
  date: Date;
}): JSX.Element {
  return (
    <Card
      p="lg"
      shadow="lg"
      className={classes.card}
      radius="md"
      component={Link}
      href={`/recipes/${id}`}
      target="_blank"
    >
      <div
        className={classes.image}
        style={{
          backgroundImage: `url(${image ?? 'https://placehold.co/600x280'})`,
        }}
      />
      <div className={classes.overlay} />

      <div className={classes.content}>
        <div>
          <Text size="lg" c="white" fw={500}>
            {title}
          </Text>

          <Group justify="space-between" gap="xs">
            {author && (
              <Text size="sm" c="dimmed">
                {author}
              </Text>
            )}

            <Group gap="lg">
              <Center>
                {/* <IconEye style={{ width: rem(16), height: rem(16) }} stroke={1.5} color={theme.colors.dark[2]} /> */}
                <Text size="sm" c="dimmed">
                  {new Date(date).toDateString()}
                </Text>
              </Center>
            </Group>
          </Group>
        </div>
      </div>
    </Card>
  );
}
