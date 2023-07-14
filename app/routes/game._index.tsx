import * as React from "react";
import { Link, useLoaderData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import { Card, Image, List, Text, Group } from "@mantine/core";
import { DbReadGameMetaData } from "~/utils/types";
import { DbGetAllGamesData, DbReadGameMetaDataZod } from "~/utils";
import { ErrorCard } from "~/components";

export const loader = async () => {
  const allGamesMetaData = await DbGetAllGamesData();
  return json({ games: allGamesMetaData });
};

export const GameIndexRoute: React.FC = () => {
  const loaderdata = useLoaderData<{ games: DbReadGameMetaData[] }>();
  const zodParseGameMetaData = DbReadGameMetaDataZod.safeParse(
    loaderdata.games[0]
  );

  if (!zodParseGameMetaData.success) {
    // log error in console
    console.log(zodParseGameMetaData.error);
    return (
      <ErrorCard errorMessage="something went wrong with the server please try again" />
    );
  }
  // TODO: this needs to be refactored into separate components
  return (
    <List icon={" "}>
      {loaderdata.games.map((game) => {
        return (
          <List.Item key={game.game.gameId}>
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
              {" "}
              <Card.Section>
                <Image
                  width={`100px`}
                  radius="md"
                  src={`https://game-calendar.s3.amazonaws.com/${game.game.imageUrl}`}
                  alt="Random image"
                />
              </Card.Section>
              <Text>Game Name: {game.game.title}</Text>
              <Text>Description: {game.game.description}</Text>
              <Text>Release Dates:</Text>
              {game.platform.map((platform, index) => {
                return (
                  <Group key={index}>
                    <Text>
                      {platform.platformName}:{" "}
                      {new Date(platform.releaseDate).toDateString()}
                    </Text>
                  </Group>
                );
              })}
            </Card>
          </List.Item>
        );
      })}
    </List>
  );
};

export default GameIndexRoute;
