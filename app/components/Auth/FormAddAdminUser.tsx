import * as React from "react";
import { TextInput, Group, Radio } from "@mantine/core";
import {
  RegisterUserFormFields,
  ErrorRegisterUserFormFields,
  UserTypeForm,
} from "~/utils/types";
import { ErrorCard } from "~/components";

type AddAdminUser = {
  userName: string;
  setUserName: (val: string) => void;
  // password: string;
  // setPassword: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  error: ErrorRegisterUserFormFields;
  actionData: { errors: ErrorRegisterUserFormFields } | undefined;
};

export const AddUser: React.FC<AddAdminUser> = ({
  userName,
  setUserName,
  // password,
  // setPassword,
  email,
  setEmail,
  error,
  actionData,
}) => {
  return (
    <>
      <TextInput
        mt="xs"
        withAsterisk
        label="Username"
        placeholder="type here"
        value={userName}
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
        mt="xs"
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
      <Radio.Group mt="xs" label="User type" withAsterisk>
        <Group>
          <Radio
            name={`${RegisterUserFormFields.userType}`}
            value={`${UserTypeForm.ADMIN}`}
            label="Admin"
          />
          <Radio
            name={`${RegisterUserFormFields.userType}`}
            value={`${UserTypeForm.STANDARD}`}
            label="Standard"
          />
        </Group>
      </Radio.Group>
      {error?.userType || actionData?.errors?.userType ? (
        <ErrorCard
          errorMessage={
            error?.userType ? error.userType : actionData?.errors?.userType
          }
        />
      ) : (
        <></>
      )}
      {/* <TextInput
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
      )} */}
    </>
  );
};
