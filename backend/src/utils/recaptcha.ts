import axios from "axios";

export async function verifyRecaptcha(token: string) {
  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  );
  const data = response.data;
  return data.success;
}
