import * as React from "react";
import { json } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useSubmit,
  useNavigation,
} from "@remix-run/react";
import { useDisclosure } from "@mantine/hooks";
import { Card, Button, Loader, Modal, Text } from "@mantine/core";
// local imports
import { AddAdminUser, ErrorCard } from "~/components";
import {
  dbCreateUser,
  dbGetUserByEmail,
  dbGetUserByUserName,
  requireAdminUser,
} from "~/utils";
import { ErrorLoginFormFields, LoginFormFields, User } from "~/utils/types";
import { ErrorLoginFormFieldsZod, UserZod } from "~/utils/zod.userAuth";

export const action = async ({ request }: ActionArgs) => {
  const user = await requireAdminUser({ request, redirectTo: "/" });
  const form = await request.formData();
  const password = form.get(LoginFormFields.password);
  const email = form.get(LoginFormFields.email);
  const userName = form.get(LoginFormFields.userName);

  const errors: ErrorLoginFormFields = {};
  // form validation
  if (typeof email !== "string" || !email.length) {
    errors.email = "error submitting form, please check the email field";
  }
  if (typeof userName !== "string" || !userName.length) {
    errors.userName = "error submitting form, please check the user name field";
  }
  if (typeof password !== "string" || !password.length) {
    errors.password = "error submitting form, please check the password field";
  }
  const hasError = Object.values(errors).some((errorMessage) =>
    errorMessage?.length ? true : false
  );
  if (hasError) return json({ errors: errors });

  const AddToDb = {
    email: email as string,
    password: password as string,
    userName: userName as string,
    userType: "ADMIN" as User["userType"],
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
  const DbError = Object.values(errors).some((errorMessage) =>
    errorMessage?.length ? true : false
  );
  if (DbError) return json({ errors: errors });
  const createUser = await dbCreateUser(AddToDb);
  return {
    user: {
      id: createUser.id,
      email: createUser.email,
      userName: createUser.userName,
      userPassword: password as string,
      userType: createUser.userType,
    },
  };
};

const RegisterAdminUser: React.FC = () => {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<{
    errors: ErrorLoginFormFields;
    user: User;
  }>();
  const [email, setEmail] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<ErrorLoginFormFields>({});
  const [serverTypeCheckError, setServerTypeCheckError] = React.useState(false);
  const [isModalOpen, { open, close }] = useDisclosure(false);

  let formRef = React.useRef<HTMLFormElement>(null);
  // To check if the route is reloading after form submission
  let isReloading =
    navigation.state === "loading" &&
    navigation.formData != null &&
    navigation.formAction === navigation.location.pathname;

  React.useEffect(() => {
    if (actionData?.user) {
      // clear the form and react fields
      setUserName("");
      setPassword("");
      setEmail("");
      formRef?.current?.reset();
      const typeCheckUser = UserZod.safeParse(actionData.user);
      if (!typeCheckUser.success) {
        console.log(typeCheckUser.error.issues);
        setServerTypeCheckError(true);
      } else {
        // open the model with info of the user created
        open();
      }
    }
  }, [isReloading]);

  // typecheck api returned data with zod
  const typeCheckError = ErrorLoginFormFieldsZod.safeParse(actionData?.errors);

  if (!typeCheckError.success || serverTypeCheckError) {
    console.log(error);
    return (
      <ErrorCard
        errorMessage={"something went wrong with the server please try again"}
      />
    );
  }
  if (navigation.state === "submitting") {
    return <Loader />;
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      case !userName.length:
        setError({
          [LoginFormFields.userName]: "userName value cannot be empty",
        });
        return;
    }

    const $form = e.currentTarget;
    // get the formData from that form
    const formData = new FormData($form);
    submit(formData, { method: "post", action: "/admin/addUser" });
  };

  const signupProps = {
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
        <Form ref={formRef} onSubmit={onSubmit}>
          <AddAdminUser {...signupProps} />
          <Button type="submit">Submit</Button>
        </Form>
      </Card.Section>
      <Modal opened={isModalOpen} onClose={close} title="User Credentials">
        <Text>email: {actionData?.user.email}</Text>
        <Text>userName: {actionData?.user.userName}</Text>
        <Text>userType: {actionData?.user.userType}</Text>
        <Text>userPassword: {actionData?.user.userPassword}</Text>
      </Modal>
    </Card>
  );
};

export default RegisterAdminUser;
