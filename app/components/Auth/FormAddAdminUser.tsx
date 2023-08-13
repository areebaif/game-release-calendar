import * as React from "react";
import { TextInput, Group, Radio } from "@mantine/core";
import {
  RegisterUserFormFields,
  ErrorRegisterUserFormFields,
  User,
} from "~/utils/types";
import { ErrorCard } from "~/components";

type AddAdminUser = {
  userName: string;
  setUserName: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  error: ErrorRegisterUserFormFields;
  actionData: { errors: ErrorRegisterUserFormFields } | undefined;
};

export const AddAdminUser: React.FC<AddAdminUser> = ({
  userName,
  setUserName,
  password,
  setPassword,
  email,
  setEmail,
  error,
  actionData,
}) => {
  return (
    <>
      <Group mt="xs">
        <Radio
          name={`${RegisterUserFormFields.userType}`}
          value={`ADMIN`}
          label="admin"
        />
        <Radio
          name={`${RegisterUserFormFields.userType}`}
          value="STANDARD"
          label="standard"
        />
      </Group>
      <TextInput
        withAsterisk
        label="username"
        placeholder="type here"
        value={userName}
        type="test"
        name={RegisterUserFormFields.userName}
        onChange={(event) => setUserName(event.currentTarget.value)}
      />
      {error?.userName || actionData?.errors?.userName ? (
        <ErrorCard
          errorMessage={
            error?.userName ? error.userName : actionData?.errors?.userName
          }
        />
      ) : (
        <></>
      )}

      <TextInput
        withAsterisk
        label="Email"
        placeholder="type here"
        value={email}
        type="text"
        name={RegisterUserFormFields.email}
        onChange={(event) => setEmail(event.currentTarget.value)}
      ></TextInput>
      {error?.email || actionData?.errors?.email ? (
        <ErrorCard
          errorMessage={error?.email ? error.email : actionData?.errors?.email}
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
        name={RegisterUserFormFields.password}
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
    </>
  );
};
