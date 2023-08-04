import * as React from "react";
import { Link, useSearchParams } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";

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
import { ErrorLoginFormFields, LoginFormFields, User } from "~/utils/types";
import { dbCreateUser } from "~/utils/db.crud";

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const loginType = form.get(LoginFormFields.loginType);
  const password = form.get(LoginFormFields.password);
  const email = form.get(LoginFormFields.email);
  // const redirectTo = validateUrl(
  //   (form.get("redirectTo") as string) || "/jokes"
  // );
  const fields = { loginType, password, email };
  const errors: ErrorLoginFormFields = {};
  const addToDb: User = {
    email: "",
    passwordHash: "",
    userType: "STANDARD",
  };
  // do some form validation here
  if (typeof email !== "string" || !email.length) {
    errors.email = "error submitting form, please check the email field";
  }
  if (typeof password !== "string" || !password.length) {
    errors.password = "error submitting form, please check the password field";
  }
  const hasError = Object.values(errors).some((errorMessage) =>
    errorMessage?.length ? true : false
  );
  if (hasError) return json({ errors: errors });
  //const user = await dbCreateUser(email, password, loginType);
  //   switch (loginType) {
  //     case "login": {
  //       // login to get the user
  //       // if there's no user, return the fields and a formError
  //       // if there is a user, create their session and redirect to /
  //     }
  //     case "register": {
  //       //   const userExists = await db.user.findFirst({
  //       //     where: { username },
  //       //   });
  //       //   if (userExists) {
  //       //     return badRequest({
  //       //       fieldErrors: null,
  //       //       fields,
  //       //       formError: `User with username ${username} already exists`,
  //       //     });
  //       //   }
  //       //   // create the user
  //       // create their session and redirect to /jokes
  //     }
  //     default: {
  //       // return error here
  //     }
  //   }
  return redirect("/");
};

const Login: React.FC = () => {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSignup, setIsSignup] = React.useState("register");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // grab the form element

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
            value={isSignup}
            onChange={setIsSignup}
            //name="login or register"
            label="login or register"
            withAsterisk
          >
            <Group mt="xs">
              <Radio
                name={`${LoginFormFields.loginType}`}
                value="register"
                label="register"
              />
              <Radio
                name={`${LoginFormFields.loginType}`}
                value="login"
                label="login"
              />
            </Group>
          </Radio.Group>
          <TextInput
            withAsterisk
            label="Email"
            placeholder="type here"
            value={email}
            type="text"
            name={LoginFormFields.email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          ></TextInput>
          {/* {error?.name || actionData?.errors?.name ? (
            <ErrorCard
              errorMessage={error?.name ? error.name : actionData?.errors?.name}
            />
          ) : (
            <></>
          )} */}
          <TextInput
            withAsterisk
            label="Password"
            placeholder="type here"
            value={password}
            type="password"
            name={LoginFormFields.password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          ></TextInput>
          {/* {error?.name || actionData?.errors?.name ? (
            <ErrorCard
              errorMessage={error?.name ? error.name : actionData?.errors?.name}
            />
          ) : (
            <></>
          )} */}
          <Button type="submit">Submit</Button>
        </Form>
      </Card.Section>
    </Card>
  );
};

export default Login;
