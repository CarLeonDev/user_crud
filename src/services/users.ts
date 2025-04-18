import { API_URL } from "@/constants";

export const getUsers = async ({ page, size }: { page: number, size: number }) => {
  // TODO: add pagination to the response
  // const response = await fetch(`${API_URL}/users?page=${page}&size=${size}`);
  const response = await fetch(`${API_URL}/users`);
  const data = await response.json();

  return {
    data: data,
    total: data.length,
  };
};


export const getUser = async (id: string) => {
  const response = await fetch(`${API_URL}/users/${id}`);
  const data = await response.json();
  
  return data;
};

