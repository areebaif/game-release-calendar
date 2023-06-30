import { Card } from "@mantine/core";
import { db } from "~/utils/db.server";

const AddGame: React.FC = () => {
  // Create a card and a submit form

  return (
    <Card shadow="sm" p="xl" radius="md" withBorder>
      <p>Here's a random joke:</p>
      <p>I was wondering why the frisbee was getting bigger, then it hit me.</p>
    </Card>
  );
};

export default AddGame;
