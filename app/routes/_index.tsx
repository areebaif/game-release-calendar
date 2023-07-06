import { Button, Title } from "@mantine/core";
import { Link } from "@remix-run/react";

// export const meta: V2_MetaFunction = () => {
//   return [
//     { title: "New Remix App" },
//     { name: "description", content: "Welcome to Remix!" },
//   ];
// };

export default function Index() {
  return (
    <div>
      <Title>Welcome to Remix</Title>
      <ul>
        <li>
          <Link to="/admin/addGame">Add Game</Link>
        </li>
        <li>
          {" "}
          <Link to="/admin/addPlatform">Add Platform</Link>
        </li>
      </ul>
    </div>
  );
}
