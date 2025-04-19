import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useUsersStore } from "@/stores/useUsersStore";
import { UsersApiResponse } from "@/types/users";
import { getUsers } from "@/services/usersService";
import { PAGE_SIZE } from "@/constants";

export const useUsersInfinite = () => {
  const { usersAdded, usersDeleted} = useUsersStore();

  const getUsersMutation = async (page: number) => {
    const fetchedData = await getUsers({
      page,
      size: PAGE_SIZE,
    });

    // <<< Simulate a real API response >>>

    // Ids of the users that have been deleted from the API response
    const usersDeletedIds = usersDeleted.filter(
      (id) => !usersAdded.some((user) => user.id === id)
    );

    // Filter out the users that have been deleted
    const data = fetchedData.data.filter(
      ({ id }) => !usersDeletedIds.includes(id)
    );
    const total = fetchedData.total - usersDeletedIds.length;

    // If reached the end of the users, return with the new users added
    if (data.length === total || total >= page * PAGE_SIZE) {
      // Filter out the users that have been deleted from the usersAdded array
      const userAddedData = usersAdded.filter(
        ({ id }) => !usersDeleted.includes(id)
      );

      // Return with the new users added
      return {
        ...fetchedData,
        data: [...data, ...userAddedData],
        total: total + userAddedData.length,
      };
    }

    return {
      ...fetchedData,
      data,
      total,
    };
  };

  // Infinite query for fetching users data
  return useInfiniteQuery<UsersApiResponse>({
    queryKey: ["users"],
    queryFn: async (context) => getUsersMutation(context.pageParam as number),
    initialPageParam: 1,
    getNextPageParam: ({ total }, allPages) => {
      const currentPage = allPages.length;
      const lastPage = Math.ceil(total / PAGE_SIZE);

      if (currentPage === lastPage) return undefined;

      return currentPage + 1;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });
};
