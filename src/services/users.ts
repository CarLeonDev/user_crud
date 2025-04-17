import { API_URL } from "@/constants";

export const getUsers = async ({ page, size }: { page: number, size: number }) => {
  // TODO: add pagination to the response
  // const response = await fetch(`${API_URL}/users?page=${page}&size=${size}`);
  const response = await fetch(`${API_URL}/users`);
  const data = await response.json();

  return {
    data: data.map((user: any, index: number) => ({
      ...user,
      id: index + ((page - 1) * size),
    })),
    total: 1000,
  };
};

