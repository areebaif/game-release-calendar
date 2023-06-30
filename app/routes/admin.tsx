import { Outlet } from "@remix-run/react";
import { Title } from "@mantine/core";

const Admin: React.FC = () => {
  return (
    <>
      <Title order={1}>Admin Dahsboard</Title>
      <main>
        <Outlet />
      </main>
    </>
  );
};
export default Admin;
