import { Inter } from "next/font/google"
import Provider from "./provider"
import { Grid, Link, Stack } from "@chakra-ui/react"
import { UserRound } from "lucide-react"
import { ThemeModeToggle } from "@/components/ThemeModeToggle"
import { LogoutButton } from "@/components/LogoutButton"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={inter.className} suppressHydrationWarning>
      <head />
      <body>
        <Provider>
          <Grid templateRows="3.8rem 1fr" height="100vh">
            <Stack
              as="nav"
              position="sticky"
              top={0}
              px={4}
              py={2}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              bg="background.primary"
              borderBottomWidth="1px"
              borderBottomColor="border.disabled"
              zIndex={100}
            >
              <Link href="/"><UserRound /></Link>

              <Stack direction="row" gap={2}>
                <ThemeModeToggle />
                <div suppressHydrationWarning>
                  <LogoutButton />
                </div>
              </Stack>
            </Stack>

            <Stack as="main">
              {children}
            </Stack>
          </Grid>
        </Provider>
      </body>
    </html>
  )
}