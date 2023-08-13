import * as React from "react";
import { z } from "zod";
import {
  useParams,
  useLoaderData,
  useNavigation,
  useActionData,
  useSubmit,
  Form,
} from "@remix-run/react";
import { redirect, json, Response } from "@remix-run/node";
import { Card, Loader } from "@mantine/core";
// type imports
import type { ActionArgs, TypedResponse } from "@remix-run/node";
import { ErrorCard, FormFieldsEditGame, PlatformInput } from "~/components";
import {
  requireAdminUser,
  db,
  GamePlatformZod,
  dbGetGameDataById,
  DbReadGameMetaDataZod,
} from "~/utils";
import {
  GamePlatform,
  DbReadGameMetaData,
  FormPlatformFields,
  ErrorEditGameFormField,
  DbEditGame,
  EditGameFormFields,
} from "~/utils/types";
import { dbEditGame } from "~/utils/db.server.crud";

export const loader = async ({ request, params }: ActionArgs) => {
  const user = await requireAdminUser({ request });
  if (!user) return redirect("/");
  const typeCheckGameId = z.string().uuid().safeParse(params.gameId);
  if (!typeCheckGameId.success)
    throw new Response(null, {
      status: 404,
      statusText: "invalid gameId provided",
    });
  try {
    const gameItem = await dbGetGameDataById(params.gameId!);
    if (!gameItem.length) {
      throw new Response(null, {
        status: 404,
        statusText: "no game exists with the id provided",
      });
    }

    const platforms = await db.gamePlatform.findMany({
      select: { id: true, name: true },
    });
    return json({ gameItem: gameItem[0], platforms: platforms });
  } catch (err) {
    console.log(err);
    throw new Response(null, {
      status: 500,
      statusText: "internal server error, failed to load platform data",
    });
  }
};

export const action = async ({
  request,
}: ActionArgs): Promise<ErrorEditGameFormField | TypedResponse> => {
  const user = await requireAdminUser({ request });
  if (!user) return redirect("/");
  const form = await request.formData();
  const editGame: DbEditGame = {
    platform: [],
    title: "",
    description: "",
    gameId: "",
  };
  const errors: ErrorEditGameFormField = {};
  try {
    for (const pair of form.entries()) {
      switch (true) {
        case pair[0] === EditGameFormFields.gameId:
          const gameId = pair[1];
          const typeCheckGameId = z.string().uuid().safeParse(gameId).success;
          if (!typeCheckGameId) errors.gameId = "invalid gmaeId supplied";
          editGame.gameId = gameId as string;
          break;
        case pair[0] === EditGameFormFields.platformIdNameReleaseDate:
          const value = pair[1];
          if (typeof value !== "string")
            errors.platformName = "type mismatch please enter value as string";

          const parseFormValue = value as string;

          const splitFormValue = parseFormValue.split("$");

          const [platformId, platformName, releaseDate] = splitFormValue;

          if (!platformName.length)
            errors.platformName = "please provide a value for platform name";

          if (!releaseDate.length)
            errors.releaseDate =
              "please provide value for platform release date";

          const platform = {
            platformId,
            platformName,
            releaseDate,
          };
          editGame.platform.push(platform);
          break;
        case pair[0] === EditGameFormFields.gameName:
          // type checking
          const gameNameVal = pair[1];

          if (typeof gameNameVal !== "string" || gameNameVal.length === 0)
            errors.gameName =
              "please submit game name as string and this fields cannot be empty";

          const gameName = gameNameVal as string;

          editGame.title = gameName;
          break;
        case pair[0] === EditGameFormFields.gameDescription:
          // type checking
          const descriptionVal = pair[1] as string;
          editGame.description = descriptionVal;
          break;
        default:
          throw new Response(null, {
            status: 400,
            statusText:
              "You have submitted a form field that is not supported by the backend",
          });
      }
    }
    const hasError = Object.values(errors).some((errorMessage) =>
      errorMessage?.length ? true : false
    );
    if (hasError) return json({ errors: errors });

    // start adding values to the db
    await dbEditGame(editGame);
    // TODO fix this redirect
    return redirect(`/game/${editGame.gameId}`);
  } catch (err) {
    console.log(err);
    throw new Response(null, {
      status: 500,
      statusText: "Internal Server Error, Please try again",
    });
  }
};

const EditGame: React.FC = () => {
  const gameId = useParams();
  const submit = useSubmit();
  const navigation = useNavigation();
  const loaderData = useLoaderData<{
    gameItem: DbReadGameMetaData;
    platforms: GamePlatform[];
  }>();
  const actionData = useActionData<{ errors: ErrorEditGameFormField }>();
  const dropdownList = loaderData.platforms.map((item) => ({
    ...item,
    value: `${item.id}`,
    label: item.name,
  }));
  const [formPlatformFields, setFormPlatformFields] = React.useState<
    FormPlatformFields[]
  >(loaderData.gameItem.platform);
  const [gameName, setGameName] = React.useState(
    loaderData.gameItem.game.title!
  );
  const [gameDescription, setGameDescription] = React.useState(
    loaderData.gameItem.game.description
      ? loaderData.gameItem.game.description
      : ""
  );
  const [error, setError] = React.useState<ErrorEditGameFormField>();

  // typecheck server data
  const typeCheckGameItem = DbReadGameMetaDataZod.safeParse(
    loaderData.gameItem
  );
  const typeCheckPlatform = GamePlatformZod.safeParse(loaderData.platforms[0]);

  if (!typeCheckPlatform.success || !typeCheckGameItem.success) {
    return (
      <ErrorCard
        errorMessage={"something went wrong with the server please try again"}
      />
    );
  }
  if (navigation.state === "submitting" || navigation.state === "loading") {
    return <Loader />;
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    if (!formPlatformFields.length) {
      setError({
        [EditGameFormFields.platformName]:
          "platform name and release date cannot be empty",
      });
      return;
    }
    if (!gameName.length) {
      setError({
        [EditGameFormFields.gameName]: "Game name cannot be empty",
      });
      return;
    }

    const $form = e.currentTarget;
    const formData = new FormData($form);
    submit(formData, {
      method: "post",
      action: `/admin/editGame/${gameId.gameId}`,
    });
  };

  const platformListProps = {
    formPlatformFields,
    setFormPlatformFields,
  };
  const platformInputProps = {
    platformDropdownList: dropdownList,
    formPlatformFields,
    setFormPlatformFields,
    error,
    actionData,
    setError,
  };
  const formFieldsEditGame = {
    gameId: gameId.gameId!,
    gameName,
    setGameName,
    gameDescription,
    setGameDescription,
    platformListProps,
    actionData,
    error,
    imageUrl: loaderData.gameItem.game.imageUrl!,
  };
  return (
    <>
      {" "}
      <Card
        shadow="sm"
        p="lg"
        radius="md"
        withBorder
        style={{
          overflow: "inherit",
          margin: "15px 0 0 0",
        }}
        sx={(theme) => ({ backgroundColor: theme.colors.gray[1] })}
      >
        <Card.Section inheritPadding py="md">
          <PlatformInput {...platformInputProps} />
        </Card.Section>
      </Card>
      <Card>
        <Card.Section inheritPadding py="md">
          <Form
            method="post"
            action={`/admin/editGame/${gameId.gameId}`}
            onSubmit={onSubmit}
          >
            <FormFieldsEditGame {...formFieldsEditGame} />
          </Form>
        </Card.Section>
      </Card>
    </>
  );
};

export default EditGame;
