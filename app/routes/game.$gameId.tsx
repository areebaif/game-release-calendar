import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import {
  useParams,
  useLoaderData,
  useNavigation,
  Form,
} from "@remix-run/react";
import { Button, Group, Loader } from "@mantine/core";
import {
  dbGetGameDataById,
  DbReadGameMetaDataZod,
  authenticatedUser,
  db,
  dbDeleteGameById,
} from "~/utils";
import { DbReadGameMetaData, UserPropsForClient } from "~/utils/types";
import { ErrorCard, GameCard } from "~/components";
import { UserPropsForClientZod, requireAdminUser } from "~/utils";

export const action = async ({ request }: ActionArgs) => {
  const user = await requireAdminUser({ request, redirectTo: "/" });
  const form = await request.formData();
  //const ActionType = form.get("delete") as string;
  // TODO: define action type switch accordingly for update
  const id = form.get("gameId") as string;
  try {
    await dbDeleteGameById(id);
    return redirect("/game");
  } catch (err) {
    console.log(err);
    throw new Response(null, {
      status: 500,
      statusText: "internal server error, failed to delete game",
    });
  }
};

export const loader = async ({ request, params }: ActionArgs) => {
  if (!params.gameId)
    throw new Response(null, {
      status: 404,
      statusText: "gameId not provided",
    });
  const gameItem = await dbGetGameDataById(params.gameId);

  if (!gameItem.length) {
    throw new Response(null, {
      status: 404,
      statusText: "no game exists with the id provided",
    });
  }
  try {
    const isAuthenticated = await authenticatedUser(request);
    return json({ game: gameItem[0], user: isAuthenticated.user });
  } catch (err) {
    console.log(err);
    throw new Response(null, {
      status: 500,
      statusText: "internal server error, failed to authenticate user",
    });
  }
};

const GameItem: React.FC = () => {
  const gameId = useParams();
  const navigation = useNavigation();
  const loaderData = useLoaderData<{
    game: DbReadGameMetaData;
    user: UserPropsForClient;
  }>();
  // conditional renders
  if (navigation.state === "submitting" || navigation.state === "loading") {
    return <Loader />;
  }
  const typeCheckUser = UserPropsForClientZod.safeParse(loaderData.user);
  if (!typeCheckUser.success) {
    console.log(typeCheckUser.error.issues);
    return (
      <ErrorCard errorMessage="something went wrong with the server, please try again" />
    );
  }
  const typeCheckGameData = DbReadGameMetaDataZod.safeParse(loaderData.game);
  if (!typeCheckGameData.success) {
    // log error in console
    console.log(typeCheckGameData.error);
    return (
      <ErrorCard errorMessage="something went wrong with the server please try again" />
    );
  }
  return (
    <>
      {loaderData.user?.userType === "ADMIN" ? (
        <Group>
          <Button>Edit</Button>
          <Form method="post">
            <input
              type="text"
              hidden
              name="gameId"
              readOnly
              value={`${gameId.gameId}`}
            ></input>
            <Button name="delete" value="delete" type="submit">
              Delete
            </Button>
          </Form>
        </Group>
      ) : (
        <></>
      )}
      <GameCard gameItem={loaderData.game} />
    </>
  );
};

export default GameItem;
