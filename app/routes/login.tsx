import * as React from "react";
import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useSubmit,
  useNavigation,
} from "@remix-run/react";
import { Card, Button, Loader } from "@mantine/core";
// local imports
import { LoginSignup } from "~/components";
import {
  dbCreateUser,
  dbGetUserByEmail,
  dbGetUserByUserName,
  loginUser,
  createUserSession,
} from "~/utils";
import {
  ErrorLoginFormFields,
  LoginFormFields,
  User,
  LoginTypeVal,
} from "~/utils/types";

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const loginType = form.get(LoginFormFields.loginType);
  const password = form.get(LoginFormFields.password);
  const email = form.get(LoginFormFields.email);
  const userName = form.get(LoginFormFields.userName);

  const errors: ErrorLoginFormFields = {};
  // form validation
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

  switch (loginType) {
    case `${LoginTypeVal.login}`: {
      const DbValues = {
        emailUserName: email as string,
        password: password as string,
      };
      // login the user to get userId
      const user = await loginUser(DbValues.emailUserName, DbValues.password);
      if (!user) {
        errors.email = "error logging in user, please check your credentials";
        break;
      }
      const { id } = user;
      return createUserSession({
        userId: id!,
        redirectTo: "/",
      });
    }
    case `${LoginTypeVal.register}`: {
      const AddToDb = {
        email: email as string,
        password: password as string,
        userName: userName as string,
        userType: "STANDARD" as User["userType"],
      };
      const userEmailExists = await dbGetUserByEmail(AddToDb.email);
      if (userEmailExists) {
        errors.email = "error submitting form, email already in use";
        return json({ errors: errors });
      }
      const userNameExists = await dbGetUserByUserName(AddToDb.userName);
      if (userNameExists) {
        errors.userName = "error submitting form, username already in use";
        return json({ errors: errors });
      }
      const createUser = await dbCreateUser(AddToDb);
      const { id } = createUser;
      return createUserSession({
        userId: id,
        redirectTo: "/",
      });
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
};

const RegisterLogin: React.FC = () => {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<{ errors: ErrorLoginFormFields }>();
  const [email, setEmail] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<ErrorLoginFormFields>({});
  const [isRegister, setIsRegister] = React.useState<string>(
    `${LoginTypeVal.register}`
  );

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

  const onChangeFormType = (val: string) => {
    setEmail("");
    setUserName("");
    setPassword("");
    setError({});
    if (actionData?.errors) {
      actionData!.errors = undefined;
    }
    setIsRegister(val);
  };

  if (navigation.state === "loading" || navigation.state === "submitting") {
    return <Loader />;
  }
  const loginSignupProps = {
    isRegister,
    onChangeFormType,
    userName,
    setUserName,
    password,
    setPassword,
    email,
    setEmail,
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
          <LoginSignup {...loginSignupProps} />
          <Button type="submit">Submit</Button>
        </Form>
      </Card.Section>
    </Card>
  );
};

export default RegisterLogin;
