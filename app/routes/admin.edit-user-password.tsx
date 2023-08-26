import * as React from "react";
import {
  requireAdminUser,
  db,
  UserPropsForClientZod,
  resetUserPassword,
  logoutUser,
} from "~/utils";
import { redirect, json } from "@remix-run/node";
import type { ActionArgs, TypedResponse } from "@remix-run/node";
import { z } from "zod";
import {
  useLoaderData,
  Form,
  useSubmit,
  useNavigation,
  useActionData,
} from "@remix-run/react";
import {
  EditUserFormFields,
  ErrorUserEditFormFields,
  UserPropsForClient,
} from "~/utils/types";
import { ErrorCard } from "~/components";
import { Card, Group, Title, Button, TextInput, Loader } from "@mantine/core";

export const loader = async ({ request }: ActionArgs) => {
  try {
    const user = await requireAdminUser({ request });
    if (!user) return redirect("/");

    return json(user);
  } catch (err) {
    console.log(err);
    // TODO add error boundaries in client to handle these
    throw new Response(null, {
      statusText: "somehting went wrong with the server, please try again",
      status: 500,
    });
  }
};

export const action = async ({
  request,
}: ActionArgs): Promise<ErrorUserEditFormFields | TypedResponse> => {
  const user = await requireAdminUser({ request });
  if (!user) return redirect("/");
  const errors: ErrorUserEditFormFields = {};
  const form = await request.formData();
  const password = form.get(EditUserFormFields.password);
  const userId = form.get(EditUserFormFields.userId);
  const oldPassword = form.get(EditUserFormFields.oldPassword);

  // typecheck formData
  if (typeof password !== "string" || !password.length) {
    errors.password = "the password must be a string and cannot be empty";
  }
  if (typeof oldPassword !== "string" || !oldPassword.length) {
    errors.oldPassword =
      "the old password must be a string and cannot be empty";
  }
  const typecheckUserId = z.string().uuid().safeParse(userId);
  if (!typecheckUserId.success) errors.userId = "the userId is not a valid Id";
  const hasError = Object.values(errors).some((errorMessage) =>
    errorMessage?.length ? true : false
  );
  if (hasError) return json({ errors: errors });

  const editPassword = await resetUserPassword({
    userId: userId as string,
    newPassword: password as string,
    oldPassword: oldPassword as string,
  });
  if (!editPassword?.user) {
    errors.userId = "the provided userId is not valid ";
  }
  if (!editPassword?.isPasswordCorrect) {
    errors.password = " the provided password is not correct";
  }
  const dbError = Object.values(errors).some((errorMessage) =>
    errorMessage?.length ? true : false
  );
  if (dbError) return json({ errors: errors });
  return logoutUser({ request, redirectTo: "/login" });
};

const EditPassword: React.FC = () => {
  const submit = useSubmit();
  const navigation = useNavigation();
  const loaderData = useLoaderData<UserPropsForClient>();
  const actionData = useActionData<{ errors: ErrorUserEditFormFields }>();
  const [password, setPassword] = React.useState("");
  const [oldPassword, setOldPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<ErrorUserEditFormFields>();
  const typeCheckUser = UserPropsForClientZod.safeParse(loaderData);

  if (navigation.state === "loading" || navigation.state === "submitting") {
    return <Loader />;
  }

  if (!typeCheckUser.success) {
    console.log(typeCheckUser.error.issues);
    return (
      <ErrorCard errorMessage="something went wrong with the server, please try again" />
    );
  }
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    if (password !== confirmPassword || !password.length) {
      setError({
        [EditUserFormFields.password]:
          "password cannot be empty and password and confirm password should match",
      });
      return;
    }
    if (!oldPassword.length) {
      setError({
        [EditUserFormFields.oldPassword]: "old password filed cannot be empty",
      });
    }
    const $form = e.currentTarget;
    const formData = new FormData($form);
    submit(formData, { method: "post", action: "/admin/edit-user-password" });
  };

  if (actionData?.errors.userId) {
    return <ErrorCard errorMessage={actionData?.errors.userId} />;
  }

  return (
    <Card shadow="sm" p="xl" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        {" "}
        <Title order={3}>Edit Password</Title>
      </Card.Section>
      <Card.Section inheritPadding py="xs">
        <Form onSubmit={onSubmit}>
          <TextInput
            mt="xs"
            type={"password"}
            withAsterisk
            label="old password"
            placeholder="type here"
            value={oldPassword}
            name={EditUserFormFields.oldPassword}
            onChange={(event) => setOldPassword(event.currentTarget.value)}
          />
          <TextInput
            mt="xs"
            withAsterisk
            type={"password"}
            label="password"
            placeholder="type here"
            value={password}
            name={EditUserFormFields.password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          {error?.password || actionData?.errors.password ? (
            <ErrorCard
              errorMessage={
                error?.password ? error.password : actionData?.errors.password
              }
            />
          ) : (
            <></>
          )}
          <TextInput
            mt="xs"
            withAsterisk
            type={"password"}
            label="confirm password"
            placeholder="type here"
            value={confirmPassword}
            error={confirmPassword !== password}
            onChange={(event) => setConfirmPassword(event.currentTarget.value)}
          />
          <input
            type="hidden"
            name={EditUserFormFields.userId}
            value={loaderData?.id}
          ></input>
          <Group position="center" mt="sm">
            <Button size="sm" type="submit">
              Submit
            </Button>
          </Group>
        </Form>
      </Card.Section>
    </Card>
  );
};

export default EditPassword;
