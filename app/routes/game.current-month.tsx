import * as React from "react";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { List } from "@mantine/core";
import { dbGetCurrentMonthGames, DbReadGameMetaDataZod } from "~/utils";
import { ErrorCard, GameCard } from "~/components";
import { DbReadGameMetaData } from "~/utils/types";

export const loader = async () => {
  try {
    const allGamesMetaData = await dbGetCurrentMonthGames();
    return json(allGamesMetaData);
  } catch (err) {
    console.log(err);
    throw new Response(null, {
      status: 500,
      statusText: "internal server error, failed to get games data",
    });
  }
};

const CurrentMonth: React.FC = () => {
  const currentMonthGame = useLoaderData<DbReadGameMetaData[]>();
  if (!currentMonthGame.length) {
    return <div>no data to display</div>;
  }
  const zodParseGameMetaData = DbReadGameMetaDataZod.safeParse(
    currentMonthGame[0]
  );
  if (!zodParseGameMetaData.success) {
    console.log(zodParseGameMetaData.error);
    return (
      <ErrorCard errorMessage="something went wrong with the server please try again" />
    );
  }
  return (
    <List icon={" "}>
      {currentMonthGame?.map((gameItem) => {
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

export default CurrentMonth;
