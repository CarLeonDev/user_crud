import { Metadata } from "next";
import { LoginView } from "@/components/login/LoginView";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return <LoginView />;
}
