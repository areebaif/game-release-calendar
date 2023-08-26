import bcrypt from "bcryptjs";
import { createCookieSessionStorage, redirect, json } from "@remix-run/node";
import {
  dbGetUserByEmail,
  dbGetUserById,
  dbGetUserByUserName,
} from "./db.server.crud";
import jwt from "jsonwebtoken";
import { JwtPayload } from "./types";

export const saltRounds = 10;

export const loginUser = async (
  emailUserName: string,
  userInputPassword: string
) => {
  const user = await dbGetUserByEmail(emailUserName);

  const userName = await dbGetUserByUserName(emailUserName);

  if (!user && !userName) return null;
  const isPasswordCorrect = await bcrypt.compare(
    userInputPassword,
    user?.passwordHash ? user?.passwordHash : userName?.passwordHash!
  );

  if (!isPasswordCorrect) return null;
  return {
    id: user?.id ? user.id : userName?.id,
    email: user?.email ? user.email : userName?.email,
    userName: user?.userName ? user.userName : userName?.userName,
    userType: user?.userType ? user.userType : userName?.userType,
  };
};

export const logoutUser = async (data: {
  request: Request;
  redirectTo: string;
}) => {
  const { redirectTo, request } = data;
  const session = await storage.getSession(request.headers.get("Cookie"));
  return redirect(`${redirectTo}`, {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
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
  redirectTo: string;
}) => {
  const session = await storage.getSession();
  const { userId, redirectTo } = data;
  const jwtToken = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: 60 * 60 * 24 * 7,
  });
  session.set("jwt_token", jwtToken);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};

// export const getUserSession = (request: Request) => {
//   return storage.getSession(request.headers.get("Cookie"));
// };

export const verifyJwtToken = async (request: Request) => {
  const session = await storage.getSession(request.headers.get("Cookie"));

  const jwt_token = session.get("jwt_token");
  try {
    const payload = jwt.verify(
      jwt_token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    return { user: payload };
  } catch (err) {
    // handle invalid token here
    return { user: null };
  }
};

export const requireAdminUser = async (data: { request: Request }) => {
  const { request } = data;
  const payload = await verifyJwtToken(request);
  const { user } = payload;
  if (!user) {
    return;
  }
  // return userData

  const userProps = await dbGetUserById(user.id);
  if (userProps?.userType !== "ADMIN") {
    return;
  }
  return userProps;
};

export const authenticatedUser = async (request: Request) => {
  const payload = await verifyJwtToken(request);
  const { user } = payload;
  if (!user?.id) {
    return { user: null };
  }
  // return userData
  const userProps = await dbGetUserById(user.id);
  return { user: userProps };
};
