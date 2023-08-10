import * as React from "react";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { Title } from "@mantine/core";
import { UserPropsForClientZod, authenticatedUser } from "~/utils";
import { UserPropsForClient } from "~/utils/types";
import { ErrorCard } from "~/components";

// export const meta: V2_MetaFunction = () => {
//   return [
//     { title: "New Remix App" },
//     { name: "description", content: "Welcome to Remix!" },
//   ];
// };

export const loader = async ({ request }: ActionArgs) => {
  // check if the user is authenticated, send user info back
  const isLoggedIn = await authenticatedUser(request);
  return json({ user: isLoggedIn.user });
};

export default function Index() {
  const loaderData = useLoaderData<{ user: UserPropsForClient }>();
  // typecheck loaderData

  const typeCheckUser = UserPropsForClientZod.safeParse(loaderData.user);
  if (!typeCheckUser.success) {
    console.log(typeCheckUser.error.issues);
    return (
      <ErrorCard errorMessage="something went wrong with the server, please try again" />
    );
  }

  return (
    <div>
      <Title>Welcome to Remix</Title>
      <ul>
        {loaderData.user?.userType === "ADMIN" ? (
          <li>
            <Link to="/admin">Go to admin dashbaord</Link>
          </li>
        ) : (
          <></>
        )}
        <li>
          <Link to="/game">View all games</Link>
        </li>
        {!loaderData.user?.id ? (
          <li>
            <Link to="/login">sign-up or login</Link>
          </li>
        ) : (
          <li>
            <Link to="/logout">logout</Link>
          </li>
        )}
      </ul>
    </div>
  );
}
