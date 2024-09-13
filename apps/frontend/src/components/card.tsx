import React from 'react';
import { Card, Text, Group, Center } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import classes from './card.module.css';

export function ImageCard({
  title,
  author,
  image,
  date,
}: {
  title: string;
  author: string;
  image: string;
  date: string;
}): JSX.Element {
  return (
    <Card
      p="lg"
      shadow="lg"
      className={classes.card}
      radius="md"
      component={Link}
      href="https://mantine.dev/"
      target="_blank"
    >
      <div
        className={classes.image}
        style={{
          backgroundImage: `url(${image})`,
        }}
      />
      <div className={classes.overlay} />

      <div className={classes.content}>
        <div>
          <Text size="lg" className={classes.title} fw={500}>
            {title}
          </Text>

          <Group justify="space-between" gap="xs">
            <Text size="sm" className={classes.author}>
              {author}
            </Text>

            <Group gap="lg">
              <Center>
                {/* <IconEye style={{ width: rem(16), height: rem(16) }} stroke={1.5} color={theme.colors.dark[2]} /> */}
                <Text size="sm" className={classes.date}>
                  {date}
                </Text>
              </Center>
            </Group>
          </Group>
        </div>
      </div>
    </Card>
  );
}
