import * as React from "react";
import { useLoaderData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Card, Button } from "@mantine/core";
// local imports
import { AddPlatform, FormPlatformList } from "~/components";
import { db } from "~/utils";
// type imports
import { GamePlatform, FormPlatformFields } from "~/utils/types";
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
  // derive props
  const dropdownList = platforms.map((item) => ({
    ...item,
    value: `${item.id}`,
    label: item.name,
  }));
  const [platformDropdownList, setPlatformDropdownList] =
    React.useState(dropdownList);
  // these are post api props to add data in the database
  const [formPlatformFields, setFormPlatformFields] = React.useState<
    FormPlatformFields[]
  >([]);
  // Type checks: check if the server is sending correct values
  const parsePlatform = GamePlatformZod.safeParse(platforms[0]);
  // TODO: error handling, incorrect response from the server
  !parsePlatform.success ? console.log(parsePlatform.error) : undefined;

  const gamePlatformInputProps = {
    platformDropdownList,
    setPlatformDropdownList,
    formPlatformFields,
    setFormPlatformFields,
  };
  const formPlatformListProps = {
    formPlatformFields,
    setFormPlatformFields,
    setPlatformDropdownList,
    platformDropdownList,
    dropdownList,
  };
  return (
    <>
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
          <AddPlatform {...gamePlatformInputProps} />
        </Card.Section>
      </Card>
      <Card>
        <Card.Section inheritPadding py="md">
          <form method="POST" action="/admin">
            <FormPlatformList {...formPlatformListProps} />
            <Button type="submit">Submit</Button>
          </form>
        </Card.Section>
      </Card>
    </>
  );
};

export default AddGame;
