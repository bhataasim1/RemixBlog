import { SimpleGrid, Card, Image, Text, Container, AspectRatio, Flex, Pill } from '@mantine/core';
import classes from './post-card.module.css';

type PostCardProps = {
  posts: {
    id: number;
    title: string;
    content: string;
    author: string;
    featuredImage: string;
    imageUrl: string;
    userId: string;
  }[];
};

export function PostCard({ posts }: PostCardProps) {
  const cards = posts.map((post) => (
    <Card key={post.title} p="md" radius="md" component="a" href="#" className={classes.card}>
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
    </Card>
  ));

  return (
    <Container size={'xl'} py={'lg'}>
      <SimpleGrid cols={{ lg: 4, md: 4, sm: 2, xl: 4, xs: 1 }}>{cards}</SimpleGrid>
    </Container>
  );
}