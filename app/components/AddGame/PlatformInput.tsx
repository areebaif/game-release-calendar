import * as React from "react";
import { Flex, Box, Button, Chip, Group, Grid, Textarea } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  FormPlatformFields,
  ErrorAddGameFormFields,
  AddGameFormFields,
  GamePlatform,
} from "~/utils/types";

import { ErrorCard } from "../ErrorComponent";
import { SelectBadges } from "../AddGameSelectBadge";

type PlatformInputProps = {
  platforms: GamePlatform[];
  gamePlatformList: FormPlatformFields[];
  setGamePlatformList: (val: FormPlatformFields[]) => void;
  error: ErrorAddGameFormFields;
  setError: (val: ErrorAddGameFormFields) => void;
  actionData: { errors: ErrorAddGameFormFields } | undefined;
};

export const PlatformInput: React.FC<PlatformInputProps> = ({
  platforms,
  gamePlatformList,
  setGamePlatformList,
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
    // check if you are adding the same platform twice
    // platformsFiltered.forEach((platformToAdd, index) => {
    //   gamePlatformList.forEach((platform) => {
    //     if (platform.platformId === platformToAdd.platformId) {
    //       setError({
    //         ...error,
    //         [AddGameFormFields.platformName]:
    //           "You cannot add the same platform twice to the list",
    //       });
    //       return;
    //     }
    //   });
    // });
    setGamePlatformList([...gamePlatformList, ...platformsFiltered]);
    setUserPlatformList([]);
    setReleaseDate(null);
  };
  const selectBadgesProps = {
    data: platforms,
    selectedValues: userPlatformList,
    onChangeSelectedValues: setUserPlatformList,
    name: "Add Platform",
  };
  return (
    <>
      <Grid>
        <Grid.Col span={2}>
          <Textarea
            defaultValue={
              "Add Platform button will populate a list of platforms along with the date selected. If you want to add more platforms with different release dates, the add platform button will append them to the list"
            }
            readOnly
            disabled
            autosize
            minRows={3}
          ></Textarea>
        </Grid.Col>

        <Grid.Col span={"auto"}>
          <Group ml="sm" position="apart">
            <Flex
              direction="row"
              align="flex-start"
              gap="md"
              justify="flex-start"
            >
              {" "}
              <DateInput
                valueFormat="MMM DD YYYY"
                label={"select date"}
                placeholder={"mm dd yyyy"}
                value={releaseDate}
                onChange={setReleaseDate}
              />
              <SelectBadges {...selectBadgesProps} />
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
          (actionData?.errors?.platformName &&
            error?.platformIdNameReleaseDate) ? (
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
        </Grid.Col>
      </Grid>
    </>
  );
};
