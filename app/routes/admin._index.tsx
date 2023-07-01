import * as React from "react";
import { useLoaderData } from "@remix-run/react";
import { Card } from "@mantine/core";
// local imports
import { GamePlatformInput } from "~/components";
import { db } from "~/utils";
// type imports
import { GamePlatform, PlatformReleaseList } from "~/utils/types";
import { GamePlatformZod } from "~/utils/zod";

export const loader = async () => {
  const platforms = await db.gamePlatform.findMany({
    select: { id: true, name: true },
  });
  return platforms;
};

const AddGame: React.FC = () => {
  // get platform data from server
  const platforms = useLoaderData<GamePlatform[]>();
  // these are post api props to add data in the database
  const [platformsReleaseList, setPlatformsReleaseList] = React.useState<
    PlatformReleaseList[]
  >([]);
  // these are the props to populate client components
  
  // Type checks: check if the server is sending correct values
  const parsePlatform = GamePlatformZod.safeParse(platforms[0]);
  // TODO: error handling, incorrect response from the server
  !parsePlatform.success ? console.log(parsePlatform.error) : undefined;

  
  const gamePlatformInputProps = {
    platforms,
    setPlatformsReleaseList,
    platformsReleaseList,
  };

  return (
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
        <GamePlatformInput {...gamePlatformInputProps} />
      </Card.Section>
    </Card>
  );
};

export default AddGame;
