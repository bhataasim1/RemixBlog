import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { PostServices } from "../.server/blog/PostService.server";
import { Box, Image } from "@mantine/core";

const postServices = new PostServices();


export async function loader({ params }: LoaderFunctionArgs) {
  const postId = params.postId;

  if (!postId) {
    return redirect('/');
  }

  const post = await postServices.getPost(postId);

  return json(post);
}

export default function Post() {
  const post = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col px-20 py-3 gap-8">
      <div>
        <Image
          src={post.imageUrl}
          alt={post.title}
          radius={'lg'}
          h={350}
          fit="cover"
        />
      </div>
      <Box className="p-5 border rounded-lg" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  )
}