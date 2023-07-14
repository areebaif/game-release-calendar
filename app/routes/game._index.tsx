import * as React from "react";
import { Link, useLoaderData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import { Image, Text } from "@mantine/core";
import { DbReadGameMetaData } from "~/utils/types";
import { DbGetAllGamesData, DbReadGameMetaDataZod } from "~/utils";
import { ErrorCard } from "~/components";

// this route will have layout of your admin dashbaord to be used by all other admin routes

export const loader = async () => {
  const allGamesMetaData = await DbGetAllGamesData();
  //console.log(allGamesMetaData[0].platform, "dhjdjhdhdhjdhdhdhdh");
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

  return (
    <div>
      <Image
        maw={240}
        mx="auto"
        radius="md"
        src={`https://game-calendar.s3.amazonaws.com/${loaderdata.games[0].game.imageUrl}`}
        alt="Random image"
      />
      <Text>{loaderdata.games[0].game.title}</Text>
      {/* <ul>
        <li>
          <Link to="/admin/addGame">Add Game</Link>
        </li>
        <li>
          {" "}
          <Link to="/admin/addPlatform">Add Platform</Link>
        </li>
      </ul> */}
    </div>
  );
};

export default GameIndexRoute;
