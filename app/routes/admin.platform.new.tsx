import * as React from "react";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Card, Title, TextInput, Button } from "@mantine/core";

// local imports
import { db, badRequest } from "~/utils";
// type imports
import { BadRequest } from "~/utils/types";
import { BadRequestZod } from "~/utils/zod";

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  //const content = form.get("content");
  const name = form.get("name");

  if (typeof name !== "string" || !name.length) {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formErrors: "Form not submitted correctly.",
    });
  }
  const fields = { name };
  const platform = await db.gamePlatform.create({ data: { name } });
  return redirect(`/`);
}

const AddPlatform: React.FC = () => {
  const [name, setName] = React.useState("");
  const actionData = useActionData<BadRequest>();

  if (actionData) {
    // TODO: error handling
    const result = BadRequestZod.safeParse(actionData);
    !result.success ? console.log(result.error) : undefined;
  }

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
        <Form method="POST">
          <TextInput
            withAsterisk
            label="Name"
            placeholder="type here"
            value={name}
            type="text"
            name="name"
            error={!name.length ? "Enter a value to submit" : false}
            onChange={(event) => setName(event.currentTarget.value)}
          ></TextInput>
          <Button type="submit">Submit</Button>
        </Form>
      </Card.Section>
    </Card>
  );
};

export default AddPlatform;