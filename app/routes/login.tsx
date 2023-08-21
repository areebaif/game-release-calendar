import * as React from "react";
import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { z } from "zod";
import {
  Form,
  useActionData,
  useSubmit,
  useNavigation,
} from "@remix-run/react";
import { Card, Button, Loader } from "@mantine/core";
// local imports
import { Login } from "~/components";
import { loginUser, createUserSession } from "~/utils";
import {
  ErrorLoginFormFields,
  LoginFormFields,
  User,
  //LoginTypeVal,
} from "~/utils/types";

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const password = form.get(LoginFormFields.password);
  const email = form.get(LoginFormFields.emailUserName);

  const errors: ErrorLoginFormFields = {};
  // form validation
  if (!email?.length)
    errors.emailUserName =
      "error submitting form, please check the email field";
  if (typeof password !== "string" || !password.length) {
    errors.password = "error submitting form, please check the password field";
  }
  const hasError = Object.values(errors).some((errorMessage) =>
    errorMessage?.length ? true : false
  );
  if (hasError) return json({ errors: errors });
  try {
    const DbValues = {
      emailUserName: email as string,
      password: password as string,
    };
    // login the user to get userId
    const user = await loginUser(DbValues.emailUserName, DbValues.password);
    if (!user) {
      errors.emailUserName =
        "error logging in user, please check your credentials";
    }
    const id = user?.id;
    return createUserSession({
      userId: id!,
      redirectTo: "/admin",
    });
  } catch (err) {
    console.log(err);
    throw new Response(null, {
      status: 500,
      statusText: "internal server error, failed to/ login user",
    });
  }
};

const RegisterLogin: React.FC = () => {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<{ errors: ErrorLoginFormFields }>();
  const [emailUserName, setEmailUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<ErrorLoginFormFields>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // grab the form element
    setError(undefined);
    switch (true) {
      case !z.string().safeParse(emailUserName).success:
        setError({
          [LoginFormFields.emailUserName]: "please provide valid email",
        });
        return;
      case !password.length:
        setError({
          [LoginFormFields.password]: "password value cannot be empty",
        });
        return;
    }

    const $form = e.currentTarget;
    // get the formData from that form
    const formData = new FormData($form);
    submit(formData, { method: "post", action: "/login" });
  };

  if (navigation.state === "loading" || navigation.state === "submitting") {
    return <Loader />;
  }
  const loginProps = {
    password,
    setPassword,
    emailUserName,
    setEmailUserName,
    error,
    actionData,
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
        <Form onSubmit={onSubmit}>
          <Login {...loginProps} />
          <Button type="submit">Submit</Button>
        </Form>
      </Card.Section>
    </Card>
  );
};

export default RegisterLogin;
