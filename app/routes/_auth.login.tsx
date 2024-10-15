import { Anchor, Button, Container, Paper, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { Form, redirect, useNavigation } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { commitSession, getSession } from "../sessions";
import { AuthService } from "../.server/auth/AuthService";

const authService = new AuthService();

export async function action({ request }: ActionFunctionArgs) {

  const session = await getSession(request.headers.get("Cookie"));
  // console.log(session);

  const formData = await request.formData();
  const email = String(formData.get("email"))
  const password = String(formData.get("password"))

  const res = await authService.loginUser({ email, password });
  // console.log(res);

  if (!res.access_token) {
    session.flash("error", "Invalid email or password");

    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  try {
    const user = await authService.readMe(res.access_token);
    const userId = user.id;
    const first_name = user.first_name;
    const last_name = user.last_name;
    const email = user.email;

    if (userId === null) {
      session.flash("error", "Invalid email or password");

      return redirect("/login", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    res.access_token && session.set("access_token", res.access_token);
    res.refresh_token && session.set("refresh_token", res.refresh_token);
    res.expires && session.set("expires", String(res.expires));
    res.expires_at && session.set("expires_at", String(res.expires_at));
    email && session.set("email", email);
    userId && session.set("userId", userId);
    first_name && session.set("first_name", first_name);
    last_name && session.set("last_name", last_name);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    session.flash("error", "Invalid email or password");

    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");
  return userId ? redirect("/") : null;
}

export default function LoginPage() {
  const navigation = useNavigation();
  return (
    <Container size={500} my={40}>
      <Title ta="center">
        Welcome to Remix Blog
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component="a" href="/signup">
          Create account
        </Anchor>
      </Text>
      <Form
        method="POST"
      >
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput label="Email" name="email" placeholder="Your email" mt={'md'} required />
          <PasswordInput label="Password" name="password" placeholder="Your password" mt={'md'} required />
          <Button fullWidth mt={'md'} type="submit" variant="light" color="orange" loading={navigation.state === 'submitting'}>
            Log in
          </Button>
        </Paper>
      </Form>
    </Container>
  );
}