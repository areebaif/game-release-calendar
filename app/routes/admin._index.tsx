import * as React from "react";
import { Link } from "@remix-run/react";
// this route will have layout of your admin dashbaord to be used by all other admin routes

const AdminIndexRoute: React.FC = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/admin/addGame">Add Game</Link>
        </li>
        <li>
          {" "}
          <Link to="/admin/addPlatform">Add Platform</Link>
        </li>
        <li>
          {" "}
          <Link to="/admin/addUser">Add Admin User</Link>
        </li>
        <li>
          {" "}
          <Link to="/game">veiw all games</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminIndexRoute;
