import bcrypt from "bcryptjs";

export const saltRounds = 10;

export const comparePassword = async (
  userInputPasseord: string,
  passwordHash: string
) => {
  const compare = await bcrypt.compare(userInputPasseord, passwordHash);

  return compare;
};
