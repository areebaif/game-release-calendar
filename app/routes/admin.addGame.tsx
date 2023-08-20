import * as React from "react";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSubmit,
  useActionData,
} from "@remix-run/react";
import { IconTrash, IconUpload } from "@tabler/icons-react";
import { redirect, json, Response } from "@remix-run/node";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { formatDate } from "~/utils";
import {
  Button,
  Card,
  Loader,
  Modal,
  Title,
  Group,
  FileInput,
  Text,
  Image,
  Grid,
  Divider,
  Input,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
// type imports
import type { ActionArgs, TypedResponse } from "@remix-run/node";
// local imports
import { AddGameFormObjClient, AddGameFormDataDisplayCard } from "~/components";
import {
  PlatformInput,
  ErrorCard,
  AddGameUserInput,
  GameSpecificPlatformList,
} from "~/components";
import {
  db,
  dbCreateGame,
  validFileType,
  getUrlUploadImageToS3,
  s3Client,
  GamePlatformZod,
  ErrorAddGameFormFieldsZod,
  requireAdminUser,
} from "~/utils";
// type imports
import {
  GamePlatform,
  FormPlatformFields,
  ErrorAddGameFormFields,
  DbAddGame,
  AddGameFormFields,
  AddPlatformFormFields,
} from "~/utils/types";

export const loader = async ({ request }: ActionArgs) => {
  try {
    const user = await requireAdminUser({ request });
    if (!user) return redirect("/");
    const platforms = await db.gamePlatform.findMany({
      select: { id: true, name: true },
    });
    return platforms;
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
}: ActionArgs): Promise<ErrorAddGameFormFields | TypedResponse> => {
  const user = await requireAdminUser({ request });
  if (!user) return redirect("/");
  const form = await request.formData();
  const addToDb: DbAddGame = {
    platform: [],
    title: "",
    description: "",
    imageUrl: "",
  };
  const errors: ErrorAddGameFormFields = {};
  console.log(form);
  try {
    for (const pair of form.entries()) {
      console.log(pair, " Hi this is a test");
    }
    // for (const pair of form.entries()) {
    //   switch (true) {
    //     case pair[0] === AddGameFormFields.platformIdNameReleaseDate:
    //       const value = pair[1];
    //       if (typeof value !== "string")
    //         errors.platformName = "type mismatch please enter value as string";

    //       const parseFormValue = value as string;

    //       const splitFormValue = parseFormValue.split("$");

    //       const [platformId, platformName, releaseDate] = splitFormValue;

    //       if (!platformName.length)
    //         errors.platformName = "please provide a value for platform name";

    //       if (!releaseDate.length)
    //         errors.releaseDate =
    //           "please provide value for platform release date";

    //       const platform = {
    //         platformId,
    //         platformName,
    //         releaseDate,
    //       };
    //       addToDb.platform.push(platform);
    //       break;
    //     case pair[0] === AddGameFormFields.gameName:
    //       // type checking
    //       const gameNameVal = pair[1];

    //       if (typeof gameNameVal !== "string" || gameNameVal.length === 0)
    //         errors.gameName =
    //           "please submit game name as string and this fields cannot be empty";

    //       const gameName = gameNameVal as string;

    //       addToDb.title = gameName;
    //       break;
    //     case pair[0] === AddGameFormFields.gameDescription:
    //       // type checking

    //       const descriptionVal = pair[1];
    //       if (
    //         typeof descriptionVal !== "string" ||
    //         descriptionVal.length > 1000
    //       )
    //         errors.gameDescription =
    //           "please submit description as string and character length cannot exceed 1000";
    //       addToDb.description = descriptionVal as string;
    //       break;
    //     case pair[0] === AddGameFormFields.imageUrl:
    //       const imageUrlVal = pair[1] as string;
    //       addToDb.imageUrl = imageUrlVal;
    //       break;
    //     default:
    //       throw new Response(null, {
    //         status: 400,
    //         statusText:
    //           "You have submitted a form field that is not supported by the backend",
    //       });
    //   }
    // }
    // const hasError = Object.values(errors).some((errorMessage) =>
    //   errorMessage?.length ? true : false
    // );
    // if (hasError) return json({ errors: errors });
    // // start adding values to the db
    // await dbCreateGame(addToDb);
    // return redirect(`/admin`);
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
      throw new Response(null, {
        status: 500,
        statusText: "Internal Server Error, Please try again",
      });
    } catch (err) {
      // This error happens while deleteing s3 object
      console.log(err);
      throw new Response(null, {
        status: 500,
        statusText: "Internal Server Error, Please try again",
      });
    }
  }
};

const AddGame: React.FC = () => {
  // hooks
  const platforms = useLoaderData<GamePlatform[]>();
  const actionData = useActionData<{ errors: ErrorAddGameFormFields }>();
  const navigation = useNavigation();
  const submit = useSubmit();
  //props
  const [gamePlatformList, setGamePlatformList] = React.useState<
    FormPlatformFields[]
  >([]);
  const [gameName, setGameName] = React.useState("");
  const [gameDescription, setGameDescription] = React.useState("");
  const [image, setImage] = React.useState<File | null>(null);
  // we need the imageUrl to display a thumbnail of image
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [allImages, setAllImages] = React.useState<File[]>([]);
  const [formInput, setFormInput] = React.useState<AddGameFormObjClient[]>([]);
  const [error, setError] = React.useState<ErrorAddGameFormFields>();

  // Type checks: check if the server is sending correct values
  const parsePlatform = GamePlatformZod.safeParse(platforms[0]);
  const serverPostError = ErrorAddGameFormFieldsZod.safeParse(
    actionData?.errors
  );

  if (!parsePlatform.success || !serverPostError.success) {
    !parsePlatform.success
      ? console.log(parsePlatform.error)
      : !serverPostError.success
      ? console.log(serverPostError.error)
      : undefined;
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
    const $form = e.currentTarget;
    const formData = new FormData($form);
    // add images to the form
    allImages.forEach((image, index) => {
      formData.append(`${AddGameFormFields.gamePicBlob}$${index}`, image);
    });

    submit(formData, {
      method: "post",
      encType: "multipart/form-data",
      action: "/admin/addGame",
    });
  };
  const handleAddGame = () => {
    // check user inputs
    setError(undefined);
    if (!gamePlatformList.length) {
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
    if (gameDescription.length > 1000) {
      setError({
        [AddGameFormFields.gameDescription]:
          "Please add description of 1000 charcters or less",
      });
      return;
    }
    const type = image?.type!;
    // this functioon checks if the file submitted by the user is of valid type
    const validPictureType = validFileType(type);
    if (!validPictureType.isValid) {
      setError({
        [AddGameFormFields.gamePicBlob]:
          "please upload correct image type of jpeg or png",
      });
      return;
    }
    // add all the data to the form
    const mappedPlatormArray = gamePlatformList.map((platformData) => ({
      ...platformData,
      [AddGameFormFields.platformIdNameReleaseDate]: `${platformData.platformId}$${platformData.platformName}$${platformData.releaseDate}`,
    }));
    const formInputVal: AddGameFormObjClient = {
      constructedUrl: imageUrl,
      [AddGameFormFields.gameName]: gameName,
      [AddGameFormFields.gameDescription]: gameDescription,
      [AddGameFormFields.gamePicBlob]: image,
      [AddGameFormFields.platformArray]: mappedPlatormArray,
    };
    // setInput fields to default
    setAllImages((prev) => [...prev, image!]);
    setFormInput((prev) => [...prev, formInputVal]);
    setGameName("");
    setGameDescription("");
    setImage(null);
    setGamePlatformList([]);
  };

  const handleDeleteGame = (index: number) => {
    // delet from images
    const filteredImages = allImages.filter((images, i) => i !== index);
    // delete from form
    const filterFormInput = formInput.filter((item, i) => i !== index);
    setAllImages([...filteredImages]);
    setFormInput([...filterFormInput]);
  };
  // props for components
  const platformInputProps = {
    platforms,
    gamePlatformList,
    setGamePlatformList,
    error,
    actionData,
    setError,
  };
  const gameSpecificPlatformList = {
    gamePlatformList,
    setGamePlatformList,
  };
  const addGameUserInput = {
    gameName,
    setGameName,
    gameDescription,
    setGameDescription,
    image,
    setImage,
    actionData,
    error,
    handleAddGame,
    imageUrl,
    setImageUrl,
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
          margin: "15px 0 15px 0",
        }}
      >
        <Card.Section inheritPadding py="sm" withBorder>
          <Title order={4}>Add Platform</Title>
        </Card.Section>
        <Card.Section inheritPadding py="md">
          <PlatformInput {...platformInputProps} />
        </Card.Section>
      </Card>
      <Form method="post" action="/admin/addGame" onSubmit={onSubmit}>
        {gamePlatformList.length ? (
          <Card>
            <Card shadow="sm" radius="md" withBorder>
              <GameSpecificPlatformList {...gameSpecificPlatformList} />
            </Card>
            <AddGameUserInput {...addGameUserInput} />
          </Card>
        ) : (
          <>
            <AddGameUserInput {...addGameUserInput} />{" "}
          </>
        )}
        {formInput.length ? (
          <>
            <AddGameFormDataDisplayCard
              handleDeleteGame={handleDeleteGame}
              formInput={formInput}
            />
            <Group mt="sm" position="center">
              <Button size="lg" type="submit">
                Submit
              </Button>
            </Group>
          </>
        ) : (
          <></>
        )}
      </Form>
    </>
  );
};

export default AddGame;
