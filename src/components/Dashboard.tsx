'use client'

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AUTH_TOKEN_KEY } from "@/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export const Dashboard = () => {
  const [authToken] = useLocalStorage<string | null>(AUTH_TOKEN_KEY, null);
  const router = useRouter();

  useEffect(() => {
    if (authToken) return;

    router.push("/login");
  }, [authToken]);

  return <div>Dashboard</div>;
};
