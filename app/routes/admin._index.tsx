import * as React from "react";
import { Link, useLoaderData } from "@remix-run/react";
import { json, ActionArgs, redirect } from "@remix-run/node";
import { Button, Group, List, Modal, Text, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DbReadGameMetaData, UserPropsForClient } from "~/utils/types";
import {
  dbGetAllGamesData,
  DbReadGameMetaDataZod,
  requireAdminUser,
  UserPropsForClientZod,
} from "~/utils";
import { ErrorCard, GameCard } from "~/components";

export const loader = async ({ request }: ActionArgs) => {
  try {
    const user = await requireAdminUser({ request });
    if (!user) return redirect("/");
    const allGamesMetaData = await dbGetAllGamesData();
    return json({ allGamesMetaData, user });
  } catch (err) {
    console.log(err);
    throw new Response(null, {
      status: 500,
      statusText: "internal server error, failed to get games data",
    });
  }
};

export const GameIndexRoute: React.FC = () => {
  const loaderData = useLoaderData<{
    allGamesMetaData: DbReadGameMetaData[];
    user: UserPropsForClient;
  }>();
  const [opened, { open, close }] = useDisclosure();
  React.useEffect(() => {
    if (loaderData.user) {
      loaderData.user.firstPassword ? open() : undefined;
    }
  }, [loaderData]);
  if (!loaderData.allGamesMetaData.length) {
    return <div>no data to display</div>;
  }
  const zodParseGameMetaData = DbReadGameMetaDataZod.safeParse(
    loaderData.allGamesMetaData[0]
  );
  const typeCheckUser = UserPropsForClientZod.safeParse(loaderData.user);
  if (!typeCheckUser.success) {
    console.log(typeCheckUser.error);
    return (
      <ErrorCard
        errorMessage={"something went wrong with the server please try again"}
      />
    );
  }
  if (!zodParseGameMetaData.success) {
    // log error in console
    console.log(zodParseGameMetaData.error);
    return (
      <ErrorCard errorMessage="something went wrong with the server please try again" />
    );
  }
  // TODO
  // if the users firs password is defined then open a modal to tell user to reset password
  // remove the user credentials se t back when admin creates a user
  return (
    <>
      <List icon={" "}>
        {loaderData.allGamesMetaData?.map((gameItem, index) => {
          return (
            <List.Item key={index}>
              <Link to={`/game/${gameItem.game.gameId}`}>
                <GameCard gameItem={gameItem} />
              </Link>
            </List.Item>
          );
        })}
      </List>
      <Modal centered opened={opened} onClose={close} title="Reset password">
        <Text size="md">
          It is highly recommended that you reset your password.
        </Text>
        <Group position="center">
          <Button
            variant="outline"
            mt="xs"
            component={Link}
            to="/admin/edit-user-password"
          >
            Reset Password
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default GameIndexRoute;
