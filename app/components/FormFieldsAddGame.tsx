import { Button, TextInput, Textarea, FileInput } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { PlatformList, ErrorCard } from "~/components";
// type imports
import { ErrorAddGameFormFields } from "~/utils/types";
import { AddGameFormFields } from "~/utils";
import { PlatformListProps } from "./PlatformList";

type FormFieldsAddGame = {
  gameName: string;
  setGameName: (val: string) => void;
  gameDescription: string;
  setGameDescription: (val: string) => void;
  image: File | null;
  setImage: (val: File) => void;
  platformListProps: PlatformListProps;
  actionData: { errors: ErrorAddGameFormFields } | undefined;
  error: ErrorAddGameFormFields;
};

export const FormFieldsAddGame: React.FC<FormFieldsAddGame> = ({
  gameName,
  setGameName,
  gameDescription,
  setGameDescription,
  image,
  setImage,
  platformListProps,
  actionData,
  error,
}) => {
  return (
    <>
      <PlatformList {...platformListProps} />
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
        onChange={(event) => setGameDescription(event.currentTarget.value)}
      ></Textarea>
      <FileInput
        // we will not submit this field to the backend, we will submit the fileURL we get from s3 to backend: we will append that field to the form data
        // we need the field to display errror to the user/client.
        label="Upload files"
        placeholder="Upload files"
        icon={<IconUpload size="16px" />}
        accept="image/*"
        value={image}
        onChange={setImage}
      />
      {error?.gamePicBlob ? (
        <ErrorCard errorMessage={"please upload image type jpeg or png"} />
      ) : (
        <></>
      )}
      <Button type="submit">Submit</Button>
    </>
  );
};
