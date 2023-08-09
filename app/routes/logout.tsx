import * as React from "react";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logoutUser } from "~/utils";
import { Form } from "@remix-run/react";
import { Button } from "@mantine/core";

export const action = async ({ request }: ActionArgs) => {
  try {
    return logoutUser({ request, redirectTo: "/login" });
  } catch (err) {
    console.log(err);
    throw new Response(null, {
      status: 500,
      statusText: "internal server error, failed to logout user",
    });
  }
};

/*
The reason that we're using an action to logout (rather than a loader) is because we want to avoid CSRF problems by using a POST request rather than a GET request.
This is why the logout button is a form and not a link.
Additionally, Remix will only re-call our loaders when we perform an action, so if we used a loader then the cache would not get invalidated.
*/

export const Logout: React.FC = () => {
  return (
    <Form method="post">
      <Button type="submit">logout</Button>
    </Form>
  );
};

export default Logout;
