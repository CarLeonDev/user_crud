import { Metadata } from "next";
import { UsersView } from "@/components/users/UsersView";

export const metadata: Metadata = {
  title: "Users",
  description: "Users",
};

export default function UsersPage() {
  return <UsersView />;
}
