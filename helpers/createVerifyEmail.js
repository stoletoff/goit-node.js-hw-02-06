const { BASE_URL } = process.env;

const createVerifyEmail = ({ email, verificationToken }) => {
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click to verify email</a>`,
  };
  return verifyEmail;
};

export default createVerifyEmail;
