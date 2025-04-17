"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { IconButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
  const [token, setToken] = useLocalStorage("auth-token", null);
  const router = useRouter();

  const handleLogout = () => {
    setToken(null);
    router.push("/login");
  };

  if (!token) return null;

  return (
    <IconButton variant="ghost" onClick={handleLogout} aria-label="Logout">
      <LogOut />
    </IconButton>
  );
};
