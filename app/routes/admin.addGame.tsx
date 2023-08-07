import * as React from "react";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSubmit,
  useActionData,
} from "@remix-run/react";
import { redirect, json, Response } from "@remix-run/node";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
// type imports
import type { ActionArgs, TypedResponse } from "@remix-run/node";
import { Card, Loader } from "@mantine/core";
// local imports
import { PlatformInput, ErrorCard, FormFieldsAddGame } from "~/components";
import {
  db,
  dbCreateGame,
  validFileType,
  getUrlUploadImageToS3,
  s3Client,
} from "~/utils";
// type imports
import {
  GamePlatform,
  FormPlatformFields,
  ErrorAddGameFormFields,
  DbAddGame,
} from "~/utils/types";
import {
  GamePlatformZod,
  AddGameFormFields,
  ErrorAddGameFormFieldsZod,
  requireAdminUser,
} from "~/utils";

export const loader = async ({ request }: ActionArgs) => {
  const user = await requireAdminUser({ request, redirectTo: "/" });
  const platforms = await db.gamePlatform.findMany({
    select: { id: true, name: true },
  });
  return platforms;
};

export const action = async ({
  request,
}: ActionArgs): Promise<ErrorAddGameFormFields | TypedResponse> => {
  const user = await requireAdminUser({ request, redirectTo: "/" });
  const form = await request.formData();
  const addToDb: DbAddGame = {
    platform: [],
    title: "",
    description: "",
    imageUrl: "",
  };
  const errors: ErrorAddGameFormFields = {};
  try {
    for (const pair of form.entries()) {
      switch (true) {
        case pair[0] === AddGameFormFields.platformIdNameReleaseDate:
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
          addToDb.platform.push(platform);
          break;
        case pair[0] === AddGameFormFields.gameName:
          // type checking
          const gameNameVal = pair[1];

          if (typeof gameNameVal !== "string" || gameNameVal.length === 0)
            errors.gameName =
              "please submit game name as string and this fields cannot be empty";

          const gameName = gameNameVal as string;

          addToDb.title = gameName;
          break;
        case pair[0] === AddGameFormFields.gameDescription:
          // type checking
          const descriptionVal = pair[1] as string;
          addToDb.description = descriptionVal;
          break;
        case pair[0] === AddGameFormFields.imageUrl:
          const imageUrlVal = pair[1] as string;
          addToDb.imageUrl = imageUrlVal;
          break;
        default:
          throw new Error(
            "You have submitted a form field that is not supported by the backend"
          );
      }
    }
    const hasError = Object.values(errors).some((errorMessage) =>
      errorMessage?.length ? true : false
    );
    if (hasError) return json({ errors: errors });
    // start adding values to the db
    await dbCreateGame(addToDb);
    return redirect(`/admin`);
  } catch (err) {
    console.log(err);
    // delete aws image if for any reason this code fails, otherwise you will have an image stored in s3 without corresponding database image url
    const s3Params = {
      Bucket: process.env.BUCKET_NAME,
      Key: addToDb.imageUrl,
    };
    const command = new DeleteObjectCommand(s3Params);
    try {
      const response = await s3Client.send(command);
      console.log(response);
    } catch (err) {
      // This error happens while deleteing s3 object
      console.log(err);
    } finally {
      const res: Response = new Response(null, {
        status: 500,
        statusText: "Internal Server Error, Please try again",
      });
    }
  }
};

const AddGame: React.FC = () => {
  // hooks
  // TODO: error handling of thrown errors using catch boundaries
  const platforms = useLoaderData<GamePlatform[]>();
  const actionData = useActionData<{ errors: ErrorAddGameFormFields }>();
  const navigation = useNavigation();
  const submit = useSubmit();
  // derive props
  const dropdownList = platforms.map((item) => ({
    ...item,
    value: `${item.id}`,
    label: item.name,
  }));
  const [platformDropdownList, setPlatformDropdownList] =
    React.useState(dropdownList);
  const [formPlatformFields, setFormPlatformFields] = React.useState<
    FormPlatformFields[]
  >([]);
  //props
  const [gameName, setGameName] = React.useState("");
  const [gameDescription, setGameDescription] = React.useState("");
  const [image, setImage] = React.useState<File | null>(null);
  const [error, setError] = React.useState<ErrorAddGameFormFields>();
  // Type checks: check if the server is sending correct values
  const parsePlatform = GamePlatformZod.safeParse(platforms[0]);
  const serverPostError = ErrorAddGameFormFieldsZod.safeParse(
    actionData?.errors
  );
  if (!parsePlatform.success || !serverPostError.success) {
    // log error in console
    !parsePlatform.success
      ? console.log(parsePlatform.error)
      : !serverPostError.success
      ? console.log(serverPostError.error)
      : undefined;
    // return error to client
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
    try {
      e.preventDefault();
      setError(undefined);
      if (!formPlatformFields.length) {
        setError({
          [AddGameFormFields.platformName]:
            "platform name and release date cannot be empty",
        });
        return;
      }
      if (!gameName.length) {
        setError({
          [AddGameFormFields.gameName]: "Game name cannot be empty",
        });
        return;
      }
      const type = image?.type!;
      // this functioon checks if the file submitted by the user is of valid type, it also returns the extension of the file
      const validPictureType = validFileType(type);
      if (!validPictureType.isValid) {
        setError({
          [AddGameFormFields.gamePicBlob]:
            "please upload correct image type of jpeg or png",
        });
        return;
      }
      const $form = e.currentTarget;
      const s3Data = {
        fileType: type,
        image: image!,
      };

      const uploadImage = await getUrlUploadImageToS3(s3Data);

      const formData = new FormData($form);

      formData.append(AddGameFormFields.imageUrl, `${uploadImage.fileName}`);

      submit(formData, {
        method: "post",
        action: "/admin/addGame",
      });
    } catch (err) {
      console.log(error);
      setError({
        ...error,
        [AddGameFormFields.gamePicBlob]:
          "internal server error: something went wrong with image upload",
      });
    }
  };

  const platformInputProps = {
    platformDropdownList,
    setPlatformDropdownList,
    formPlatformFields,
    setFormPlatformFields,
    error,
    actionData,
    setError,
  };
  const platformListProps = {
    formPlatformFields,
    setFormPlatformFields,
    setPlatformDropdownList,
    platformDropdownList,
    dropdownList,
  };
  const formFieldsAddGame = {
    gameName,
    setGameName,
    gameDescription,
    setGameDescription,
    image,
    setImage,
    platformListProps,
    actionData,
    error,
  };

  return (
    <>
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
          <Form method="post" action="/admin/addGame" onSubmit={onSubmit}>
            <FormFieldsAddGame {...formFieldsAddGame} />
          </Form>
        </Card.Section>
      </Card>
    </>
  );
};

export default AddGame;
