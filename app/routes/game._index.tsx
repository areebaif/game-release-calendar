import * as React from "react";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import {
  Box,
  Card,
  FileInput,
  Flex,
  Grid,
  Image,
  List,
  Text,
  createPolymorphicComponent,
} from "@mantine/core";
import { DbReadGameMetaData } from "~/utils/types";
import { dbGetAllGamesData, DbReadGameMetaDataZod } from "~/utils";
import { ErrorCard, GameCard } from "~/components";
import { _FileInput } from "@mantine/core/lib/FileInput/FileInput";

export const loader = async () => {
  try {
    const allGamesMetaData = await dbGetAllGamesData();
    return json(allGamesMetaData);
  } catch (err) {
    console.log(err);
    throw new Response(null, {
      status: 500,
      statusText: "internal server error, failed to get games data",
    });
  }
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
  // <Link to={`/game/${gameItem.game.gameId}`}>
  return loaderdata ? (
    loaderdata.map((gameItem, index) => (
      <GameCard key={index} gameItem={gameItem} />
    ))
  ) : (
    <div>no data to display</div>
  );
};

export default GameIndexRoute;
