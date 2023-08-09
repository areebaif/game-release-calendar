import * as React from "react";
import { Link, useLoaderData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import { Card, Image, List, Text, Group } from "@mantine/core";
import { DbReadGameMetaData } from "~/utils/types";
import { dbGetAllGamesData, DbReadGameMetaDataZod } from "~/utils";
import { ErrorCard, GameCard } from "~/components";

export const loader = async () => {
  const allGamesMetaData = await dbGetAllGamesData();
  return json(allGamesMetaData);
};

export const GameIndexRoute: React.FC = () => {
  const loaderdata = useLoaderData<DbReadGameMetaData[]>();
  if (!loaderdata.length) {
    return <div>no data to display</div>;
  }
  const zodParseGameMetaData = DbReadGameMetaDataZod.safeParse(loaderdata[0]);

  if (!zodParseGameMetaData.success) {
    // log error in console
    console.log(zodParseGameMetaData.error);
    return (
      <ErrorCard errorMessage="something went wrong with the server please try again" />
    );
  }
  // TODO: add link to open a game separately
  return (
    <List icon={" "}>
      {loaderdata?.map((gameItem) => {
        return (
          <List.Item key={gameItem.game.gameId}>
            <Link to={`/game/${gameItem.game.gameId}`}>
              <GameCard gameItem={gameItem} />
            </Link>
          </List.Item>
        );
      })}
    </List>
  );
};

export default GameIndexRoute;
