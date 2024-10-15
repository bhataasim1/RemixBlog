import { Button, FileInput, Text, TextInput } from "@mantine/core";
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

  if (!userId) {
    return redirect('/login');
  }

  const errors: ErrorType = validateInputData({ title, content });

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
    await postServices.addPost({ title, content, author, featuredImage: image.id, imageUrl, userId });
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
    <div className="min-h-screen">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="rounded-xl shadow-sm border p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Create New Post</h1>
            <p className="mt-1">Fill in the details for your new Post</p>
          </div>

          <Form method="POST" className="space-y-6" encType="multipart/form-data">
            <div>
              <TextInput size="md" label="Title" name="title" placeholder="Enter the Post Title" error={actionData?.errors.title} required />
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
                required
              />
            </div>

            <div>
              <TextInput size="md" label="Author" placeholder="Enter the Author Name" defaultValue={`${user.first_name} ${user.last_name}`} required disabled />
              <input type="hidden" name="author" value={`${user.first_name} ${user.last_name}`} />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                variant="gradient"
                fullWidth
                loading={navigation.state === 'submitting'}
              >
                Create Post
              </Button>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}