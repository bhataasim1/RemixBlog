import { Box, Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, Link, redirect, useActionData } from "@remix-run/react";
import { UserCircle } from "lucide-react";
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
  return (
    <div className="flex flex-col justify-center py-52 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
            <UserCircle className="size-10 text-white" />
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-4 sm:rounded-lg sm:px-10">
          <Form
            method="POST"
            className="space-y-6"
          >
            <Box style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

              <TextInput label="First Name" name="first_name" placeholder="First Name" error={actionData?.errors?.first_name} required />

              <TextInput label="Last Name" name="last_name" placeholder="Last Name" error={actionData?.errors?.last_name} required />

              <TextInput label="Email" name="email" placeholder="Your email" error={actionData?.errors?.email} required />

              <PasswordInput label="Password" name="password" placeholder="Your password" error={actionData?.errors?.password} required />

              <Button type="submit" variant="light" color="orange">
                Sign Up
              </Button>
              <div className="flex justify-center">
                <Text size="sm">Already Have an Account <Link to={'/login'} className="text-blue-600 font-bold">Login</Link> </Text>
              </div>
            </Box>
          </Form>
        </div>
      </div>
    </div>
  );
}