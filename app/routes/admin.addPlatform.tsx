import * as React from "react";
import {
  Form,
  useActionData,
  useSubmit,
  useNavigation,
} from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import { Card, Title, TextInput, Button, Loader } from "@mantine/core";
// type import
import type { ActionArgs, TypedResponse } from "@remix-run/node";
// local imports
import { ErrorCard } from "~/components";
import { db, ErrorAddPlatformFieldsZod } from "~/utils";
// type imports
import { ErrorAddPlatformFields, AddPlatformFormFields } from "~/utils/types";

export const action = async ({
  request,
}: ActionArgs): Promise<ErrorAddPlatformFields | TypedResponse> => {
  const form = await request.formData();

  const name = form.get(AddPlatformFormFields.name);
  const errors: ErrorAddPlatformFields = {
    name: undefined,
  };

  if (typeof name !== "string" || !name.length) {
    errors.name = "error submitting form, please check the name field";
  }
  const hasError = Object.values(errors).some((errorMessage) =>
    errorMessage?.length ? true : false
  );
  if (hasError) return json({ errors: errors });
  const platformName = name as string;
  // TODO: uncomment this
  const platform = await db.gamePlatform.create({
    data: { name: platformName },
  });
  return redirect(`/admin`);
};

const AddPlatform: React.FC = () => {
  // hooks
  const navigation = useNavigation();
  const submit = useSubmit();
  const actionData = useActionData<{ errors: ErrorAddPlatformFields }>();
  // props
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<ErrorAddPlatformFields>();
  // server result validation
  const result = ErrorAddPlatformFieldsZod.safeParse(actionData?.errors);
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
        ...error,
        name: "error submitting form, please check the name field",
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
          {error?.name || actionData?.errors?.name ? (
            <ErrorCard
              errorMessage={error?.name ? error.name : actionData?.errors?.name}
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
