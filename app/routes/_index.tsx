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
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <Title>Welcome to Remix</Title>
      <ul>
        <li>
          <Link to="/admin">Add Game</Link>
        </li>
        <li>
          {" "}
          <Link to="/admin/platform/new">Add Platform</Link>
        </li>
      </ul>
    </div>
  );
}
