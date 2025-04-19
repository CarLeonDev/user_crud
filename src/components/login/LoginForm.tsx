"use client";
import React, { useRef } from "react";
import { Input, Button, Stack } from "@chakra-ui/react";
import { TEST_IDS } from "@/constants";

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
      <Stack direction="column" gap={4}>
        <Stack direction="column" gap={2}>
          <Input
            placeholder="Enter your email"
            type="email"
            name="email"
            required
            maxLength={255}
            data-testid={TEST_IDS.EMAIL_INPUT}
          />

          <Input
            placeholder="Enter your password"
            type="password"
            name="password"
            required
            maxLength={255}
            data-testid={TEST_IDS.PASSWORD_INPUT}
          />
        </Stack>

        <Button type="submit" data-testid={TEST_IDS.SUBMIT_BUTTON}>
          Log In
        </Button>
      </Stack>
    </form>
  );
};
