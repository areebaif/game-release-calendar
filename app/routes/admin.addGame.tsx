import * as React from "react";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSubmit,
  useActionData,
} from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
// type imports
import type { ActionArgs, TypedResponse } from "@remix-run/node";
import {
  Card,
  Button,
  Loader,
  TextInput,
  Textarea,
  FileInput,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
// local imports
import { GamePlatformList, FormPlatformList, ErrorCard } from "~/components";
import {
  db,
  dbCreateGame,
  validFileType,
  getUrlUploadImageToS3,
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
} from "~/utils";

export const loader = async () => {
  const platforms = await db.gamePlatform.findMany({
    select: { id: true, name: true },
  });
  return platforms;
};

export const action = async ({
  request,
}: ActionArgs): Promise<ErrorAddGameFormFields | TypedResponse> => {
  console.log(" inside,acsstt!!!!!!!!!!!!!!!!!!!!!!!!!!");
  const form = await request.formData();

  const addToDb: DbAddGame = {
    platform: [],
    title: "",
    description: "",
    imageUrl: "",
  };

  const errors: ErrorAddGameFormFields = {};

  for (const pair of form.entries()) {
    switch (true) {
      case pair[0] === AddGameFormFields.platformIdNameReleaseDate:
        const value = pair[1];
        if (typeof value !== "string")
          errors.platformName = "type mismatch please enter value as string";

        const parseFormValue = value as string;

        const splitFormValue = parseFormValue.split("$");

        const [platformId, platformName, releaseDate] = splitFormValue;

        // TODO: check valid uuid supplied by client for platform id

        if (!platformName.length)
          errors.platformName = "please provide a value for platform name";

        if (!releaseDate.length)
          errors.releaseDate = "please provide value for platform release date";

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
  console.log(addToDb, "dhjdhdhdhdhdhd");
  const hasError = Object.values(errors).some((errorMessage) =>
    errorMessage?.length ? true : false
  );
  if (hasError) return json({ errors: errors });

  // start adding values to the db
  const createGame = await dbCreateGame(addToDb);

  return redirect(`/`);
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
  const [pictureBlob, setPictureBlob] = React.useState<File | null>(null);
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
  const onSubmit = async (e: any) => {
    try {
      e.preventDefault();
      setError(undefined);
      if (!formPlatformFields.length) {
        setError({
          ...error,
          [AddGameFormFields.platformName]:
            "platform name and release date cannot be empty",
        });
        return;
      }
      if (!gameName.length) {
        setError({
          ...error,
          [AddGameFormFields.gameName]: "Game name cannot be empty",
        });
        return;
      }
      const type = pictureBlob?.type!;
      // this functioon checks if the file submitted by the user is of valid type, it also returns the extension of the file
      const validPictureType = validFileType(type);
      if (!validPictureType.isValid) {
        setError({
          ...error,
          [AddGameFormFields.gamePicBlob]:
            "please upload correct image type of jpeg or png",
        });
        return;
      }
      const $form = e.currentTarget;
      const s3Data = {
        fileType: type,
        image: pictureBlob!,
      };
      // TODO: uncomment s3 upload
      console.log(" Ia m heree!!!!!!!!!!!!!");
      const uploadImage = await getUrlUploadImageToS3(s3Data);
      console.log(" sisisisisisisisisisi", uploadImage.fileName);
      // const uploadImage = {
      //   fileName: "terst",
      // };

      console.log(" sisisisisisisisisisi", uploadImage.fileName);
      const formData = new FormData($form);
      console.log(" sisisisisisisisisisi", uploadImage.fileName);
      formData.append(AddGameFormFields.imageUrl, `${uploadImage.fileName}`);
      console.log(" sisisisisisisisisisi", uploadImage.fileName);
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

  const gamePlatformInputProps = {
    platformDropdownList,
    setPlatformDropdownList,
    formPlatformFields,
    setFormPlatformFields,
    error,
    actionData,
    setError,
  };
  const formPlatformListProps = {
    formPlatformFields,
    setFormPlatformFields,
    setPlatformDropdownList,
    platformDropdownList,
    dropdownList,
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
          <GamePlatformList {...gamePlatformInputProps} />
        </Card.Section>
      </Card>
      <Card>
        <Card.Section inheritPadding py="md">
          <Form method="post" action="/admin/addGame" onSubmit={onSubmit}>
            <FormPlatformList {...formPlatformListProps} />
            <TextInput
              withAsterisk
              label="Name"
              placeholder="type here"
              value={gameName}
              type="text"
              name={AddGameFormFields.gameName}
              onChange={(event) => setGameName(event.currentTarget.value)}
            ></TextInput>
            {actionData?.errors?.gameName || error?.gameName ? (
              <ErrorCard
                errorMessage={
                  actionData?.errors?.gameName
                    ? actionData?.errors?.gameName
                    : error?.gameName
                }
              />
            ) : (
              <></>
            )}
            <Textarea
              label="Description"
              placeholder="type here"
              value={gameDescription}
              name={AddGameFormFields.gameDescription}
              onChange={(event) =>
                setGameDescription(event.currentTarget.value)
              }
            ></Textarea>
            <FileInput
              // we will not submit this field to the backend, we will submit the fileURL we get from s3 to backend: we will append that field to the form data
              // we need the field to display errror to the user/client.
              label="Upload files"
              placeholder="Upload files"
              icon={<IconUpload size="16px" />}
              accept="image/*"
              value={pictureBlob}
              onChange={setPictureBlob}
            />
            {error?.gamePicBlob ? (
              <ErrorCard
                errorMessage={"please upload image type jpeg or png"}
              />
            ) : (
              <></>
            )}
            <Button type="submit">Submit</Button>
          </Form>
        </Card.Section>
      </Card>
    </>
  );
};

export default AddGame;
