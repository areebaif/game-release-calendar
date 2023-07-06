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
import type { ActionArgs, TypedResponse } from "@remix-run/node";
// local imports
import { ErrorCard } from "~/components";
import { db } from "~/utils";
// type imports
import { ErrorFormFields } from "~/utils/zod/types";
import { ErrorFormFieldsZod } from "~/utils/zod";
import { AddPlatformFormFields } from "~/utils/zod";

export const action = async ({
  request,
}: ActionArgs): Promise<ErrorFormFields | TypedResponse> => {
  const form = await request.formData();

  const name = form.get("name");
  if (typeof name !== "string" || !name.length) {
    return {
      isError: true,
      field: AddPlatformFormFields.name,
      message: "error submitting form, please check the name field",
    };
  }
  // TODO: uncomment this
  //const platform = await db.gamePlatform.create({ data: { name } });
  return redirect(`/`);
};

const AddPlatform: React.FC = () => {
  // hooks
  const navigation = useNavigation();
  const submit = useSubmit();
  const actionData = useActionData<ErrorFormFields>();
  // props
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<ErrorFormFields>();
  // server result validation
  const result = ErrorFormFieldsZod.safeParse(actionData);
  if (!result.success) {
    console.log(result.error);
    return (
      <ErrorCard errorMessage="something went wrong with the server, please try again" />
    );
  }
  // loaders
  if (navigation.state === "submitting" || navigation.state === "loading") {
    return <Loader />;
  }
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    // do form validation
    if (!name.length) {
      setError({
        isError: true,
        message: "name field cannot be empty",
        field: AddPlatformFormFields.name,
      });
      return;
    }
    // grab the form element
    const $form = e.currentTarget;
    // get the formData from that form
    const formData = new FormData($form);
    submit(formData, { method: "post", action: "/admin/addPlatform" });
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
        <Form onSubmit={onSubmit}>
          <TextInput
            withAsterisk
            label="Name"
            placeholder="type here"
            value={name}
            type="text"
            name={AddPlatformFormFields.name}
            onChange={(event) => setName(event.currentTarget.value)}
          ></TextInput>
          {(error?.isError && error.field === AddPlatformFormFields.name) ||
          (actionData?.isError &&
            actionData.field === AddPlatformFormFields.name) ? (
            <ErrorCard
              errorMessage={
                error?.message ? error.message : actionData?.message
              }
            />
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
