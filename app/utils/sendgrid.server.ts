import mail from "@sendgrid/mail";
mail.setApiKey(process.env.SENDGRID_API_KEY!);

type EmailMessageProps = {
  to: string;
  password: string;
  userName: string;
};

export const sendCredentialsEmail = async (msgData: EmailMessageProps) => {
  const { to, password, userName } = msgData;
  const msg = {
    to: to,
    from: `${process.env.EMAIL_FROM}`,
    subject: "Login Credentials",
    text: `email: ${to}, password: ${password}, username: ${userName}`,
    html: `<strong>email:</strong>${to} <br><strong>password:</strong>${password}<br><strong>username:</strong>${userName}<br>`,
  };
  try {
    await mail.send(msg);
    return { message: `Email successfully sent to:${msg.to}`, success: true };
  } catch (error) {
    const message = `Error sending email to: ${msg.to}`;
    console.log(error);
    return { message, success: false };
  }
};
