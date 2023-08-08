import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { useParams, useLoaderData } from "@remix-run/react";
import { dbGetGameDataById, DbReadGameMetaDataZod } from "~/utils";
import { DbReadGameMetaData } from "~/utils/types";
import { ErrorCard, GameCard } from "~/components";

export const loader = async ({ params }: LoaderArgs) => {
  if (!params.gameId) throw new Error("provide valid gameId");
  const gameItem = await dbGetGameDataById(params.gameId);
  console.log(gameItem.length, "shshshsh");
  if (!gameItem) {
    throw new Error("Joke not found");
  }
  return json(gameItem[0]);
};

const GameItem: React.FC = () => {
  const loaderdata = useLoaderData<DbReadGameMetaData>();
  const { gameId } = useParams();
  const zodParseGameMetaData = DbReadGameMetaDataZod.safeParse(loaderdata);

  if (!zodParseGameMetaData.success) {
    // log error in console
    console.log(zodParseGameMetaData.error);
    return (
      <ErrorCard errorMessage="something went wrong with the server please try again" />
    );
  }
  return <GameCard gameItem={loaderdata} />;
};

export default GameItem;
