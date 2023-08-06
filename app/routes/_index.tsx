import { Button, Title } from "@mantine/core";
import { Link, useLoaderData } from "@remix-run/react";

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
          <Link to="/admin">Go to admin dashbaord</Link>
        </li>
        <li>
          <Link to="/game">View all games</Link>
        </li>
        <li>
          <Link to="/login">sign-up or login</Link>
        </li>
      </ul>
    </div>
  );
}
