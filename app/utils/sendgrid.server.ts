import mail from "@sendgrid/mail";
mail.setApiKey(process.env.SENDGRID_API_KEY!);

const msg = {
  to: "areeba.iftikhar1993@gmail.com", // Change to your recipient
  from: `${process.env.EMAIL_FROM}`, // Change to your verified sender
  subject: "Login Credentials",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js!!!</strong>",
};

type EmailMessageProps = {
  to: string;
  from: string;
  subject: string;
  test: String;
  html: string;
};

export const sendEmail = async (msg: EmailMessageProps) => {
  try {
    await mail.send(msg);
    return { message: `Email sent successfully to: ${msg.to}` };
  } catch (error) {
    const message = `Error sending email to: ${msg.to}`;
    console.log(error);
    return { message };
  }
};
