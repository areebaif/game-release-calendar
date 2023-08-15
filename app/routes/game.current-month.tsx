import * as React from "react";
import { json } from "@remix-run/node";
import { getCurrentMonthGame } from "~/utils";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  try {
    console.log(" I ma here s");
    const allGamesMetaData = await getCurrentMonthGame();
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
  const currentMonthGame = useLoaderData();
  console.log(currentMonthGame, "slslslsl");
  return <div>I navigated</div>;
};

export default CurrentMonth;
