import { render, screen, fireEvent } from "@testing-library/react";
import { InfiniteTable } from "../../components/InfiniteTable";
import { ColumnDef } from "@tanstack/react-table";
import "@testing-library/jest-dom";
import Provider from "@/app/provider";
import { TEST_IDS } from "@/constants";

describe("InfiniteTable", () => {
  const mockColumns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "age",
      header: "Age",
    },
  ];

  const mockData = [
    { id: "1", name: "John", age: 30 },
    { id: "2", name: "Jane", age: 25 },
  ];

  const defaultProps = {
    data: mockData,
    columns: mockColumns,
    isLoading: false,
    fetchNextPage: jest.fn(),
    totalRows: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders table with correct headers", () => {
    render(<InfiniteTable {...defaultProps} />, { wrapper: Provider });

    const header = screen.getByTestId(TEST_IDS.INFINITE_TABLE_HEADER);

    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Name");
    expect(header).toHaveTextContent("Age");
  });

  it("renders data rows correctly", () => {
    render(<InfiniteTable {...defaultProps} />, { wrapper: Provider });

    const body = screen.getByTestId(TEST_IDS.INFINITE_TABLE_BODY);

    expect(body).toBeInTheDocument();
    expect(body).toHaveTextContent("John");
    expect(body).toHaveTextContent("30");
    expect(body).toHaveTextContent("Jane");
    expect(body).toHaveTextContent("25");
  });

  it("shows loading state when isLoading is true", () => {
    render(<InfiniteTable {...defaultProps} isLoading={true} />, {
      wrapper: Provider,
    });

    expect(
      screen.getByTestId(TEST_IDS.INFINITE_TABLE_LOADING_ROW)
    ).toBeInTheDocument();
  });

  it("shows empty state when there is no data", () => {
    render(<InfiniteTable {...defaultProps} data={[]} />, {
      wrapper: Provider,
    });

    expect(
      screen.getByTestId(TEST_IDS.INFINITE_TABLE_EMPTY_ROW)
    ).toBeInTheDocument();
  });

  it("calls fetchNextPage when scrolling near bottom", async () => {
    const fetchNextPage = jest.fn();
    render(<InfiniteTable {...defaultProps} fetchNextPage={fetchNextPage} />, {
      wrapper: Provider,
    });

    const table = screen.getByTestId(TEST_IDS.INFINITE_TABLE);
    fireEvent.scroll(table, { target: { scrollTop: 1000 } });

    expect(fetchNextPage).toHaveBeenCalled();
  });

  it("handles row click when onRowClick is provided", () => {
    const onRowClick = jest.fn((row) => row);

    render(<InfiniteTable {...defaultProps} onRowClick={onRowClick} />, {
      wrapper: Provider,
    });

    const row = screen.getByTestId(`${TEST_IDS.INFINITE_TABLE_ROW}-0`);
    fireEvent.click(row);

    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it("renders header actions when provided", () => {
    const headerActions = [
      {
        label: "Add",
        icon: <span>➕</span>,
        onClick: jest.fn(),
      },
    ];

    render(<InfiniteTable {...defaultProps} headerActions={headerActions} />, {
      wrapper: Provider,
    });

    expect(screen.getByText("➕")).toBeInTheDocument();
  });

  it("renders row actions when provided", () => {
    const actions = [
      {
        label: "Edit",
        icon: <span>✏️</span>,
        onClick: jest.fn(),
      },
    ];

    render(<InfiniteTable {...defaultProps} actions={actions} />, {
      wrapper: Provider,
    });

    expect(screen.getAllByText("✏️")).toHaveLength(2);
  });

  it("applies fullHeight prop correctly", () => {
    render(<InfiniteTable {...defaultProps} fullHeight={true} />, {
      wrapper: Provider,
    });

    const table = screen.getByTestId(TEST_IDS.INFINITE_TABLE);

    expect(table).toHaveStyle({ maxHeight: "500px" }); // matches mocked height
  });

  it("does not call fetchNextPage when all data is loaded", () => {
    const fetchNextPage = jest.fn();
    render(
      <InfiniteTable
        {...defaultProps}
        fetchNextPage={fetchNextPage}
        totalRows={mockData.length}
      />,
      { wrapper: Provider }
    );

    const table = screen.getByTestId(TEST_IDS.INFINITE_TABLE);
    fireEvent.scroll(table, { target: { scrollTop: 1000 } });

    expect(fetchNextPage).not.toHaveBeenCalled();
  });
});
