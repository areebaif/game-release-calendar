import bcrypt from "bcryptjs";
import { createCookieSessionStorage, redirect, json } from "@remix-run/node";
import { dbGetUserEmail, dbGetUserName } from "./db.server.crud";
import jwt from "jsonwebtoken";
import { User, UserPropsForClient } from "./types";

export const saltRounds = 10;

export const loginUser = async (email: string, userInputPassword: string) => {
  const user = await dbGetUserEmail(email);
  if (!user) return null;
  const isPasswordCorrect = await bcrypt.compare(
    userInputPassword,
    user?.passwordHash!
  );
  if (!isPasswordCorrect) return null;
  return {
    id: user.id,
    email: user.email,
    userName: user.username,
    userType: user.userType,
  };
};

export const storage = createCookieSessionStorage({
  cookie: {
    name: "JWT_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    //secrets: [sessionSecret],
    sameSite: "lax",
    secrets: [process.env.JWT_SECRET!],
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});

export const createUserSession = async (data: {
  userId: string;
  userEmail: string;
  userName: string;
  redirectTo: string;
  userType: User["userType"];
}) => {
  const session = await storage.getSession();
  const { userId, userEmail, userName, redirectTo, userType } = data;
  const jwtToken = jwt.sign(
    { userId, userEmail, userName, userType },
    process.env.JWT_SECRET!,
    {
      expiresIn: 60 * 60 * 24 * 7,
    }
  );
  // you will set the jwt token on the cookie
  // what about authorization headers????
  session.set("jwt_token", jwtToken);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};

export const getUserSession = (request: Request) => {
  return storage.getSession(request.headers.get("Cookie"));
};

export const verifyJwtToken = async (request: Request) => {
  const session = await getUserSession(request);

  const jwt_token = session.get("jwt_token");
  try {
    const payload = jwt.verify(
      jwt_token,
      process.env.JWT_SECRET!
    ) as UserPropsForClient;
    return { user: payload };
  } catch (err) {
    // handle invalid token here
    return { user: null };
  }
};

export const requireAdminUser = async (
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) => {
  const payload = await verifyJwtToken(request);
  //const userId = session.get("userId");
  const { user } = payload;
  if (!user || user.userType !== "ADMIN") {
    //const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`${redirectTo}`);
  }
  return user;
};
