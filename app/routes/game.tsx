import { Outlet } from "@remix-run/react";
import { ActionArgs, json } from "@remix-run/node";
import { Title } from "@mantine/core";
import { verifyJwtToken } from "~/utils";



const Game: React.FC = () => {
  return (
    <>
      <Title order={1}>Games Layout</Title>
      <main>
        <Outlet />
      </main>
    </>
  );
};
export default Game;
