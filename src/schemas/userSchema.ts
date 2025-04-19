import * as yup from "yup";

export const userSchema = yup.object().shape({
  name: yup.string().min(5).max(255).trim().required(),
  username: yup
    .string()
    .required()
    .matches(/^[a-zA-Z0-9_-]+$/)
    .max(255)
    .trim(),
  email: yup.string().email().max(255).trim().required(),
  phone: yup.string().max(255).trim(),
  website: yup.string().url().max(255).trim(),
  address: yup.object().shape({
    street: yup.string().max(255).trim().required(),
    suite: yup.string().max(255).trim().required(),
    city: yup.string().max(255).trim().required(),
    zipcode: yup.string().max(255).trim().required(),
  }),
});

export type UserSchema = yup.InferType<typeof userSchema>;
