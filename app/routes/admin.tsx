import * as React from "react";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  Title,
  Text,
  Header,
  Group,
  Container,
  AppShell,
  useMantineTheme,
  Switch,
} from "@mantine/core";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { IconSun, IconMoonStars } from "@tabler/icons-react";
import type { ActionArgs } from "@remix-run/node";
import { requireAdminUser } from "~/utils";
import { UserPropsForClient } from "~/utils/types";
import { UserPropsForClientZod } from "~/utils";
import { ErrorCard, AdminNavigation } from "~/components";

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
  const theme = useMantineTheme();
  const [adminTheme, setAdminTheme] = React.useState<"dark" | "light">("dark");
  const [checked, setChecked] = React.useState(false);
  const ThemeContext = React.createContext(adminTheme);
  theme.colorScheme = adminTheme;
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
        <ThemeContext.Provider value={adminTheme}>
          <AppShell
            padding="md"
            navbar={<AdminNavigation {...loaderData.user!} />}
            header={
              <Header height={70}>
                <Group px="xl" position="apart">
                  <Title
                    py="lg"
                    color={
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[0]
                        : theme.black
                    }
                    order={2}
                  >
                    Admin Dashboard
                  </Title>
                  <Switch
                    checked={checked}
                    onLabel={
                      <IconMoonStars
                        size="1rem"
                        stroke={2.5}
                        color={theme.colors.blue[4]}
                      />
                    }
                    offLabel={
                      <IconSun
                        size="1rem"
                        stroke={2.5}
                        color={theme.colors.green[4]}
                      />
                    }
                    onChange={(event) => {
                      setChecked(event.currentTarget.checked);
                      if (adminTheme === "dark") setAdminTheme("light");
                      else setAdminTheme("dark");
                    }}
                    label="switch theme mode"
                  />
                </Group>
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
        </ThemeContext.Provider>
      </main>
    </>
  );
};

export default Admin;
