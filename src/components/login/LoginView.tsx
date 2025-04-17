"use client";

import React, { useEffect } from "react";
import { Heading, Card, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AUTH_TOKEN_KEY } from "@/constants";
import { LoginForm } from "@/components/login/LoginForm";

export const LoginView = () => {
  const [authToken, setAuthToken] = useLocalStorage<string | null>(
    AUTH_TOKEN_KEY,
    null
  );
  const router = useRouter();

  const handleSubmit = (email: string, password: string) => {
    // TODO: Implement login logic
    // const response = await fetch("http://localhost:3000/api/login", {
    //   method: "POST",
    //   body: JSON.stringify({ email, password }),
    // });
    // const { authToken } = await response.json();

    const authToken = "fake-token";
    setAuthToken(authToken);
    router.push("/users");
  };

  useEffect(() => {
    if (authToken) {
      router.push("/users");
    }
  }, [authToken]);

  return (
    <Stack flex={1} justifyContent="center" px={6} py={4}>
      <Card.Root
        flexDirection="column"
        w="100%"
        maxW="sm"
        mx="auto"
        borderRadius={8}
        boxShadow="lg"
      >
        <Card.Header>
          <Heading>Log In</Heading>
        </Card.Header>
        <Card.Body>
          <LoginForm onSubmit={handleSubmit} />
        </Card.Body>
      </Card.Root>
    </Stack>
  );
};
