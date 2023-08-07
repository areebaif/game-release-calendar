import { z } from "zod";
import { LoginFormFields } from "./types";
import { UserType } from "@prisma/client";

export const ErrorLoginFormFieldsZod = z
  .object({
    [LoginFormFields.email]: z.string().optional(),
    [LoginFormFields.password]: z.string().optional(),
    [LoginFormFields.loginType]: z.string().optional(),
    [LoginFormFields.userName]: z.string().optional(),
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

export const UserPropsForClientZod = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  userName: z.string(),
  userType: z.enum([`${UserType.ADMIN}`, `${UserType.STANDARD}`]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const JwtPayloadZod = z.object({
  id: z.string(),
});
