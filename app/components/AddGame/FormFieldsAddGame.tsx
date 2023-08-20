import * as React from "react";
import {
  Button,
  TextInput,
  Textarea,
  FileInput,
  Card,
  Title,
  Group,
} from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import { ErrorCard } from "~/components";
// type imports
import { ErrorAddGameFormFields, AddGameFormFields } from "~/utils/types";

type FormFieldsAddGame = {
  gameName: string;
  setGameName: (val: string) => void;
  gameDescription: string;
  setGameDescription: (val: string) => void;
  image: File | null;
  setImage: (val: File) => void;
  handleAddGame: () => void;
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
  actionData,
  error,
  handleAddGame,
}) => {
  return (
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
        <Title order={4}>Add Game</Title>
      </Card.Section>
      <TextInput
        pt="xs"
        withAsterisk
        label="name"
        placeholder="type here"
        value={gameName}
        type="text"
        //name={AddGameFormFields.gameName}
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
        pt="xs"
        label="description"
        placeholder="type here"
        value={gameDescription}
        autosize
        //name={AddGameFormFields.gameDescription}
        onChange={(event) => setGameDescription(event.currentTarget.value)}
      ></Textarea>
      {actionData?.errors?.gameDescription || error?.gameDescription ? (
        <ErrorCard
          errorMessage={
            actionData?.errors?.gameDescription
              ? actionData?.errors?.gameDescription
              : error?.gameDescription
          }
        />
      ) : (
        <></>
      )}
      <Group position="right">
        <label
          style={{
            display: "inline-block",
            fontSize: "0.875rem",
            fontWeight: 500,
            wordBreak: "break-word",
          }}
        >
          character count: {gameDescription.length}/1000
        </label>
      </Group>
      <FileInput
        label="upload image"
        placeholder="upload image"
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
      <Group mt="sm" position="right">
        <Button
          onClick={() => {
            handleAddGame();
          }}
          variant="outline"
        >
          Add Game
        </Button>
      </Group>
    </Card>
  );
};
