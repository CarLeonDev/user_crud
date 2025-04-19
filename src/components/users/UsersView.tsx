"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash, UserPlus } from "lucide-react";
import { Flex, Heading, Input, InputGroup } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from "@tanstack/react-table";
import { AUTH_TOKEN_KEY } from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { User } from "@/types/users";
import { InfiniteTable } from "@/components/InfiniteTable";
import { DeleteUserDialog } from "@/components/users/DeleteUserDialog";
import { AddUserDialog } from "@/components/users/AddUserDialog";
import { UserSchema } from "@/schemas/userSchema";
import { useUsersStore } from "@/stores/useUsersStore";
import { useUsersInfinite } from "@/hooks/useUsersInfinite";

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

  const { usersAdded, usersDeleted, setUsersAdded, setUsersDeleted } =
    useUsersStore();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);

  // Infinite query for fetching users data
  const {
    data,
    refetch,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useUsersInfinite();

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
    setUsersDeleted([...usersDeleted, selectedUser.id]);
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

  const handleAddUser = () => {
    setShowAddDialog(true);
  };

  const handleAddUserSubmit = async (data: UserSchema) => {
      // Add the user to the usersAdded array
    setUsersAdded([
      ...usersAdded,
      {
        ...data,
        address: {
          ...data.address,
        },
        id: crypto.randomUUID(),
      },
    ]);
    // Invalidate the users query
    await queryClient.invalidateQueries({
      queryKey: ["users"],
      exact: false,
      type: "all",
    });
    // Refetch the users query
    refetch();
    // Close the add dialog
    setShowAddDialog(false);
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

      <AddUserDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddUserSubmit}
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
          headerActions={[
            {
              label: "Add User",
              colorPalette: "green",
              icon: <UserPlus size={16} />,
              onClick: handleAddUser,
            },
          ]}
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
