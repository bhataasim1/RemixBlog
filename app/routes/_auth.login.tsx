import { Box, Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { Form, Link, redirect } from "@remix-run/react";
import { Lock } from "lucide-react";
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
  return (
    <div className="flex flex-col justify-center py-52 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
            <Lock className="size-6 text-white" />
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:rounded-lg sm:px-10">
          <Form
            method="POST"
            className="space-y-6"
          >
            <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <TextInput label="Email" name="email" placeholder="Your email" required />
              <PasswordInput label="Password" name="password" placeholder="Your password" required />
              <Button type="submit" variant="light" color="orange">
                Log in
              </Button>
              <div className="flex justify-center">
                <Text size="sm">{`Don't Have an Account`} <Link to={'/signup'} className="text-blue-600 font-bold">Signup</Link> </Text>
              </div>
            </Box>
          </Form>
        </div>
      </div>
    </div>
  );
}