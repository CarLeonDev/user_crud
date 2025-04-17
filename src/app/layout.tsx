import { Inter } from "next/font/google";
import Provider from "./provider";
import { Flex, Grid, Link, Stack } from "@chakra-ui/react";
import { UserRound } from "lucide-react";
import { ThemeModeToggle } from "@/components/ThemeModeToggle";
import { LogoutButton } from "@/components/LogoutButton";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={inter.className} suppressHydrationWarning>
      <head />
      <body>
        <Provider>
          <Grid templateRows="3.8rem 1fr" w="100vw" h="100vh">
            <Stack
              as="nav"
              position="sticky"
              top={0}
              px={6}
              py={2}
              bg="bg.subtle"
              borderBottomWidth="1px"
              borderBottomColor="border.disabled"
              w="100vw"
              zIndex={100}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                w="100%"
                maxW="8xl"
                mx="auto"
                gap={2}
              >
                <Link href="/">
                  <UserRound />
                </Link>

                <Stack direction="row" gap={2}>
                  <ThemeModeToggle />
                  <div suppressHydrationWarning>
                    <LogoutButton />
                  </div>
                </Stack>
              </Stack>
            </Stack>

            <Stack
              as="main"
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="stretch"
              px={6}
              py={4}
              w="100vw"
            >
              <Flex
                w="100%"
                maxW="8xl"
                mx="auto"
                flex={1}
                flexDirection="column"
              >
                {children}
              </Flex>
            </Stack>
          </Grid>
        </Provider>
      </body>
    </html>
  );
}
