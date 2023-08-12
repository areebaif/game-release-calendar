import { json, redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { z } from "zod";
import {
  useParams,
  useLoaderData,
  useNavigation,
  Form,
  Link,
} from "@remix-run/react";
import { Button, Group, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  dbGetGameDataById,
  DbReadGameMetaDataZod,
  authenticatedUser,
  dbDeleteGameById,
} from "~/utils";
import {
  DbReadGameMetaData,
  DeleteGameFormFields,
  UserPropsForClient,
  ErrorDeleteGameFormField,
} from "~/utils/types";
import { ErrorCard, GameCard } from "~/components";
import { UserPropsForClientZod, requireAdminUser } from "~/utils";

export const action = async ({ request }: ActionArgs) => {
  const user = await requireAdminUser({ request, redirectTo: "/" });

  const form = await request.formData();
  const id = form.get(`${DeleteGameFormFields.GameId}`);

  const errors: ErrorDeleteGameFormField = {};

  const typeCheckId = z.string().uuid().safeParse(id);
  if (!typeCheckId.success) {
    errors.gameId = "please provide a valid id to delete game";
  }

  try {
    // we have already typechecked this
    const gameId = id as string;
    await dbDeleteGameById(gameId);
    const hasError = Object.values(errors).some((errorMessage) =>
      errorMessage?.length ? true : false
    );
    if (hasError) return json({ errors: errors });
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
  const typeCheckGameId = z.string().uuid().safeParse(params.gameId);
  if (!typeCheckGameId.success)
    throw new Response(null, {
      status: 404,
      statusText: "invalid gameId provided",
    });
  const gameItem = await dbGetGameDataById(params.gameId!);

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
  const [opened, { open, close }] = useDisclosure(false);
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
          <Button component={Link} to={`/admin/editGame/${gameId.gameId}`}>
            Edit
          </Button>
          <Form method="post">
            <input
              type="text"
              hidden
              name={`${DeleteGameFormFields.GameId}`}
              readOnly
              value={`${gameId.gameId}`}
            ></input>
            <Button type="submit">Delete</Button>
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
