import { Metadata } from "next";
import { UserView } from "@/components/users/UserView";

export const metadata: Metadata = {
  title: "User",
  description: "User",
};

export default function User() {
  return <UserView />;
}
