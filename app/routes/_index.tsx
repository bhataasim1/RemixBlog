import { Box } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import { PostCard } from "../components/post-card/post-card";
import { PostServices } from "../.server/blog/PostService.server";
import { useLoaderData } from "@remix-run/react";

const postServices = new PostServices();

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader() {
  return await postServices.getAllPosts();
}

export default function Index() {
  const posts = useLoaderData<typeof loader>();
  // console.log("Loader Data", posts);
  return (
    <Box size={'xl'}>
      <PostCard posts={posts} />
    </Box>
  );
}
