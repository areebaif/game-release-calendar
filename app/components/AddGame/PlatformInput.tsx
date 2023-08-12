import * as React from "react";
import { Flex, Select, Box, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  FormPlatformFields,
  PlatformDropDwonList,
  ErrorAddGameFormFields,
  AddGameFormFields,
} from "~/utils/types";

import { ErrorCard } from "../ErrorComponent";

type PlatformInputProps = {
  platformDropdownList: PlatformDropDwonList[];
  setPlatformDropdownList?: (data: PlatformDropDwonList[]) => void;
  formPlatformFields: FormPlatformFields[];
  setFormPlatformFields: (val: FormPlatformFields[]) => void;
  error: ErrorAddGameFormFields;
  setError: (val: ErrorAddGameFormFields) => void;
  actionData: { errors: ErrorAddGameFormFields } | undefined;
};

export const PlatformInput: React.FC<PlatformInputProps> = ({
  platformDropdownList,
  formPlatformFields,
  setFormPlatformFields,
  setPlatformDropdownList,
  error,
  setError,
  actionData,
}) => {
  // props
  const [namePlatform, setNamePlatform] = React.useState<string | null>("");
  const [releaseDate, setReleaseDate] = React.useState<Date | null>(null);
  const onAddToPlatformList = (val: string | null) => {
    setError(undefined);
    const platform = platformDropdownList.filter(
      (item) => `${item.id}` === val
    );
    if (!platform.length || !releaseDate) {
      setError({
        ...error,
        [AddGameFormFields.platformName]:
          "please enter value for platform name and release date",
      });
      return;
    }
    setFormPlatformFields([
      ...formPlatformFields,
      {
        platformId: platform[0].id,
        platformName: platform[0].name,
        releaseDate: releaseDate?.toISOString()!,
      },
    ]);
    setNamePlatform("");
    setReleaseDate(null);
    setPlatformDropdownList
      ? setPlatformDropdownList(
          platformDropdownList.filter((item) => `${item.id}` !== val)
        )
      : undefined;
  };

  return (
    <>
      <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
        <Select
          value={namePlatform}
          onChange={setNamePlatform}
          label="platform"
          withAsterisk
          placeholder="pick one"
          nothingFound="No options"
          data={platformDropdownList}
        />
        <DateInput
          valueFormat="MMM DD YYYY"
          label={"select date"}
          placeholder={"mm dd yyyy"}
          withAsterisk
          value={releaseDate}
          onChange={setReleaseDate}
        />
        <Box sx={(theme) => ({ paddingTop: theme.spacing.xl })}>
          <Button
            variant="outline"
            onClick={() => {
              onAddToPlatformList(namePlatform);
            }}
          >
            Add
          </Button>
        </Box>
      </Flex>
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
