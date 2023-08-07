import type { ActionArgs, TypedResponse, LoaderArgs } from "@remix-run/node";
import { db,requireAdminUser } from "~/utils";

export const action = async ({ request }: ActionArgs) => {
  // TODO: this will fail as we are not doing on delete cascade and gameMetadat will through error
  const user = await requireAdminUser({ request, redirectTo: "/" });
  const form = await request.formData();
  const id = form.get("delete") as string;

  await db.game.delete({
    where: {
      id: id,
    },
  });
  return { id };
};
