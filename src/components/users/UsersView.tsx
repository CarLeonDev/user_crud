"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AUTH_TOKEN_KEY, PAGE_SIZE } from "@/constants";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { User, UsersApiResponse } from "@/types/users";
import { getUsers } from "@/services/usersService";
import {
  useInfiniteQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { InfiniteTable } from "@/components/InfiniteTable";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Flex, Heading, Input, InputGroup } from "@chakra-ui/react";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, Trash } from "lucide-react";
import { DeleteUserDialog } from "./DeleteUserDialog";

// Column definitions for the users table.
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

export const UsersView = () => {
  // Authentication state management
  const [authToken] = useLocalStorage<string | null>(AUTH_TOKEN_KEY, null);
  const router = useRouter();
  const queryClient = useQueryClient();

  // Search state with debouncing
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const usersDeleted = useRef<string[]>([]);

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Infinite query for fetching users data
  const {
    data,
    refetch,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<UsersApiResponse>({
    queryKey: ["users"],
    queryFn: async (context) => {
      const pageParam = context.pageParam as number;
      const fetchedData = await getUsers({
        page: pageParam + 1,
        size: PAGE_SIZE,
      });

      // Simulate a real API response
      // Filter out the users that have been deleted
      const data = fetchedData.data.filter(
        ({ id }) => !usersDeleted.current.includes(id)
      );
      const total = fetchedData.total - usersDeleted.current.length;

      return {
        ...fetchedData,
        data,
        total,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: any, allPages) => {
      // If the last page has `PAGE_SIZE items, there is a next page
      const nextPage: any =
        lastPage?.length === PAGE_SIZE ? allPages.length + 1 : undefined;
      return nextPage;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  // Flatten the paginated data into a single array
  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data]
  );

  // Filter users based on search term
  const filteredData = useMemo(() => {
    return flatData.filter(
      (user) =>
        user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [flatData, debouncedSearch]);

  // Calculate total rows based on search state
  const totalRows = debouncedSearch
    ? filteredData.length
    : data?.pages[0].total ?? 0;

  const handleRowClick = (row: Row<User>) => {
    router.push(`/users/${row.original.id}`);
  };

  const handleDeleteRow = async (row: Row<User>) => {
    const user = row.original;

    // Set the selected user and show the delete dialog
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    // Delete the user from the usersDeleted array
    usersDeleted.current = [...usersDeleted.current, selectedUser.id];
    // Invalidate the users query
    await queryClient.invalidateQueries({
      queryKey: ["users"],
      exact: false,
      type: "all",
    });
    // Refetch the users query
    refetch();
    // Close the delete dialog
    setShowDeleteDialog(false);
  };

  useEffect(() => {
    if (authToken) return;

    router.push("/login");
  }, [authToken]);

  return (
    <>
      <DeleteUserDialog
        open={showDeleteDialog}
        user={selectedUser}
        onOpenChange={setShowDeleteDialog}
        onDelete={handleDeleteUser}
      />

      <Flex
        position="relative"
        flex={1}
        flexDirection="column"
        gap={3}
        maxW="100%"
      >
        <Flex
          direction="row"
          alignItems="center"
          gap={3}
          justifyContent="space-between"
        >
          <Heading size="2xl">Users</Heading>

          <InputGroup flex={1} maxW="250px" startElement={<Search size={16} />}>
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Flex>

        <InfiniteTable
          fullHeight
          data={filteredData}
          columns={columns}
          fetchNextPage={fetchNextPage}
          isLoading={isLoading || isFetching || isFetchingNextPage}
          totalRows={totalRows}
          actions={[
            {
              label: "Delete",
              colorPalette: "red",
              icon: <Trash size={16} />,
              onClick: handleDeleteRow,
            },
          ]}
          onRowClick={handleRowClick}
        />
      </Flex>
    </>
  );
};
