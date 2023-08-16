import * as React from "react";
import { Flex, Box, Button, Chip, Group } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  FormPlatformFields,
  ErrorAddGameFormFields,
  AddGameFormFields,
  GamePlatform,
} from "~/utils/types";

import { ErrorCard } from "../ErrorComponent";

type PlatformInputProps = {
  platforms: GamePlatform[];
  formPlatformFields: FormPlatformFields[];
  setFormPlatformFields: (val: FormPlatformFields[]) => void;
  error: ErrorAddGameFormFields;
  setError: (val: ErrorAddGameFormFields) => void;
  actionData: { errors: ErrorAddGameFormFields } | undefined;
};

export const PlatformInput: React.FC<PlatformInputProps> = ({
  platforms,
  formPlatformFields,
  setFormPlatformFields,
  error,
  setError,
  actionData,
}) => {
  // props
  const [userPlatformList, setUserPlatformList] = React.useState<string[]>();
  const [releaseDate, setReleaseDate] = React.useState<Date | null>(null);

  const onAddToPlatformList = (val: string[] | undefined) => {
    setError(undefined);
    const platformsToAdd = val?.map((platformId) => {
      const platformName = platforms.filter(
        (item) => `${item.id}` === platformId
      );
      if (!platformName.length || !releaseDate) {
        setError({
          ...error,
          [AddGameFormFields.platformName]:
            "please enter value for platform name and release date",
        });
        return;
      }
      return {
        platformId: platformId,
        platformName: platformName[0].name,
        releaseDate: releaseDate?.toISOString()!,
      };
    });

    const platformsFiltered: {
      platformId: string;
      platformName: string;
      releaseDate: string;
    }[] = [];
    platformsToAdd?.forEach((item) => {
      if (Boolean(item?.platformId)) platformsFiltered.push(item!);
    });
    if (!platformsFiltered.length) {
      setError({
        ...error,
        [AddGameFormFields.platformName]:
          "please enter value for platform name and release date",
      });
      return;
    }
    setFormPlatformFields([...formPlatformFields, ...platformsFiltered]);
    setUserPlatformList([]);
    setReleaseDate(null);
  };

  return (
    <>
      <Group position="apart">
        <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
          {" "}
          <DateInput
            valueFormat="MMM DD YYYY"
            label={"select date"}
            placeholder={"mm dd yyyy"}
            value={releaseDate}
            onChange={setReleaseDate}
          />
          <Flex direction={"column"} gap="xs" wrap="wrap">
            <label
              style={{
                display: "inline-block",
                fontSize: "0.875rem",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              select platforms
            </label>
            <Chip.Group
              multiple
              value={userPlatformList}
              onChange={setUserPlatformList}
            >
              <Group>
                {platforms.map((item) => (
                  <Chip key={item.id} value={`${item.id}`}>
                    {item.name}
                  </Chip>
                ))}
              </Group>
            </Chip.Group>
          </Flex>
        </Flex>
        <Box sx={(theme) => ({ paddingTop: theme.spacing.xl })}>
          <Button
            variant="outline"
            onClick={() => {
              onAddToPlatformList(userPlatformList);
            }}
          >
            Add Platforms
          </Button>
        </Box>
      </Group>
      {error?.platformName ||
      (actionData?.errors?.platformName && error?.platformIdNameReleaseDate) ? (
        <ErrorCard
          errorMessage={
            error?.platformName
              ? error.platformName
              : actionData?.errors?.platformIdNameReleaseDate
          }
        />
      ) : (
        <></>
      )}
    </>
  );
};
