"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"
import { useEffect, useState } from "react";

export default function RootLayout(props: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true)
  }, [])

  if (!hydrated) {
    // this returns null on first render, so the client and server match
    return null
  }


  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="class" disableTransitionOnChange defaultTheme="dark">
        {props.children}
      </ThemeProvider>
    </ChakraProvider>
  )
}