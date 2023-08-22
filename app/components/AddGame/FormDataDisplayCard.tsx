import * as React from "react";
import {
  AddGameFormFields,
  FormPlatformFields,
  GameGenre,
} from "~/utils/types";
import {
  Card,
  Title,
  Group,
  FileInput,
  Text,
  Image,
  Grid,
  Divider,
  Input,
  Chip,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { formatDate } from "~/utils";

export type AddGameFormObjClient = {
  constructedUrl: string;
  [AddGameFormFields.gameName]: string;
  [AddGameFormFields.gameDescription]: string;
  [AddGameFormFields.gamePicBlob]: File | null;
  [AddGameFormFields.platformArray]: platformMergedFields["mergedField"][];
  [AddGameFormFields.gameGenre]: GameGenre[] | undefined;
};

type platformMergedFields = {
  mergedField: FormPlatformFields & {
    [AddGameFormFields.platformIdNameReleaseDate]: string;
  };
};

type AddGameFormDataDisplayCardProps = {
  handleDeleteGame: (val: number) => void;
  formInput: AddGameFormObjClient[];
};

export const AddGameFormDataDisplayCard: React.FC<
  AddGameFormDataDisplayCardProps
> = ({ handleDeleteGame, formInput }) =>
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
        <Text mt="sm" weight={"bold"}>
          game genre{" "}
        </Text>
        <Group mt="xs">
          {item.gameGenre?.map((genre, index) => (
            <Chip
              name={`${AddGameFormFields.gameGenre}$${index}`}
              value={genre.id}
            >
              {genre.name}
            </Chip>
          ))}
        </Group>
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
  });
