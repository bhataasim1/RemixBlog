import { Button, Container, FileInput, Paper, Text, TextInput, Title } from "@mantine/core";
import { Form, json, redirect, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { Image } from "lucide-react";

import { getSession } from "../sessions";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { PostServices } from "../.server/blog/PostService.server";
import { ErrorType } from "../types/types";
import { validateInputData } from "../utils/validate-inputs";
import { AuthService } from "../.server/auth/AuthService";
import RichEditor from "../components/wysiwyg/wysiwyg-editor";
import { useState } from "react";

const postServices = new PostServices();
const authServices = new AuthService();


export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title = String(formData.get("title"));
  const content = String(formData.get("content"));
  const author = String(formData.get("author"));
  const featuredImage = formData.get("featuredImage") as File;

  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const accessToken = session.get("access_token");

  if (!userId || !accessToken) {
    return redirect('/login');
  }

  const errors: ErrorType = validateInputData({ title, content });

  if (!featuredImage.size) {
    errors.featuredImage = "Featured image is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  if (featuredImage && featuredImage instanceof Blob) {
    const imageData = new FormData();
    imageData.append('file', featuredImage);

    userId && imageData.append('uploaded_by', userId);
    const image = await postServices.uploadImage(imageData);
    // console.log("Image", image);
    const imageUrl = `${process.env.DIRECTUS_URL}/assets/${image.id}`;
    await postServices.addPost({ title, content, author, featuredImage: image.id, imageUrl, userId }, accessToken);
  }

  return redirect('/');
}


export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  const accessToken = session.get("access_token");

  if (!userId && !accessToken) {
    return redirect('/login');
  }

  const user = await authServices.readMe(accessToken!);

  return json({ user });
}


export default function CreatePost() {
  const actionData = useActionData<typeof action>();
  const { user } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  // console.log({ user });

  const [content, setContent] = useState<string>('');
  // console.log("{ content }", content);
  return (
    <Container size={600} my={40}>
      <Title ta="center">
        Create New Post
      </Title>
      <Form
        method="POST"
        encType="multipart/form-data"
      >
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">

          <div>
            <TextInput size="md" label="Title" name="title" placeholder="Enter the Post Title" error={actionData?.errors.title} mb={10} required />
          </div>

          <div>
            {/* <TextInput size="md" label="Content" name="content" placeholder="Enter the Post Description" error={actionData?.errors.content} required /> */}
            <Text my={5} >Content <Text component="span" c={'red'}>*</Text> </Text>
            <RichEditor onChange={setContent} />
            <input type="hidden" name="content" value={content} />
          </div>

          <div>
            <FileInput
              rightSection={<Image size={18} />}
              label="Post Featured Image"
              name="featuredImage"
              placeholder="Upload Featured Image..."
              rightSectionPointerEvents="none"
              mt="md"
              accept="image/*"
              error={actionData?.errors.featuredImage}
              required
            />
          </div>

          <div>
            <TextInput size="md" label="Author" placeholder="Enter the Author Name" defaultValue={`${user.first_name} ${user.last_name}`} mt={10} required disabled />
            <input type="hidden" name="author" value={`${user.first_name} ${user.last_name}`} />
          </div>

          <div>
            <Button
              type="submit"
              color="orange"
              fullWidth
              variant="outline"
              loading={navigation.state === 'submitting'}
              mt={15}
            >
              Create Post
            </Button>
          </div>
        </Paper>
      </Form>
    </Container>
  );
}