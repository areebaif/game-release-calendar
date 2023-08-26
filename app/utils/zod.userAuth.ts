import { z } from "zod";
import {
  EditUserFormFields,
  LoginFormFields,
  RegisterUserFormFields,
} from "./types";
import { UserType } from "@prisma/client";

export const ErrorLoginFormFieldsZod = z
  .object({
    [LoginFormFields.emailUserName]: z.string().optional(),
    [LoginFormFields.password]: z.string().optional(),
    [LoginFormFields.userType]: z.string().optional(),
  })
  .optional();

export const ErrorUserEditFormFieldsZod = z.object({
  [EditUserFormFields.password]: z.string().optional(),
  [EditUserFormFields.oldPassword]: z.string().optional(),
  [EditUserFormFields.userId]: z.string().optional(),

});

export const ErrorRegisterUserFormFieldsZod = z
  .object({
    [RegisterUserFormFields.email]: z.string().optional(),
    [RegisterUserFormFields.password]: z.string().optional(),
    [RegisterUserFormFields.userType]: z.string().optional(),
    [RegisterUserFormFields.userName]: z.string().optional(),
  })
  .optional();

export const UserZod = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  userName: z.string(),
  userType: z.enum([`${UserType.ADMIN}`, `${UserType.STANDARD}`]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  passwordHash: z.string().optional(),
  userPassword: z.string().optional(),
});

export const UserPropsForClientZod = z
  .object({
    id: z.string().uuid(),
    email: z.string().email(),
    userName: z.string(),
    userType: z.enum([`${UserType.ADMIN}`, `${UserType.STANDARD}`]),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .nullable();

export const JwtPayloadZod = z.object({
  id: z.string(),
});

export const CredentialEmailZod = z.object({
  message: z.string(),
  success: z.boolean(),
});
