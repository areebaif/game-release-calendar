import * as React from "react";
import { TextInput, Radio, Group } from "@mantine/core";
import {
  LoginFormFields,
  LoginTypeVal,
  ErrorLoginFormFields,
} from "~/utils/types";
import { ErrorCard } from "~/components";

type LoginSignupProps = {
  isRegister: string;
  userName: string;
  setUserName: (val: string) => void;
  onChangeFormType: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  error: ErrorLoginFormFields;
  actionData: { errors: ErrorLoginFormFields } | undefined;
};

export const LoginSignup: React.FC<LoginSignupProps> = ({
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
}) => {
  return (
    <>
      <Radio.Group
        value={isRegister}
        onChange={(val) => {
          onChangeFormType(val);
        }}
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
      {error?.loginType || actionData?.errors?.loginType ? (
        <ErrorCard
          errorMessage={
            error?.loginType ? error.loginType : actionData?.errors?.loginType
          }
        />
      ) : (
        <></>
      )}
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
                error?.userName ? error.userName : actionData?.errors?.userName
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
        label={
          isRegister === `${LoginTypeVal.register}`
            ? "Email"
            : "Username or Email"
        }
        placeholder="type here"
        value={email}
        type="text"
        name={LoginFormFields.email}
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
