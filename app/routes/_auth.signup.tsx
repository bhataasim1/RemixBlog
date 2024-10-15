import { Anchor, Button, Container, Paper, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useActionData, useNavigation } from "@remix-run/react";
import { AuthService } from "../.server/auth/AuthService";
import { getSession } from "../sessions";
import { validateAuthInputs } from "../utils/validate-inputs";
import { User } from "../types/types";

const authService = new AuthService();

export async function action({ request }: ActionFunctionArgs) {
  const formData = new URLSearchParams(await request.text());
  const first_name = formData.get("first_name");
  const last_name = formData.get("last_name");
  const email = formData.get("email");
  const password = formData.get("password");


  if (!first_name || !last_name || !email || !password) {
    return redirect("/signup");
  }

  const errors: Partial<User> = validateAuthInputs({ first_name, last_name, email, password });

  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }

  try {
    await authService.registerUser({ first_name, last_name, email, password });
    return redirect("/login");
  } catch (error) {
    return redirect("/signup");
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  return userId ? redirect("/") : null;
}

export default function Signup() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  return (
    <Container size={600} my={40}>
      <Title ta="center">
        Get Started with your account
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component="a" href="/login">
          Login here
        </Anchor>
      </Text>
      <Form
        method="POST"
      >
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="First Name" name="first_name" placeholder="First Name" error={actionData?.errors?.first_name} mb={20} required />

          <TextInput label="Last Name" name="last_name" placeholder="Last Name" error={actionData?.errors?.last_name} mb={20} required />

          <TextInput label="Email" name="email" placeholder="Your email" error={actionData?.errors?.email} mb={20} required />

          <PasswordInput label="Password" name="password" placeholder="Your password" error={actionData?.errors?.password} mb={20} required />

          <Button fullWidth mt={'md'} type="submit" variant="light" color="orange" loading={navigation.state === 'submitting'} mb={20}>
            Create Account
          </Button>
        </Paper>
      </Form>
    </Container>
  );
}