import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";
import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Header } from "./components/header/header";
import { getSession } from "./sessions";
import { User } from "./types/types";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const user: Partial<User> = {}
  if (session.has("userId")) {
    user.id = session.get("userId");
    user.first_name = session.get("first_name");
    user.last_name = session.get("last_name");
    user.email = session.get("email");

    return json(user);
  }
  return json(user);
}

export function Layout() {
  const user = useLoaderData<typeof loader>();
  // console.log("Loader Data", user);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="dark">
          <Header user={user} />
          <Outlet context={user} />
          {/* {children} */}
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
