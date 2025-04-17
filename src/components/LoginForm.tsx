'use client'
import React, { useEffect, useRef } from "react";
import { Flex, Heading, Input, Button, Card, Stack } from "@chakra-ui/react";

import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AUTH_TOKEN_KEY } from "@/constants";

export const LoginForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [authToken, setAuthToken] = useLocalStorage<string | null>(AUTH_TOKEN_KEY, null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isFormValid = formRef.current?.checkValidity();

    if (!isFormValid) return;

    // TODO: Implement login logic
    // const formData = new FormData(e.target as HTMLFormElement);
    // const email = formData.get("email") as string;
    // const password = formData.get("password") as string;
    //
    // const response = await fetch("http://localhost:3000/api/login", {
    //   method: "POST",
    //   body: JSON.stringify({ email, password }),
    // });
    // const { authToken } = await response.json();

    const authToken = "fake-token";
    setAuthToken(authToken);
    router.push("/dashboard");
  };

  useEffect(() => {
    if (!authToken) return;

    router.push("/dashboard");
  }, [authToken]);

  return (
    <Stack flex={1} justifyContent="center" px={6} py={4}>
      <form ref={formRef} onSubmit={handleSubmit}>
        <Card.Root
          flex={1}
          flexDirection="column"
          maxW="sm"
          mx="auto"
          borderRadius={8}
          boxShadow="lg"
        >
          <Card.Header>
            <Heading>Log In</Heading>
          </Card.Header>
          <Card.Body gap={4}>
            <Input placeholder="Enter your email" type="email" name="email" required maxLength={255} />
            <Input placeholder="Enter your password" type="password" name="password" required maxLength={255} />
            <Button type="submit">Log In</Button>
          </Card.Body>
        </Card.Root>
      </form>
    </Stack>
  );
};
