import * as React from "react";
import { Flex, Select, Box, Button, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import {
  FormPlatformFields,
  PlatformDropDwonList,
  ErrorFormFields,
} from "~/utils/types";
import { ErrorCard } from "./ErrorComponent";

type AddPlatformProps = {
  platformDropdownList: PlatformDropDwonList[];
  setPlatformDropdownList: (data: PlatformDropDwonList[]) => void;
  formPlatformFields: FormPlatformFields[];
  setFormPlatformFields: (val: FormPlatformFields[]) => void;
  //error: ErrorFormFields;
};

export const AddPlatform: React.FC<AddPlatformProps> = ({
  platformDropdownList,
  formPlatformFields,
  setFormPlatformFields,
  setPlatformDropdownList,
  //error,
}) => {
  // props
  const [namePlatform, setNamePlatform] = React.useState<string | null>("");
  //const [platformList, setPlatformList] = React.useState(parsePlatform);
  const [releaseDate, setReleaseDate] = React.useState<Date | null>(null);

  const onAddToPlatformList = (val: string | null) => {
    const platform = platformDropdownList.filter(
      (item) => `${item.id}` === val
    );
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
    setPlatformDropdownList(
      platformDropdownList.filter((item) => `${item.id}` !== val)
    );
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
      {/* {error.isError && error.field === "platformName" ? (
        <ErrorCard errorMessage={error.message} />
      ) : (
        <></>
      )} */}
    </>
  );
};
