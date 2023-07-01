import * as React from "react";
import { Flex, Select, Box, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { GamePlatform, PlatformReleaseList } from "~/utils/types";

type GamePlatformInputProps = {
  platforms: GamePlatform[];
  platformsReleaseList: PlatformReleaseList[];
  setPlatformsReleaseList: (val: PlatformReleaseList[]) => void;
};

export const GamePlatformInput: React.FC<GamePlatformInputProps> = ({
  platforms,
  platformsReleaseList,
  setPlatformsReleaseList,
}) => {
  // derivedProps
  const parsePlatform = platforms.map((item) => ({
    ...item,
    value: item.name,
    label: item.name,
  }));
  // props
  const [namePlatform, setNamePlatform] = React.useState<string | null>("");
  const [platformList, setPlatformList] = React.useState(parsePlatform);
  const [releaseDate, setReleaseDate] = React.useState<Date | null>(null);

  const onAddToPlatformList = (val: string | null) => {
    const platform = findPlatform(val, platforms);

    setPlatformsReleaseList([
      ...platformsReleaseList,
      {
        platformId: platform[0].id,
        platformName: platform[0].name,
        releaseDate: releaseDate?.toISOString()!,
      },
    ]);
    setNamePlatform("");
    setPlatformList(platformList.filter((item) => item.name !== val));
  };

  return (
    <Flex direction="row" align="flex-start" gap="md" justify="flex-start">
      <Select
        value={namePlatform}
        onChange={setNamePlatform}
        label="platform"
        withAsterisk
        placeholder="pick one"
        nothingFound="No options"
        data={platformList}
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
  );
};

const findPlatform = (val: string | null, data: GamePlatform[]) => {
  const platform = data.filter((item) => item.name === val);
  return platform;
};
