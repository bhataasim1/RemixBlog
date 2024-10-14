import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { PostServices } from "../.server/blog/PostService.server";

const todoService = new PostServices();

export async function action({ params }: ActionFunctionArgs) {
  const postId = params.postId;

  if (!postId) {
    return redirect('/');
  }

  await todoService.deletePost(postId);

  return redirect('/');
}