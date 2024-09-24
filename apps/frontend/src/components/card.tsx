import React from 'react';
import { Card, Text, Loader, Flex, Image } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import classes from './card.module.css';

interface ImageCardProps {
  readonly id: string;
  readonly title: string;
  readonly date: Date;
  readonly isPending?: boolean;
}

export function ImageCard({ id, title, date, isPending }: ImageCardProps): JSX.Element {
  return (
    <Card p="lg" shadow="lg" className={classes.card} radius="md" component={Link} to={`/recipes/${id}`}>
      <Image
        className={classes.image}
        src={`${import.meta.env.VITE_IMAGE_API_URL}/recipe-image/${id}`}
        fallbackSrc="/placeholder.png"
      />
      <div className={classes.overlay} />

      <div className={classes.content}>
        <Flex direction="row" w="100%" justify="space-between">
          <Flex direction="column">
            <Text size="lg" c="white" fw={500}>
              {title}
            </Text>
            <Text size="sm" c="dimmed">
              {new Date(date).toDateString()}
            </Text>
          </Flex>

          {isPending && (
            <Flex align="flex-end">
              <Loader size="lg" />
            </Flex>
          )}
        </Flex>
      </div>
    </Card>
  );
}
