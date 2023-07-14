import { Outlet } from "@remix-run/react";
import { Title } from "@mantine/core";

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
