import { mockUsers } from "./users.mock";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  ...jest.requireActual("@tanstack/react-query"),
  useQueryClient: jest.fn(),
}));

// Mock the virtualizer
jest.mock("@tanstack/react-virtual", () => ({
  ...jest.requireActual("@tanstack/react-virtual"),
  useVirtualizer: ({
    count,
    estimateSize,
    getScrollElement,
    overscan,
  }: {
    count: number;
    estimateSize: () => number;
    getScrollElement: () => HTMLElement;
    overscan: number;
  }) => ({
    getVirtualItems: () =>
      Array.from({ length: count }, (_, i) => ({
        index: i,
        start: i * estimateSize(),
        size: estimateSize(),
        getVisibleCells: () => [],
      })),
    getTotalSize: () => count * estimateSize(),
    measureElement: () => {},
  }),
}));

jest.mock("@/hooks/useDebounce", () => ({
  useDebounce: jest.fn((value: string) => value),
}));

jest.mock("@/hooks/useHydration", () => ({
  useHydration: jest.fn(() => true),
}));

jest.mock("@/hooks/useLocalStorage", () => ({
  useLocalStorage: jest.fn((key: string, value: any) => [key, jest.fn()]),
}));

jest.mock("@/hooks/useMeasure", () => ({
  useMeasure: jest.fn(() => [jest.fn(), { width: 1000, height: 500 }]),
}));

jest.mock("@/hooks/useUsersInfinite", () => ({
  useUsersInfinite: jest.fn(() => ({
    data: {
      pages: [
        {
          data: mockUsers,
          total: mockUsers.length,
        },
      ],
    },
    error: null,
    isLoading: false,
    isFetching: false,
    isFetchingNextPage: false,
    fetchNextPage: jest.fn(),
    refetch: jest.fn(),
  })),
}));

jest.mock("@/stores/useUsersStore", () => ({
  useUsersStore: jest.fn(() => ({
    usersAdded: [],
    usersDeleted: [],
    setUsersAdded: jest.fn(),
    setUsersDeleted: jest.fn(),
  })),
}));
