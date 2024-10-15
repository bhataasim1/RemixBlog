import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { PostServices } from "../.server/blog/PostService.server";
import { getSession } from "../sessions";

const todoService = new PostServices();

export async function action({ request, params }: ActionFunctionArgs) {
  const postId = params.postId;
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!postId) {
    return redirect('/');
  }

  try {
    const post = await todoService.getPost(postId);
    if (post.userId !== userId) {
      return redirect('/');
    } else {
      await todoService.deletePost(postId);
      return redirect('/');
    }
  } catch (error) {
    return redirect('/');
  }
}