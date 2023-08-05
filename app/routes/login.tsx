import * as React from "react";
import { Link, useSearchParams } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import { z } from "zod";

import type { ActionArgs, LinksFunction } from "@remix-run/node";
import {
  Form,
  useActionData,
  useSubmit,
  useNavigation,
} from "@remix-run/react";
import {
  Card,
  Title,
  TextInput,
  Button,
  Loader,
  Radio,
  Group,
} from "@mantine/core";
// local imports
import { ErrorCard } from "~/components";
import {
  ErrorLoginFormFields,
  LoginFormFields,
  User,
  LoginTypeVal,
} from "~/utils/types";
import {
  comparePassword,
  dbCreateUser,
  dbGetUserEmail,
  dbGetUserName,
} from "~/utils";
import { saltRounds } from "~/utils/bcrypt";

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const loginType = form.get(LoginFormFields.loginType);
  const password = form.get(LoginFormFields.password);
  const email = form.get(LoginFormFields.email);
  const userName = form.get(LoginFormFields.userName);
  // const redirectTo = validateUrl(
  //   (form.get("redirectTo") as string) || "/jokes"
  // );

  const errors: ErrorLoginFormFields = {};

  if (typeof email !== "string" || !email.length) {
    errors.email = "error submitting form, please check the email field";
  }
  if (
    loginType === `${LoginTypeVal.register}` &&
    (typeof userName !== "string" || !userName.length)
  ) {
    errors.userName = "error submitting form, please check the user name field";
  }
  if (typeof password !== "string" || !password.length) {
    errors.password = "error submitting form, please check the password field";
  }

  const hasError = Object.values(errors).some((errorMessage) =>
    errorMessage?.length ? true : false
  );
  if (hasError) return json({ errors: errors });
  const addToDb = {
    email: email as string,
    password: password as string,
    userName: userName as string,
    userType: "ADMIN" as User["userType"],
  };

  switch (loginType) {
    case `${LoginTypeVal.login}`: {
      // login to get the user
      const user = await dbGetUserEmail(addToDb.email);
      if (!user)
        errors.email = "error loging in user, please ensure email is correct";
      const isPasswordCorrect = await comparePassword(
        addToDb.password,
        user?.passwordHash!
      );
      // TODO:
      // if there is a user, create their session and redirect to /
    }
    case `${LoginTypeVal.register}`: {
      const userEmailExists = await dbGetUserEmail(addToDb.email);
      if (userEmailExists) {
        errors.email = "error submitting form, email already in use";
        return json({ errors: errors });
      }
      const userNameExists = await dbGetUserName(addToDb.userName);
      if (userNameExists) {
        errors.userName = "error submitting form, username already in use";
        return json({ errors: errors });
      }
      const createUser = await dbCreateUser(addToDb);
      // TODO: create their session and redirect to /jokes
      return redirect("/");
    }
    default: {
      errors.loginType =
        "error submitting form, please enter correct value for login or register";
    }
  }
  const DbError = Object.values(errors).some((errorMessage) =>
    errorMessage?.length ? true : false
  );
  if (DbError) return json({ errors: errors });

  return redirect("/");
};

const Login: React.FC = () => {
  const submit = useSubmit();
  const actionData = useActionData<{ errors: ErrorLoginFormFields }>();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isRegister, setIsRegister] = React.useState<string>(
    `${LoginTypeVal.register}`
  );
  const [error, setError] = React.useState<ErrorLoginFormFields>();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // grab the form element
    setError(undefined);
    switch (true) {
      case !email.length:
        setError({
          [LoginFormFields.email]: "email value cannot be empty",
        });
        return;
      case !password.length:
        setError({
          [LoginFormFields.password]: "password value cannot be empty",
        });
        return;
      case isRegister === `${LoginTypeVal.register}` && !userName.length:
        setError({
          [LoginFormFields.userName]: "userName value cannot be empty",
        });
        return;
    }

    const $form = e.currentTarget;
    // get the formData from that form
    const formData = new FormData($form);
    submit(formData, { method: "post", action: "/login" });
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
          {/* Notice in my solution I'm using useSearchParams to get the
          redirectTo query parameter and putting that in a hidden input. This
          way our action can know where to redirect the user. This will be
          useful later when we redirect a user to the login page. */}
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <Radio.Group
            value={isRegister}
            onChange={setIsRegister}
            //name="login or register"
            label="login or register"
            withAsterisk
          >
            <Group mt="xs">
              <Radio
                name={`${LoginFormFields.loginType}`}
                value={`${LoginTypeVal.register}`}
                label="register"
              />
              <Radio
                name={`${LoginFormFields.loginType}`}
                value={`${LoginTypeVal.login}`}
                label="login"
              />
            </Group>
          </Radio.Group>
          {isRegister === `${LoginTypeVal.register}` ? (
            <>
              <TextInput
                withAsterisk
                label="username"
                placeholder="type here"
                value={userName}
                type="test"
                name={LoginFormFields.userName}
                onChange={(event) => setUserName(event.currentTarget.value)}
              />
              {error?.userName || actionData?.errors?.userName ? (
                <ErrorCard
                  errorMessage={
                    error?.userName
                      ? error.userName
                      : actionData?.errors?.userName
                  }
                />
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
          <TextInput
            withAsterisk
            label="Email"
            placeholder="type here"
            value={email}
            type="text"
            name={LoginFormFields.email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          ></TextInput>
          {error?.email || actionData?.errors?.email ? (
            <ErrorCard
              errorMessage={
                error?.email ? error.email : actionData?.errors?.email
              }
            />
          ) : (
            <></>
          )}
          <TextInput
            withAsterisk
            label="Password"
            placeholder="type here"
            value={password}
            type="password"
            name={LoginFormFields.password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          ></TextInput>
          {error?.password || actionData?.errors?.password ? (
            <ErrorCard
              errorMessage={
                error?.password ? error.password : actionData?.errors?.password
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

export default Login;
