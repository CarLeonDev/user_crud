"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { IconButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useHydration } from "@/hooks/useHydration";
import { TEST_IDS } from "@/constants";

export const LogoutButton = () => {
  const isHydrated = useHydration();
  const [token, setToken] = useLocalStorage("auth-token", null);
  const router = useRouter();

  const handleLogout = () => {
    setToken(null);
    router.push("/login");
  };

  if (!isHydrated) return null;
  if (!token) return null;

  return (
    <IconButton
      variant="ghost"
      aria-label="Logout"
      data-testid={TEST_IDS.LOGOUT_BUTTON}
      onClick={handleLogout}
    >
      <LogOut />
    </IconButton>
  );
};
