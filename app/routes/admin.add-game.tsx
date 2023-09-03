import * as React from "react";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSubmit,
  useActionData,
} from "@remix-run/react";
import { redirect, json, Response } from "@remix-run/node";
import { Prisma } from "@prisma/client";
import { deleteImagesFromS3, uploadImagesToS3 } from "~/utils";
import { Button, Card, Loader, Title, Group } from "@mantine/core";
// type imports
import type { ActionArgs, TypedResponse } from "@remix-run/node";
// local imports
import {
  PlatformInput,
  ErrorCard,
  AddGameUserInput,
  GameSpecificPlatformList,
  AddGameFormObjClient,
  AddGameFormDataDisplayCard,
} from "~/components";
import {
  db,
  GamePlatformZod,
  ErrorAddGameFormFieldsZod,
  requireAdminUser,
  validImageSizeZod,
  validImageTypeZod,
  dbCreateMultipleGames,
} from "~/utils";
// type imports
import {
  GamePlatform,
  FormPlatformFields,
  ErrorAddGameFormFields,
  DbAddGame,
  AddGameFormFields,
  GameGenre,
} from "~/utils/types";
import { GameGenreZod } from "~/utils/zod.Game";

export const loader = async ({ request }: ActionArgs) => {
  try {
    const user = await requireAdminUser({ request });
    if (!user) return redirect("/");
    const platforms = await db.gamePlatform.findMany({
      select: { id: true, name: true },
    });
    const genre = await db.gameGenre.findMany({
      select: { id: true, name: true },
    });
    return json({ platforms, genre });
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
  const games: { [key: string]: DbAddGame } = {};
  const errors: ErrorAddGameFormFields = {};

  try {
    for (const pair of form.entries()) {
      switch (true) {
        case pair[0].includes(AddGameFormFields.platformIdNameReleaseDate):
          const splitField = pair[0].split("$");
          const [field, gameIndex] = splitField;
          const value = pair[1];
          if (typeof value !== "string")
            errors.platformName = "type mismatch please enter value as string";
          // this is value split
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
          if (!games[gameIndex]) {
            games[gameIndex] = {
              platform: [platform],
              title: "",
              description: "",
              imageUrl: "",
              imageBlob: undefined,
              imageType: "",
              genre: [],
            };
          } else {
            games[gameIndex].platform.push(platform);
          }
          break;
        case pair[0].includes(AddGameFormFields.gameName):
          const splitNameField = pair[0].split("$");
          const [nameField, index] = splitNameField;
          // type checking
          const gameNameVal = pair[1];
          if (typeof gameNameVal !== "string" || gameNameVal.length === 0)
            errors.gameName =
              "please submit game name as string and this fields cannot be empty";
          const gameName = gameNameVal as string;
          const nameExists = await db.game.findUnique({
            where: { title: gameName },
          });
          if (nameExists?.id) {
            errors.gameName =
              "This is a unqiue contraint violation. The game name already exists in the system. ou cannot use this name again.";
          }
          if (!games[index]) {
            games[index] = {
              platform: [],
              title: gameName,
              description: "",
              imageUrl: "",
              imageBlob: undefined,
              imageType: "",
              genre: [],
            };
          } else {
            games[index].title = gameName;
          }
          break;
        case pair[0].includes(AddGameFormFields.gameDescription):
          const splitDescField = pair[0].split("$");
          const [descriptionField, gIndex] = splitDescField;
          const descriptionVal = pair[1];
          if (
            typeof descriptionVal !== "string" ||
            descriptionVal.length > 1000
          )
            errors.gameDescription =
              "please submit description as string and character length cannot exceed 1000";
          if (!games[gIndex]) {
            games[gIndex] = {
              platform: [],
              title: "",
              description: descriptionVal as string,
              imageUrl: "",
              imageBlob: undefined,
              imageType: "",
              genre: [],
            };
          } else {
            games[gIndex].description = descriptionVal as string;
          }
          break;
        case pair[0].includes(AddGameFormFields.gameGenre):
          const splitGenreField = pair[0].split("$");
          const [genreField, gaIndex] = splitGenreField;
          const genreId = pair[1];
          console.log(genreId, "lalalalalalalaalalal");
          if (typeof genreId !== "string" || !genreId.length)
            errors.gameGenre = "please submit correct values for game genre";
          const genreString = genreId as string;
          if (!games[gaIndex]) {
            games[gaIndex] = {
              platform: [],
              title: "",
              description: "",
              imageUrl: "",
              imageBlob: undefined,
              imageType: "",
              genre: [genreString],
            };
          } else {
            games[gaIndex].genre.push(genreString);
          }
          break;
        case pair[0].includes(AddGameFormFields.gamePicBlob):
          const splitImageField = pair[0].split("$");
          const [imageField, gamIndex] = splitImageField;
          const imageBlob = pair[1] as Blob;
          const validImageType = validImageTypeZod.safeParse(
            imageBlob.type
          ).success;
          const validImageSize = validImageSizeZod.safeParse(
            imageBlob.size
          ).success;
          if (!validImageType || !validImageSize) {
            errors.gamePicBlob =
              " please upload image of type image/png, image/jpeg and image size can not exceed 3mb ";
          }
          // There is a check after all switch statements to show errors for all fields, but we are making an exception here since
          // connverting file to buffer is relatively an expensive operation and we want to return early if there is an error with image type and size before we do any conversions.
          if (errors.gamePicBlob) {
            return json({ errors: errors });
          }
          const bytesArray = await imageBlob.arrayBuffer();
          const imageBuffer = Buffer.from(bytesArray);
          if (!games[gamIndex]) {
            games[gamIndex] = {
              platform: [],
              title: "",
              description: "",
              imageUrl: "",
              imageBlob: imageBuffer,
              imageType: imageBlob.type,
              genre: [],
            };
          } else {
            games[gamIndex].imageBlob = imageBuffer;
            games[gamIndex].imageType = imageBlob.type;
          }
          break;
        default:
          errors.generalError =
            "you have submitted a form field that backedn does not recognize";
      }
    }
    const hasError = Object.values(errors).some((errorMessage) =>
      errorMessage?.length ? true : false
    );
    if (hasError) return json({ errors: errors });
    // this uploadImage function also sets the url of the images to be added to database
        const imagePromises = uploadImagesToS3(games);
    await Promise.all(imagePromises);
        // the games are uploaded in a transaction lock, hence either entire operation will succeed or fail.
    // We are doing these in a lock because if any game upload to db fails then we have to roll back image upload to s3 aswell
    await dbCreateMultipleGames(games);
    return redirect(`/admin`);
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // for any reason prisma operation fails I have to roll back s3 image uploads
      try {
        const deleteImagesPromises = deleteImagesFromS3(games);
        await Promise.all(deleteImagesPromises);
        // TODO: again needs to be a general error
        errors.gameName =
          "something went wrong with the database, please try again later.";
        return json({ errors: errors });
      } catch (err) {
        // This error happens while deleteing s3 object
        console.log(err);
        errors.gamePicBlob =
          "something went wrong with the database, please try again later.";
        return json({ errors: errors });
      }
    }
  }
};

const AddGame: React.FC = () => {
  // hooks
  const loaderData = useLoaderData<{
    platforms: GamePlatform[];
    genre: GameGenre[];
  }>();
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
  const [selectedGameGenreList, setSelectedGameGenreList] =
    React.useState<string[]>();

  const [allFormFields, setAllFormFields] = React.useState<
    AddGameFormObjClient[]
  >([]);
  const [error, setError] = React.useState<ErrorAddGameFormFields>();

  // Type checks: check if the server is sending correct values
  const parsePlatform = GamePlatformZod.safeParse(loaderData.platforms[0]);
  const parseGenre = GameGenreZod.safeParse(loaderData.genre[0]);
  const serverPostError = ErrorAddGameFormFieldsZod.safeParse(
    actionData?.errors
  );
  if (
    !parsePlatform.success ||
    !serverPostError.success ||
    !parseGenre.success ||
    actionData?.errors?.generalError
  ) {
    const generalError = actionData?.errors?.generalError;
    !parsePlatform.success
      ? console.log(parsePlatform.error)
      : !serverPostError.success
      ? console.log(serverPostError.error)
      : !parseGenre.success
      ? console.log(parseGenre.error)
      : console.log(generalError);
    return (
      <ErrorCard
        errorMessage={
          generalError
            ? generalError
            : "something went wrong with the server please try again"
        }
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
    allImages.forEach((image, index) => {
      formData.append(`${AddGameFormFields.gamePicBlob}$${index}`, image);
    });
    submit(formData, {
      method: "post",
      encType: "multipart/form-data",
      action: "/admin/add-game",
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
    if (!selectedGameGenreList?.length) {
      setError({
        [AddGameFormFields.gameGenre]: "Please select a game genre",
      });
      return;
    }
    const validImageType = validImageTypeZod.safeParse(image?.type).success;
    const validImageSize = validImageSizeZod.safeParse(image?.size).success;
    if (!validImageType || !validImageSize) {
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
    const mappedGameGenre = selectedGameGenreList?.map((genreId) => {
      const genreName = loaderData.genre.filter(
        (item) => `${item.id}` === genreId
      );
      return {
        id: genreId,
        name: genreName[0].name,
      };
    });
    const formInputVal: AddGameFormObjClient = {
      constructedUrl: imageUrl,
      [AddGameFormFields.gameName]: gameName,
      [AddGameFormFields.gameDescription]: gameDescription,
      [AddGameFormFields.gamePicBlob]: image,
      [AddGameFormFields.platformArray]: mappedPlatormArray,
      [AddGameFormFields.gameGenre]: mappedGameGenre,
    };
    // setInput fields to default
    setAllImages((prev) => [...prev, image!]);
    setAllFormFields((prev) => [...prev, formInputVal]);
    setGameName("");
    setGameDescription("");
    setImage(null);
    setGamePlatformList([]);
    setSelectedGameGenreList([]);
  };

  const handleDeleteGame = (index: number) => {
    // delet from images
    const filteredImages = allImages.filter((images, i) => i !== index);
    // delete from form
    const filterFormInput = allFormFields.filter((item, i) => i !== index);
    setAllImages([...filteredImages]);
    setAllFormFields([...filterFormInput]);
  };
  // props for components
  const platformInputProps = {
    platforms: loaderData.platforms,
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
    gameGenre: loaderData.genre,
    selectedGameGenreList,
    setSelectedGameGenreList,
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
          <Title order={4}>Add game specific platforms</Title>
        </Card.Section>
        <Card.Section inheritPadding py="md">
          <PlatformInput {...platformInputProps} />
        </Card.Section>
      </Card>
      <Form onSubmit={onSubmit}>
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
        {allFormFields.length ? (
          <>
            <AddGameFormDataDisplayCard
              handleDeleteGame={handleDeleteGame}
              formInput={allFormFields}
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
