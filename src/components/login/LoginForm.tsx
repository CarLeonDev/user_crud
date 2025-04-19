"use client";
import React, { useRef } from "react";
import { Input, Button, Stack } from "@chakra-ui/react";
import { TEST_IDS } from "@/constants";
import { InputField } from "@/components/ui/InputField";
import { MailIcon, LockIcon } from "lucide-react";

type LoginFormProps = {
  onSubmit: (email: string, password: string) => void;
};

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValid = formRef.current?.checkValidity();

    if (!isFormValid) return;

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    onSubmit(email, password);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <Stack direction="column" gap={6}>
        <Stack direction="column" gap={4}>
          <InputField
            name="email"
            label="Email"
            inputGroupProps={{
              startElement: <MailIcon size={16} />,
            }}
            inputProps={{
              placeholder: "Enter your email",
              type: "email",
              name: "email",
              required: true,
              autoFocus: true,
              maxLength: 255,
            }}
          />

          <InputField
            name="password"
            label="Password"
            inputProps={{
              placeholder: "Enter your password",
              type: "password",
              name: "password",
              required: true,
              maxLength: 255,
            }}
            inputGroupProps={{
              startElement: <LockIcon size={16} />,
            }}
          />
        </Stack>

        <Button type="submit" data-testid={TEST_IDS.SUBMIT_BUTTON}>
          Log In
        </Button>
      </Stack>
    </form>
  );
};
