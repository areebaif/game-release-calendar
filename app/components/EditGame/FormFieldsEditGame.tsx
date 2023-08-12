import * as React from "react";
import { Button, TextInput, Textarea, FileInput } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { ErrorCard, EditGamePlatformList } from "~/components";
// type imports
import { ErrorEditGameFormField, EditGameFormFields } from "~/utils/types";

import { EditGamePlatformListProps } from "./EditGamePlatformList";

type FormFieldsEditGame = {
  gameName: string;
  setGameName: (val: string) => void;
  gameDescription: string;
  setGameDescription: (val: string) => void;
  platformListProps: EditGamePlatformListProps;
  actionData: { errors: ErrorEditGameFormField } | undefined;
  error: ErrorEditGameFormField;
  imageUrl: string;
  gameId: string;
};

export const FormFieldsEditGame: React.FC<FormFieldsEditGame> = ({
  gameId,
  gameName,
  setGameName,
  gameDescription,
  setGameDescription,
  platformListProps,
  actionData,
  error,
  imageUrl,
}) => {
  return (
    <>
      <EditGamePlatformList {...platformListProps} />
      <TextInput
        withAsterisk
        label="Name"
        placeholder="type here"
        value={gameName}
        type="text"
        name={EditGameFormFields.gameName}
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
        name={EditGameFormFields.gameDescription}
        onChange={(event) => setGameDescription(event.currentTarget.value)}
      ></Textarea>
      <TextInput label="Image" disabled value={imageUrl}></TextInput>
      <input
        hidden={true}
        readOnly
        name={EditGameFormFields.gameId}
        value={gameId}
      ></input>
      {actionData?.errors?.gameId || error?.gameId ? (
        <ErrorCard
          errorMessage={
            actionData?.errors?.gameId
              ? actionData?.errors?.gameId
              : error?.gameId
          }
        />
      ) : (
        <></>
      )}
      <Button type="submit">Submit</Button>
    </>
  );
};
