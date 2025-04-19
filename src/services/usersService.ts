/* eslint-disable @typescript-eslint/no-unused-vars */
import { API_URL } from "@/constants";
import { UsersApiResponse } from "@/types/users";

export const getUsers = async ({
  page,
  size,
}: {
  page: number;
  size: number;
}) => {
  // TODO: add pagination to the response
  // const response = await fetch(`${API_URL}/users?page=${page}&size=${size}`);
  const response = await fetch(`${API_URL}/users`);
  const data = await response.json();

  // Simulate pagination
  // return {
  //   data: data.map((user: any, index: number) => ({
  //     ...user,
  //     id: index + 1 + (page - 1) * size,
  //   })),
  //   total: 1000,
  // };

  return {
    data: data,
    total: data.length,
  } as UsersApiResponse;
};

export const getUser = async (id: string) => {
  const response = await fetch(`${API_URL}/users/${id}`);
  const data = await response.json();

  return data;
};
