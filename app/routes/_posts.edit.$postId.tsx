import { Button, FileInput, TextInput, Image, Text, Container, Title, Paper } from "@mantine/core";
import { Form, json, redirect, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { Image as ImageIcon } from "lucide-react";
import { getSession } from "../sessions";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { PostServices } from "../.server/blog/PostService.server";
import { ErrorType } from "../types/types";
import { validateInputData } from "../utils/validate-inputs";
import RichEditor from "../components/wysiwyg/wysiwyg-editor";
import { useState } from "react";

const postServices = new PostServices();

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = String(formData.get("title"));
  const content = String(formData.get("content"));
  const author = String(formData.get("author"));
  const featuredImage = formData.get("featuredImage") as File;

  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const accessToken = session.get("access_token");

  const postId = params.postId;

  if (!userId || !accessToken) {
    return redirect('/');
  }

  const errors: ErrorType = validateInputData({ title, content });

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }


  if (!postId) {
    return redirect('/');
  }

  let imageUrl: string = '';
  try {
    if (!featuredImage.size) {
      await postServices.editPost(postId, { title, content, author, userId }, accessToken);
      return redirect(`/`);
    }

    if (featuredImage && featuredImage instanceof Blob) {
      const imageData = new FormData();
      imageData.append('file', featuredImage);

      userId && imageData.append('uploaded_by', userId);
      const image = await postServices.uploadImage(imageData);
      imageUrl = `${process.env.DIRECTUS_URL}/assets/${image.id}`;

      await postServices.editPost(postId, { title, content, author, featuredImage: image.id, imageUrl, userId }, accessToken);
      return redirect(`/`);
    }
  } catch (error) {
    return redirect('/');
  }
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const postId = params.postId;
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!postId || !userId) {
    return redirect('/');
  }

  const post = await postServices.getPost(postId);

  if (!post || post.userId !== userId) {
    return redirect('/');
  }

  return json(post);
}

export default function EditPost() {
  const actionData = useActionData<typeof action>();
  const post = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const [content, setContent] = useState<string>(post.content);

  return (
    <Container size={600} my={40}>
      <Title ta="center">
        Edit your Post
      </Title>
      <Form
        method="POST"
        encType="multipart/form-data"
      >
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">

          <TextInput size="md" label="Title" name="title" placeholder="Enter the Post Title" defaultValue={post.title} error={actionData?.errors.title} mb={10} />

          {/* <TextInput size="md" label="Content" name="content" placeholder="Enter the Post Content" defaultValue={post.content} error={actionData?.errors.content} required /> */}
          <Text my={5} mb={10}>Content</Text>
          <RichEditor content={content} onChange={setContent} />
          <input type="hidden" name="content" value={content} />

          <Image src={post.imageUrl} alt={post.title} radius={'lg'} h={300} fit="cover" mt={10} />
          <FileInput
            rightSection={<ImageIcon size={18} />}
            label="Post Featured Image"
            name="featuredImage"
            placeholder="Upload Featured Image..."
            rightSectionPointerEvents="none"
            mt="md"
            accept="image/*"
            mb={10}
          />

          <TextInput size="md" label="Author" placeholder="Enter the Author Name" defaultValue={post.author} disabled mb={10} />
          <input type="hidden" name="author" value={post.author} />

          <Button
            type="submit"
            color="orange"
            variant="outline"
            fullWidth
            loading={navigation.state === 'submitting'}
            mt={15}
          >
            Update Post
          </Button>
        </Paper>
      </Form>
    </Container>
  );
}