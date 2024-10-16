import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { json, Link, useLoaderData, useOutletContext, useSubmit } from "@remix-run/react";
import { PostServices } from "../.server/blog/PostService.server";
import { Box, Button, Container, Flex, Image, Text } from "@mantine/core";
import { User } from "../types/types";
import { formatDate } from "../utils/formate-date";

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
  const user = useOutletContext<User>();
  // const fetcher = useFetcher();

  const submit = useSubmit();

  const handleDeleteTodo = () => {
    const confirmFirst = confirm("Are you sure you want to delete this Post?");
    if (confirmFirst) {
      submit(
        post.id,
        { method: "post", action: `/delete/${post.id}` }
      )
    }
  }

  return (
    <Container size={'xl'} py={'lg'}>
      <Box>
        <Image
          src={post.imageUrl}
          alt={post.title}
          radius={'lg'}
          h={350}
          fit="cover"
        />
        <Flex justify="space-between" align={'center'} mt={8} mb={10} gap={3}>
          <Box>
            <Text size="sm" c={'cyan'}>{formatDate(post.createdAt)}</Text>
          </Box>
          {user.id === post.userId && (
            <Box>
              <Button size="xs" variant="light" component={Link} to={`/edit/${post.id}`} mr={5} color="blue">Edit</Button>
              {/* <fetcher.Form method='post' action={`/delete/${post.id}`}>
              <Button type='submit' size="xs" variant="light" color="red">Delete</Button>
            </fetcher.Form> */}
              <Button size="xs" variant="light" color="red" onClick={handleDeleteTodo}>Delete</Button>
            </Box>
          )}
        </Flex>
      </Box>
      <Box className="p-5 border rounded-lg mt-5" dangerouslySetInnerHTML={{ __html: post.content }} />
    </Container>
  )
}