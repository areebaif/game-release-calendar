import { Outlet } from "@remix-run/react";
import { Title } from "@mantine/core";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  for (const pair of form.entries()) {
    console.log(pair, "hahahah");
  }

  // if (typeof name !== "string" || !name.length) {
  //   return badRequest({
  //     fieldErrors: "bad request",
  //     fields: "name",
  //     formErrors: "Form not submitted correctly.",
  //   });
  // }
  //const platform = await db.gamePlatform.create({ data: { name } });
  return redirect(`/admin`);
};

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
