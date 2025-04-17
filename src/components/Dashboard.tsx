"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AUTH_TOKEN_KEY } from "@/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, UsersApiResponse } from "@/types/users";
import { getUsers } from "@/services/users";
import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { InfiniteTable } from "@/components/InfiniteTable";
import { ColumnDef } from "@tanstack/react-table";
import { Flex, Heading } from "@chakra-ui/react";

const columns: ColumnDef<User, any>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 180,
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 225,
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    size: 225,
  },
];

export const Dashboard = () => {
  const [authToken] = useLocalStorage<string | null>(AUTH_TOKEN_KEY, null);
  const router = useRouter();

  const { data, fetchNextPage, isFetching, isFetchingNextPage, isLoading } =
    useInfiniteQuery<UsersApiResponse>({
      queryKey: ["users"],
      queryFn: async (context) => {
        const pageParam = context.pageParam as number;
        const fetchedData = await getUsers({ page: pageParam + 1, size: 10 });
        return fetchedData;
      },
      initialPageParam: 0,
      getNextPageParam: (_lastGroup, groups) => groups.length,
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousData,
    });

  useEffect(() => {
    if (authToken) return;

    router.push("/login");
  }, [authToken]);

  const totalRows = data?.pages[0].total ?? 0;

  return (
    <Flex
      position="relative"
      alignSelf="center"
      flex={1}
      flexDirection="column"
      gap={3}
      px={6}
      py={4}
      maxW="100%"
    >
      <Heading size="lg">Users</Heading>

      <InfiniteTable
        fullHeight
        data={data}
        columns={columns}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading || isFetching || isFetchingNextPage}
        totalRows={totalRows}
      />
    </Flex>
  );
};
