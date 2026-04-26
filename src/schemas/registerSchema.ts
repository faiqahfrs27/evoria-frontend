import z from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.email("Invalid email"),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 chars" })
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    referralCode: z.string().optional(),
    confirmPassword: z.string().min(1, "Must confirm your password"),
    agreeToTerms: z
      .boolean()
      .refine(
        (isChecked) => isChecked === true,
        "You must agree to the Terms & Conditions",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
