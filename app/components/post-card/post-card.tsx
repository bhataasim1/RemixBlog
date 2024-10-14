import { SimpleGrid, Card, Image, Text, Container, AspectRatio, Flex, Pill, Button } from '@mantine/core';
import classes from './post-card.module.css';
import { Link, useFetcher, useOutletContext } from '@remix-run/react';
import { User } from '../../types/types';

type PostCardProps = {
  posts: {
    id: number | string;
    title: string;
    content: string;
    author: string;
    featuredImage: string;
    imageUrl: string;
    userId: string;
  }[];
};

export function PostCard({ posts }: PostCardProps) {
  const fetcher = useFetcher();
  const user = useOutletContext<User>()
  const cards = posts.map((post) => (
    <Card key={post.title} p="md" radius="md" className={classes.card}>
      <Link to={`/post/${post.id}`}>
        <AspectRatio ratio={1080 / 720}>
          <Image src={post.imageUrl} radius={'lg'} />
        </AspectRatio>
        <Flex justify="space-between" align="center" mt={8}>
          <Text className={classes.title}>
            {post.title}
          </Text>
          <Pill>{post.author}</Pill>
        </Flex>
        <Text c="dimmed" size="xs" truncate="end" fw={700} mt="md">
          {post.content}
        </Text>
      </Link>
      {user.id === post.userId && (
        <Flex justify="end" align="center" mt={8} gap={3}>
          <Link to={`/edit/${post.id}`} className={classes.link}>
            <Button size="xs" variant="light" color="blue">Edit</Button>
          </Link>
          <fetcher.Form method='post' action={`/delete/${post.id}`}>
            <Button type='submit' size="xs" variant="light" color="red">Delete</Button>
          </fetcher.Form>
        </Flex>
      )}
    </Card>
  ));

  return (
    <Container size={'xl'} py={'lg'}>
      <SimpleGrid cols={{ lg: 4, md: 4, sm: 2, xl: 4, xs: 1 }}>{cards}</SimpleGrid>
    </Container>
  );
}