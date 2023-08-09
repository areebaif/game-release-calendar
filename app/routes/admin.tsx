import { Outlet, useLoaderData } from "@remix-run/react";
import { Title, Text } from "@mantine/core";
import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { requireAdminUser } from "~/utils";
import { UserPropsForClient } from "~/utils/types";
import { UserPropsForClientZod } from "~/utils";
import { PlatformInput, ErrorCard, FormFieldsAddGame } from "~/components";

export const loader = async ({ request }: ActionArgs) => {
  // only admin can access this route, if the user is not admin or a user is not signedIn, requireAdminUser redirects the user to homepage
  try {
    const user = await requireAdminUser({ request, redirectTo: "/" });
    return json({ user: user });
  } catch (err) {
    console.log(err);
    throw new Response(null, {
      status: 500,
      statusText: "internal server error, failed to authenticate user",
    });
  }
};

const Admin: React.FC = () => {
  const loaderData = useLoaderData<{ user: UserPropsForClient }>();
  const typeCheckUser = UserPropsForClientZod.safeParse(loaderData.user);

  if (!typeCheckUser.success) {
    return (
      <ErrorCard
        errorMessage={"something went wrong with the server please try again"}
      />
    );
  }

  return (
    <>
      <Title order={1}>Admin Dahsboard</Title>
      <Text>email: {loaderData.user?.email}</Text>
      <Text>userName: {loaderData.user?.userName}</Text>
      <Text>userType: {loaderData.user?.userType}</Text>
      <main>
        <Outlet />
      </main>
    </>
  );
};
export default Admin;
