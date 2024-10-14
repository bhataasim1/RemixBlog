import { Box } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import { PostCard } from "../components/post-card/post-card";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <Box size={'xl'}>
      <PostCard />
    </Box>
  );
}
