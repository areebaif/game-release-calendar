import * as React from "react";
import { Card, Image, Text, Group } from "@mantine/core";
import { DbReadGameMetaData } from "~/utils/types";

type GameCardProps = {
  gameItem: DbReadGameMetaData;
};

export const GameCard: React.FC<GameCardProps> = ({ gameItem }) => {
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
      {" "}
      <Card.Section>
        <Image
          width={`100px`}
          radius="md"
          src={gameItem.game.imageUrl}
          alt="Random image"
        />
      </Card.Section>
      <Text>Game Name: {gameItem.game.title}</Text>
      <Text>Description: {gameItem.game.description}</Text>
      <Text>Release Dates:</Text>
      {gameItem.platform.map((platform, index) => {
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
  );
};
