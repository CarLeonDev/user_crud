import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Loading } from "@/components/ui/Loading";
import React from "react";
import {
  Box,
  Flex,
  IconButton,
  IconButtonProps,
  Table,
} from "@chakra-ui/react";
import { useMeasure } from "@/hooks/useMeasure";
import { renderToString } from "react-dom/server";

type Action = {
  label: string;
  icon: React.ReactNode;
  colorPalette?: IconButtonProps["colorPalette"];
  onClick: (row: Row<any>) => void;
};

type HeaderAction = Action & {
  onClick: () => void;
};

/**
 * Props for the InfiniteTable component.
 * Extends standard HTML table attributes with additional props for infinite scrolling functionality.
 */
type InfiniteTableProps = React.TableHTMLAttributes<HTMLTableElement> & {
  /** The data to display in the table */
  data: any[];
  /** Column definitions for the table using TanStack Table */
  columns: ColumnDef<any>[];
  /** Whether the table is currently loading more data */
  isLoading: boolean;
  /** Function to fetch the next page of data */
  fetchNextPage: () => void;
  /** Total number of rows in the dataset */
  totalRows: number;
  /** Whether the table should take up the full height of its container */
  fullHeight?: boolean;
  /** Actions to display in the header */
  headerActions?: HeaderAction[];
  /** Actions to display in the last column */
  actions?: Action[];
  /** Callback function when a row is clicked */
  onRowClick?: (row: Row<any>) => void;
};

/**
 * Estimated height of a table row in pixels.
 * Used for accurate scrollbar calculations in virtualized scrolling.
 */
const ESTIMATE_ROW_HEIGHT = 36;

/**
 * The width of an action button in pixels.
 */
const ACTION_BUTTON_WIDTH = 36;

/**
 * A virtualized table component that supports infinite scrolling.
 * This component efficiently renders large datasets by only rendering the visible portion of the table.
 */
export const InfiniteTable = React.forwardRef<
  HTMLTableElement,
  InfiniteTableProps
>(
  (
    {
      data,
      columns,
      isLoading,
      fetchNextPage,
      totalRows,
      fullHeight = false,
      onRowClick,
      actions,
      headerActions,
    },
    externalRef
  ) => {
    const internalRef = useRef<HTMLTableElement>(null);
    const [containerRef, { height }] = useMeasure<HTMLDivElement>();

    const ref = useMemo(
      () => externalRef || internalRef,
      [externalRef, internalRef]
    ) as React.RefObject<HTMLTableElement>;

    const totalFetched = data.length;

    // called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
    const fetchMoreOnBottomReached = useCallback(
      (containerRefElement?: HTMLDivElement | null) => {
        if (containerRefElement) {
          const { scrollHeight, scrollTop, clientHeight } = containerRefElement;

          // once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
          if (
            scrollHeight - scrollTop - clientHeight < 500 &&
            !isLoading &&
            totalFetched < totalRows
          ) {
            fetchNextPage();
          }
        }
      },
      [fetchNextPage, isLoading, totalFetched, totalRows]
    );

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      debugTable: false,
    });

    const { rows } = table.getRowModel();

    const rowVirtualizer = useVirtualizer({
      count: rows.length,
      estimateSize: () => ESTIMATE_ROW_HEIGHT,
      getScrollElement: () => ref.current,
      overscan: 10,
    });

    const isEmpty = rows.length === 0;

    // a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
    useEffect(() => {
      fetchMoreOnBottomReached(ref.current);
    }, [fetchMoreOnBottomReached]);

    return (
      <Flex
        ref={containerRef}
        flex={1}
        alignSelf="stretch"
        justifyContent="center"
        alignItems="stretch"
      >
        <Table.Root
          ref={ref}
          variant="outline"
          size="sm"
          position="relative"
          display="grid"
          gridAutoRows="min-content"
          w="100%"
          overflow="auto"
          rounded="md"
          h="min-content"
          maxH={fullHeight ? `${height}px` : "auto"}
          onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
        >
          <Table.Header
            display="grid"
            position="sticky"
            top={0}
            gridTemplateColumns="1fr"
            gridTemplateRows="auto"
            zIndex={10}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id} display="flex" w="100%">
                {headerGroup.headers.map((header) => (
                  <Table.ColumnHeader
                    key={header.id}
                    display="flex"
                    bg="bg.subtle"
                    w={`${header.column.getSize()}px`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Table.ColumnHeader>
                ))}

                <Table.ColumnHeader
                  position="sticky"
                  right={0}
                  display="flex"
                  flex={1}
                  bg="bg.subtle"
                  boxSizing="content-box"
                  w="100%"
                  px={actions?.length ? 2 : 0}
                  py={0}
                  justifyContent="flex-end"
                  minW={`${(actions?.length ?? 0) * ACTION_BUTTON_WIDTH}px`}
                >
                  {headerActions?.map((action) => (
                    <IconButton
                      key={action.label}
                      variant="ghost"
                      size="sm"
                      colorPalette={action.colorPalette}
                      aria-label={action.label}
                      title={action.label}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick();
                      }}
                    >
                      {action.icon}
                    </IconButton>
                  ))}
                </Table.ColumnHeader>
              </Table.Row>
            ))}
          </Table.Header>

          <Table.Body
            display="grid"
            position="relative"
            h={`${
              rowVirtualizer.getTotalSize() +
              (isEmpty || isLoading ? ESTIMATE_ROW_HEIGHT : 0)
            }px`}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<any>;

              return (
                <TableRow
                  key={row.id}
                  ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                  data-index={virtualRow.index} //needed for dynamic row height measurement
                  position="absolute"
                  display="flex"
                  w="100%"
                  style={{
                    //this should always be a `style` as it changes on scroll
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  cursor={onRowClick ? "pointer" : "default"}
                  onClick={() => onRowClick?.(row)}
                >
                  {row.getVisibleCells().map((cell) => {
                    const cellValue = flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    );

                    return (
                      <TableCell
                        key={cell.id}
                        display="flex"
                        w={`${cell.column.getSize()}px`}
                        isOdd={virtualRow.index % 2 === 0}
                      >
                        <Box
                          w="100%"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          title={renderToString(cellValue) ?? ""}
                        >
                          {cellValue}
                        </Box>
                      </TableCell>
                    );
                  })}

                  <TableCell
                    position="sticky"
                    right={0}
                    display="flex"
                    flex={1}
                    w="100%"
                    px={actions?.length ? 2 : 0}
                    py={0}
                    justifyContent="flex-end"
                    isOdd={virtualRow.index % 2 === 0}
                  >
                    {actions?.map((action) => (
                      <IconButton
                        key={action.label}
                        variant="ghost"
                        size="sm"
                        colorPalette={action.colorPalette}
                        aria-label={action.label}
                        title={action.label}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                      >
                        {action.icon}
                      </IconButton>
                    ))}
                  </TableCell>
                </TableRow>
              );
            })}

            {isLoading && (
              <TableRow
                display="flex"
                style={{
                  transform: `translateY(${rowVirtualizer.getTotalSize()}px)`,
                }}
              >
                <TableCell
                  display="flex"
                  w="100%"
                  h={`${ESTIMATE_ROW_HEIGHT}px`}
                  gap={2}
                >
                  <Loading size="sm" />
                  <span>Loading...</span>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && isEmpty && (
              <TableRow display="flex" w="100%">
                <TableCell w="100%">No data available</TableCell>
              </TableRow>
            )}
          </Table.Body>
        </Table.Root>
      </Flex>
    );
  }
);

const TableRow = React.forwardRef<HTMLTableRowElement, Table.RowProps>(
  ({ children, ...props }, ref) => {
    return (
      <Table.Row
        {...props}
        ref={ref}
        className={`${props.className ?? ""} group`}
      >
        {children}
      </Table.Row>
    );
  }
);

type TableCellProps = React.TableHTMLAttributes<HTMLTableCellElement> &
  Table.CellProps & {
    isOdd?: boolean;
  };

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, isOdd, ...props }, ref) => {
    return (
      <Table.Cell
        {...props}
        ref={ref}
        bg={isOdd ? "bg.muted" : "bg"}
        _groupHover={{
          bg: "bg.emphasized",
          borderColor: "border.emphasized",
        }}
      >
        {children}
      </Table.Cell>
    );
  }
);
