import * as React from "react";
import {
  Form,
  useActionData,
  useSubmit,
  useNavigation,
} from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import { Card, Title, TextInput, Button, Loader, Group } from "@mantine/core";
import { Prisma } from "@prisma/client";
// type import
import type { ActionArgs, TypedResponse } from "@remix-run/node";
// local imports
import { ErrorCard } from "~/components";
import { db, ErrorAddPlatformFieldsZod, requireAdminUser } from "~/utils";
import { ErrorAddPlatformFields, AddPlatformFormFields } from "~/utils/types";

export const action = async ({
  request,
}: ActionArgs): Promise<ErrorAddPlatformFields | TypedResponse> => {
  const user = await requireAdminUser({ request });
  if (!user) return redirect("/");
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
  try {
    const platform = await db.gamePlatform.create({
      data: { name: platformName },
    });
    return redirect(`/admin`);
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        errors.name =
          "There is a unique constraint violation, a new platform cannot be created with this plaform name";
        return json({ errors: errors });
      }
      errors.name =
        "something went wrong with the database, please try again later.";
      return json({ errors: errors });
    }
    // TODO: fix add a general error rather than throwing we want to return error to user not stop code execution here
    throw new Response(null, {
      status: 500,
      statusText: "internal server error, failed to create platform",
    });
  }
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
    submit(formData, { method: "post", action: "/admin/add-platform" });
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
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Add Platform</Title>
      </Card.Section>

      <Form onSubmit={onSubmit}>
        <TextInput
          mt="xs"
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

        <Group position="center" mt="sm">
          <Button size="sm" type="submit">
            Submit
          </Button>
        </Group>
      </Form>
    </Card>
  );
};

export default AddPlatform;
