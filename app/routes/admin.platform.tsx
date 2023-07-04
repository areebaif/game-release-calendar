import * as React from "react";
import {
  Form,
  useActionData,
  useSubmit,
  useNavigation,
} from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { Card, Title, TextInput, Button, Loader } from "@mantine/core";
// type import
import type { ActionArgs } from "@remix-run/node";
// local imports
import { ErrorCard } from "~/components";
// type imports
import { ErrorFormFields } from "~/utils/types";

export const action = async ({ request }: ActionArgs) => {
  console.log(" I am here");
  const form = await request.formData();

  const name = form.get("name");
  console.log(name, "fhfhfhfhfh");
  // if (typeof name !== "string" || !name.length) {
  //   return {
  //     isError: true,
  //     fields: "name",
  //     message: "error submitting form, please check the name field",
  //   };
  // }
  //const platform = await db.gamePlatform.create({ data: { name } });
  return redirect(`/`);
};

const AddPlatform: React.FC = () => {
  const navigation = useNavigation();
  const submit = useSubmit();
  //const actionData = useActionData<ErrorFormFields>();
  //const result = BadRequestZod.safeParse(actionData);
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<ErrorFormFields>({
    isError: false,
    message: "",
    field: "",
  });
  // TODO: error handling, incorrect response from the server
  //!result.success ? console.log(result.error) : undefined;
  if (navigation.state === "submitting" || navigation.state === "loading") {
    return <Loader />;
  }
  const onSubmit = (e: React.FormEvent) => {
    // why preventing default is not sending t

    //e.preventDefault();
    setError({ isError: false, message: "", field: "" });
    // do form validation
    if (!name.length) {
      setError({
        isError: true,
        message: "name field cannot be empty",
        field: "name",
      });
      return;
    }
    const formData = new FormData();
    submit(formData);
  };

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
        <Form method="POST" action="/admin/platform/new" onSubmit={onSubmit}>
          <TextInput
            withAsterisk
            label="Name"
            placeholder="type here"
            value={name}
            type="text"
            name="name"
            onChange={(event) => setName(event.currentTarget.value)}
          ></TextInput>

          {error?.isError && error.field === "name" ? (
            <ErrorCard errorMessage={error.message} />
          ) : (
            <></>
          )}
          <Button type="submit">Submit</Button>
        </Form>
      </Card.Section>
    </Card>
  );
};

export default AddPlatform;
