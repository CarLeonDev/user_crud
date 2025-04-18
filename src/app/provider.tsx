"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

export default function RootLayout(props: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={defaultSystem}>
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          defaultTheme="dark"
        >
          {props.children}
        </ThemeProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
