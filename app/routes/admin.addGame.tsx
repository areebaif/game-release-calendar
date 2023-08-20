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
import {
  PlatformInput,
  ErrorCard,
  FormFieldsAddGame,
  AddGamePlatformList,
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

export type formObject = {
  constructedUrl: string;
  //[AddGameFormFields.imageUrl]: string;
  [AddGameFormFields.gameName]: string;
  [AddGameFormFields.gameDescription]: string;
  [AddGameFormFields.gamePicBlob]: File | null;
  [AddGameFormFields.platformArray]: platformMergedFields["mergedField"][];
};

type platformMergedFields = {
  mergedField: FormPlatformFields & {
    [AddGameFormFields.platformIdNameReleaseDate]: string;
  };
};

const AddGame: React.FC = () => {
  // hooks
  const platforms = useLoaderData<GamePlatform[]>();
  const actionData = useActionData<{ errors: ErrorAddGameFormFields }>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const [formPlatformFields, setFormPlatformFields] = React.useState<
    FormPlatformFields[]
  >([]);
  //props
  const [gameName, setGameName] = React.useState("");
  const [gameDescription, setGameDescription] = React.useState("");
  const [image, setImage] = React.useState<File | null>(null);
  const [allImages, setAllImages] = React.useState<File[]>([]);
  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [error, setError] = React.useState<ErrorAddGameFormFields>();
  const [isS3UploadComplete, setIsS3UploadComplete] = React.useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [formInput, setFormInput] = React.useState<formObject[]>([]);
  // Type checks: check if the server is sending correct values
  const parsePlatform = GamePlatformZod.safeParse(platforms[0]);
  const serverPostError = ErrorAddGameFormFieldsZod.safeParse(
    actionData?.errors
  );
  // TODO: I might not need a useEffect just set the url when you set image
  React.useEffect(() => {
    if (image) {
      setImageUrl(URL.createObjectURL(image));
    }
  }, [image]);

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
    e.preventDefault();
    setError(undefined);
    // if (!formPlatformFields.length) {
    //   setError({
    //     [AddGameFormFields.platformName]:
    //       "platform name and release date cannot be empty",
    //   });
    //   return;
    // }
    // if (!gameName.length) {
    //   setError({
    //     [AddGameFormFields.gameName]: "Game name cannot be empty",
    //   });
    //   return;
    // }
    // if (gameDescription.length > 1000) {
    //   setError({
    //     [AddGameFormFields.gameDescription]:
    //       "Please add description of 1000 charcters or less",
    //   });
    //   return;
    // }
    // const type = image?.type!;
    // // this functioon checks if the file submitted by the user is of valid type, it also returns the extension of the file
    // const validPictureType = validFileType(type);
    // if (!validPictureType.isValid) {
    //   setError({
    //     [AddGameFormFields.gamePicBlob]:
    //       "please upload correct image type of jpeg or png",
    //   });
    //   return;
    // }
    // open();
    // const $form = e.currentTarget;
    // const s3Data = {
    //   fileType: type,
    //   image: image!,
    // };
    try {
      //   const uploadImage = await getUrlUploadImageToS3(s3Data);
      //   close();
      //   const formData = new FormData($form);
      //   formData.append(AddGameFormFields.imageUrl, `${uploadImage.fileName}`);

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
    } catch (err) {
      console.log(error);
      setIsS3UploadComplete(true);
      throw new Response(null, {
        status: 500,
        statusText: "internal server error, failed to upload image",
      });
    }
  };
  const handleAddGame = () => {
    const mappedPlatormArray = formPlatformFields.map((platformData) => ({
      ...platformData,
      [AddGameFormFields.platformIdNameReleaseDate]: `${platformData.platformId}$${platformData.platformName}$${platformData.releaseDate}`,
    }));
    const formInputVal: formObject = {
      constructedUrl: imageUrl,
      [AddGameFormFields.gameName]: gameName,
      [AddGameFormFields.gameDescription]: gameDescription,
      [AddGameFormFields.gamePicBlob]: image,
      [AddGameFormFields.platformArray]: mappedPlatormArray,
    };
    setAllImages((prev) => [...prev, image!]);
    setFormInput((prev) => [...prev, formInputVal]);
  };
  const handleDeleteGame = (index: number) => {
    const filteredImages = allImages.filter((images, i) => i !== index);
    const filterFormInput = formInput.filter((item, i) => i !== index);
    setAllImages([...filteredImages]);
    setFormInput([...filterFormInput]);
  };
  const platformInputProps = {
    platforms,
    formPlatformFields,
    setFormPlatformFields,
    error,
    actionData,
    setError,
  };
  const platformListProps = {
    formPlatformFields,
    setFormPlatformFields,
  };
  const formFieldsAddGame = {
    gameName,
    setGameName,
    gameDescription,
    setGameDescription,
    image,
    setImage,
    actionData,
    error,
    handleAddGame,
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
        {formPlatformFields.length ? (
          <Card>
            <Card shadow="sm" radius="md" withBorder>
              <AddGamePlatformList {...platformListProps} />
            </Card>
            <FormFieldsAddGame {...formFieldsAddGame} />
          </Card>
        ) : (
          <>
            <FormFieldsAddGame {...formFieldsAddGame} />{" "}
          </>
        )}
        {formInput.length ? (
          formInput.map((item, index) => {
            return (
              <Card shadow="sm" radius="md" mt="sm" withBorder key={index}>
                <Card.Section inheritPadding py="sm" withBorder>
                  <Group position="apart">
                    <Title order={4}>
                      {index + 1} - {item.gameName}
                    </Title>
                    <IconTrash
                      style={{ cursor: "grab" }}
                      onClick={() => {
                        handleDeleteGame(index);
                      }}
                    />
                  </Group>
                </Card.Section>
                <Card shadow="sm" mt="sm" mx="xl" radius="md" withBorder>
                  <Grid>
                    <Grid.Col span={"auto"}>
                      <Title order={5}>Platform Name</Title>
                    </Grid.Col>
                    <Grid.Col span={"auto"}>
                      {" "}
                      <Title order={5}>Release Date</Title>
                    </Grid.Col>
                  </Grid>
                  {item.platformArray.map((formValues, i) => (
                    <React.Fragment key={formValues.platformId}>
                      <Divider my="sm" />
                      <input
                        value={`${formValues.platformId}$${formValues.platformName}$${formValues.releaseDate}$${index}`}
                        type="hidden"
                        name={`${AddGameFormFields.platformIdNameReleaseDate}$${index}`}
                        readOnly
                      ></input>
                      <Grid>
                        <Grid.Col span={"auto"}>
                          <Input
                            variant="unstyled"
                            value={formValues.platformName}
                            readOnly
                          ></Input>
                        </Grid.Col>
                        <Grid.Col span={"auto"}>
                          <Input
                            variant="unstyled"
                            value={formatDate(formValues.releaseDate)}
                            readOnly
                          ></Input>
                        </Grid.Col>
                      </Grid>
                    </React.Fragment>
                  ))}
                </Card>
                <Text pt="xs">
                  <Text span weight={"bold"}>
                    name:{" "}
                  </Text>
                  {item.gameName}
                </Text>
                <Text pt="xs">
                  <Text span weight={"bold"}>
                    description:{" "}
                  </Text>
                  {item.gameDescription}
                </Text>
                <Image
                  mt="md"
                  maw={240}
                  withPlaceholder
                  radius="md"
                  src={item.constructedUrl}
                  alt="game image"
                />
                <FileInput
                  mt="xs"
                  style={{ width: "40%" }}
                  accept="image/*"
                  disabled
                  value={item.gamePicBlob}
                />
                <input
                  hidden={true}
                  value={item.gameName}
                  readOnly
                  name={`${AddGameFormFields.gameName}$${index}`}
                ></input>
                <input
                  hidden={true}
                  readOnly
                  value={item.gameDescription}
                  name={`${AddGameFormFields.gameDescription}$${index}`}
                ></input>
              </Card>
            );
          })
        ) : (
          <></>
        )}
        {formInput.length ? (
          <Group mt="sm" position="center">
            <Button size="lg" type="submit">
              Submit
            </Button>
          </Group>
        ) : (
          <></>
        )}
      </Form>
      <Modal
        opened={opened}
        onClose={close}
        title="Submitting Image to S3 for upload"
        centered
      >
        <Loader></Loader>
      </Modal>
    </>
  );
};

export default AddGame;
