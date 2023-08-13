import * as React from "react";
import { TextInput, Radio, Group } from "@mantine/core";
import { LoginFormFields, ErrorLoginFormFields } from "~/utils/types";
import { ErrorCard } from "~/components";

type LoginProps = {
  password: string;
  setPassword: (val: string) => void;
  emailUserName: string;
  setEmailUserName: (val: string) => void;
  error: ErrorLoginFormFields;
  actionData: { errors: ErrorLoginFormFields } | undefined;
};

export const Login: React.FC<LoginProps> = ({
  password,
  setPassword,
  emailUserName,
  setEmailUserName,
  error,
  actionData,
}) => {
  return (
    <>
      <TextInput
        withAsterisk
        label={"Username or Email"}
        placeholder="type here"
        value={emailUserName}
        type="text"
        name={LoginFormFields.emailUserName}
        onChange={(event) => setEmailUserName(event.currentTarget.value)}
      ></TextInput>
      {error?.emailUserName || actionData?.errors?.emailUserName ? (
        <ErrorCard
          errorMessage={
            error?.emailUserName
              ? error.emailUserName
              : actionData?.errors?.emailUserName
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
    </>
  );
};
