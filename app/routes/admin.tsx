import { Outlet, useLoaderData } from "@remix-run/react";
import { Title, Text, Header, Group, Container, AppShell } from "@mantine/core";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { requireAdminUser } from "~/utils";
import { UserPropsForClient } from "~/utils/types";
import { UserPropsForClientZod } from "~/utils";
import {
  PlatformInput,
  ErrorCard,
  FormFieldsAddGame,
  AdminNavigation,
} from "~/components";

export const loader = async ({ request }: ActionArgs) => {
  // only admin can access this route, if the user is not admin or a user is not signedIn, requireAdminUser redirects the user to homepage
  try {
    const user = await requireAdminUser({ request });
    if (!user) return redirect("/");

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
      <main>
        <AppShell
          padding="md"
          navbar={<AdminNavigation {...loaderData.user!} />}
          header={
            <Header pl="xl" height={70}>
              <Title py="lg" order={2}>
                Admin Dashboard
              </Title>
            </Header>
          }
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Container fluid>
            <Outlet />
          </Container>
        </AppShell>
      </main>
    </>
  );
};

export default Admin;
