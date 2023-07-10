import * as React from "react";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSubmit,
  useActionData,
  useFetcher,
} from "@remix-run/react";
import { redirect } from "@remix-run/node";

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
import { db, uploadPicture, validFileType } from "~/utils";
// type imports
import {
  GamePlatform,
  FormPlatformFields,
  ErrorFormFields,
} from "~/utils/zod/types";
import {
  GamePlatformZod,
  AddGameFormFields,
  ErrorFormFieldsZod,
} from "~/utils/zod";
import { ImageUploadApiZod } from "~/utils/zod/imageUploadApi";
import { uploadToS3 } from "~/utils/pictureUpload";

export const loader = async () => {
  const platforms = await db.gamePlatform.findMany({
    select: { id: true, name: true },
  });
  return platforms;
};

export const action = async ({
  request,
}: ActionArgs): Promise<ErrorFormFields | TypedResponse> => {
  const form = await request.formData();
  // check if any platformId value is invalid
  const platformId = form.get(`${AddGameFormFields.pictureUrl}`);
  console.log(platformId, "hdododod!!!!!!!!!!!!!!!!!!!!!!!");
  if (!platformId?.length) {
    return {
      isError: true,
      field: AddGameFormFields.platformId,
      message:
        "error submitting form, please include platform Id to insert in the database",
    };
  }

  // for (const pair of form.entries()) {
  //   console.log(pair, "hfhfhfh  ");
  // }

  return redirect(`/`);
};

const AddGame: React.FC = () => {
  // hooks
  const platforms = useLoaderData<GamePlatform[]>();
  const actionData = useActionData<ErrorFormFields>();
  const fetcher = useFetcher();
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
  const [gameName, setGameName] = React.useState("");
  const [gameDescription, setGameDescription] = React.useState("");
  const [pictureBlob, setPictureBlob] = React.useState<File | null>(null);
  const [error, setError] = React.useState<ErrorFormFields>();
  // Type checks: check if the server is sending correct values
  const parsePlatform = GamePlatformZod.safeParse(platforms[0]);
  const serverPostError = ErrorFormFieldsZod.safeParse(actionData);

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
    e.preventDefault();
    setError(undefined);

    if (!formPlatformFields.length) {
      setError({
        isError: true,
        message: "platform name and release date cannot be empty",
        field: AddGameFormFields.platformName,
      });
      return;
    }
    const type = pictureBlob?.type!;
    // this functioon checks if the file submitted by the user is of valid type, it also returns the extension of the file
    const validPictureType = validFileType(type);
    if (!validPictureType.isValid) {
      setError({
        isError: true,
        message: "upload picture with file extension png or jpeg",
        field: AddGameFormFields.gamePicBlob,
      });
      return;
    }
    const $form = e.currentTarget;
    const formData = new FormData($form);
    // const s3FormData = new FormData();
    // s3FormData.append("fileType", type);
    // get the url
    const result = await uploadPicture(type);
    const parseResult = ImageUploadApiZod.safeParse(result);
    if (!parseResult.success) {
      console.log(error);
      setError({
        isError: true,
        message:
          "something went wrong with the picture upload, please try again",
        field: AddGameFormFields.gamePicBlob,
      });
      return;
    }
    // attempt image upload to s3 now
    const upload = await uploadToS3(pictureBlob!, type, result.signedUrl);
    console.log(" I do not expect to be hit right now", upload);

    const fileUrl = result?.fileName!;
    // add the fileUrl to the formData
    formData.append(AddGameFormFields.pictureUrl, fileUrl);
    submit(formData, {
      method: "post",
      action: "/admin/addGame",
      encType: "multipart/form-data",
    });
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
              name={AddGameFormFields.gamePicBlob}
              label="Upload files"
              placeholder="Upload files"
              icon={<IconUpload size="16px" />}
              accept="image/*"
              value={pictureBlob}
              onChange={setPictureBlob}
            />
            {error && error.field === AddGameFormFields.gamePicBlob ? (
              <ErrorCard errorMessage={error.message} />
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
