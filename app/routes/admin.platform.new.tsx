import * as React from "react";
import { Form, useActionData } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { Card, Title, TextInput, Button } from "@mantine/core";
// type import
import type { ActionArgs } from "@remix-run/node";

// local imports
import { db, badRequest } from "~/utils";
// type imports
import { BadRequest } from "~/utils/types";
import { BadRequestZod } from "~/utils/zod";

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const name = form.get("name");

  if (typeof name !== "string" || !name.length) {
    return badRequest({
      fieldErrors: "bad request",
      fields: "name",
      formErrors: "Form not submitted correctly.",
    });
  }
  //const platform = await db.gamePlatform.create({ data: { name } });
  return redirect(`/`);
};

const AddPlatform: React.FC = () => {
  const [name, setName] = React.useState("");
  const actionData = useActionData<BadRequest>();
  const result = BadRequestZod.safeParse(actionData);
  // TODO: error handling, incorrect response from the server
  !result.success ? console.log(result.error) : undefined;

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{
        overflow: "inherit",
        margin: "15px 0 0 0",
      }}
    >
      <Card.Section inheritPadding py="md">
        <Title order={3}>Add Platform</Title>
      </Card.Section>
      <Card.Section inheritPadding py="md">
        <form method="POST">
          <TextInput
            withAsterisk
            label="Name"
            placeholder="type here"
            value={name}
            type="text"
            name="name"
            error={
              actionData?.fieldErrors ? "error submitting this value" : false
            }
            onChange={(event) => setName(event.currentTarget.value)}
          ></TextInput>
          {/* TODO: error handling: show client error */}
          {actionData?.formErrors ||
          actionData?.fields ||
          actionData?.fieldErrors ? (
            <div>{actionData.formErrors} </div>
          ) : undefined}
          <Button type="submit">Submit</Button>
        </form>
      </Card.Section>
    </Card>
  );
};

export default AddPlatform;
