"use client";
import { useParams } from "next/navigation";

export const UserView = () => {
  const { id } = useParams();

  return <div>UserView {id}</div>;
};
