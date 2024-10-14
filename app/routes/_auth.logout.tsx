import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { destroySession, getSession } from "../sessions";
import { AuthService } from "../.server/auth/AuthService";

const authService = new AuthService();

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const refresh_token = session.get("refresh_token");
  // console.log(refresh_token);

  if (refresh_token) {
    try {
      await authService.logoutUser(refresh_token, "json"); // pass the second argument (mode) as "json" or "cookie" or "session"

      return redirect("/", {
        headers: {
          "Set-Cookie": await destroySession(session),
        },
      });
    } catch (error) {
      // console.error(error);
      return json({ error: "Error logging out" }, { status: 500 });
    }
  }

  return redirect("/");
}