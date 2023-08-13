import * as React from "react";
import { json, redirect } from "@remix-run/node";
import type { ActionArgs } from "@remix-run/node";
import { UserType } from "@prisma/client";
import {
  Form,
  useActionData,
  useSubmit,
  useNavigation,
} from "@remix-run/react";
import { v4 as uuidv4 } from "uuid";
import { useDisclosure } from "@mantine/hooks";
import { Card, Button, Loader, Modal, Text } from "@mantine/core";
// local imports
import { AddAdminUser, ErrorCard } from "~/components";
import {
  dbCreateUser,
  dbGetUserByEmail,
  dbGetUserByUserName,
  requireAdminUser,
  ErrorRegisterUserFormFieldsZod,
  UserZod,
  sendCredentialsEmail,
} from "~/utils";
import {
  ErrorRegisterUserFormFields,
  RegisterUserFormFields,
  User,
} from "~/utils/types";

export const action = async ({ request }: ActionArgs) => {
  const user = await requireAdminUser({ request });
  if (!user) return redirect("/");
  const form = await request.formData();
  //const password = form.get(RegisterUserFormFields.password);
  const email = form.get(RegisterUserFormFields.email);
  const userName = form.get(RegisterUserFormFields.userName);
  const userType = form.get(RegisterUserFormFields.userType);

  const errors: ErrorRegisterUserFormFields = {};
  // form validation
  if (typeof email !== "string" || !email.length) {
    errors.email = "error submitting form, please check the email field";
  }
  if (typeof userName !== "string" || !userName.length) {
    errors.userName = "error submitting form, please check the user name field";
  }
  // if (typeof password !== "string" || !password.length) {
  //   errors.password = "error submitting form, please check the password field";
  // }
  if (userType !== UserType.ADMIN && userType !== UserType.STANDARD)
    errors.userType = "please submit correct userType";
  const hasError = Object.values(errors).some((errorMessage) =>
    errorMessage?.length ? true : false
  );
  if (hasError) return json({ errors: errors });
  const password = uuidv4();
  const AddToDb = {
    email: email as string,
    password: password,
    userName: userName as string,
    userType: userType as User["userType"],
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
  try {
    const createUser = await dbCreateUser(AddToDb);
    const emailData = {
      to: AddToDb.email,
      password: AddToDb.password,
      userName: AddToDb.userName,
    };
    const emailSent = await sendCredentialsEmail(emailData);
    console.log(emailSent, "hshshsh", password);
    return {
      user: {
        id: createUser.id,
        email: createUser.email,
        userName: createUser.userName,
        userPassword: password as string,
        userType: createUser.userType,
      },
      emailSent,
    };
  } catch (err) {
    console.log(err);
    throw new Response(null, {
      status: 500,
      statusText: "internal server error, failed to create create",
    });
  }
};

const RegisterAdminUser: React.FC = () => {
  const submit = useSubmit();
  const navigation = useNavigation();
  const actionData = useActionData<{
    errors: ErrorRegisterUserFormFields;
    user: User;
    emailSent: {
      message: string;
      success: boolean;
    };
  }>();
  const [email, setEmail] = React.useState("");
  const [userName, setUserName] = React.useState("");
  //const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<ErrorRegisterUserFormFields>({});
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
      //setPassword("");
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
  const typeCheckError = ErrorRegisterUserFormFieldsZod.safeParse(
    actionData?.errors
  );

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
          [RegisterUserFormFields.email]: "email value cannot be empty",
        });
        return;
      // case !password.length:
      //   setError({
      //     [RegisterUserFormFields.password]: "password value cannot be empty",
      //   });
      //   return;
      case !userName.length:
        setError({
          [RegisterUserFormFields.userName]: "userName value cannot be empty",
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
    // password,
    // setPassword,
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
        <Text>{actionData?.emailSent.message}</Text>
        <Text>userName: {actionData?.user.userName}</Text>
        <Text>userType: {actionData?.user.userType}</Text>
        <Text>userPassword: {actionData?.user.userPassword}</Text>
      </Modal>
    </Card>
  );
};

export default RegisterAdminUser;
