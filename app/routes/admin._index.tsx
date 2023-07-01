import { Card } from "@mantine/core";
import { useLoaderData } from "@remix-run/react";
import { GamePlatformInput } from "~/components";
import { db } from "~/utils/db.server";

export async function loader() {
  // we have to load a list of all available platforms (ps e.t.c)
  return [];
}

const AddGame: React.FC = () => {
  const platforms = useLoaderData();

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
        <GamePlatformInput />
      </Card.Section>
    </Card>
  );
};

export default AddGame;
