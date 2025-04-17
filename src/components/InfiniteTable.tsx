import { InfiniteData } from "@tanstack/react-query";
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
import { Box, Flex, Table } from "@chakra-ui/react";
import { useMeasure } from "@/hooks/useMeasure";
import { renderToString } from "react-dom/server";

/**
 * Props for the InfiniteTable component.
 * Extends standard HTML table attributes with additional props for infinite scrolling functionality.
 */
type InfiniteTableProps = React.TableHTMLAttributes<HTMLTableElement> & {
  /** The data to display in the table, using React Query's InfiniteData type */
  data: InfiniteData<any, unknown> | undefined;
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
  /** Callback function when a row is clicked */
  onRowClick?: (row: Row<any>) => void;
};

/**
 * Estimated height of a table row in pixels.
 * Used for accurate scrollbar calculations in virtualized scrolling.
 */
const ESTIMATE_ROW_HEIGHT = 36;

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
    },
    externalRef
  ) => {
    const internalRef = useRef<HTMLTableElement>(null);
    const [containerRef, { height }] = useMeasure<HTMLDivElement>();

    const ref = useMemo(
      () => externalRef || internalRef,
      [externalRef, internalRef]
    ) as React.RefObject<HTMLTableElement>;

    const flatData = useMemo(
      () => data?.pages?.flatMap((page) => page.data) ?? [],
      [data]
    );

    const totalFetched = flatData.length;

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
      data: flatData,
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
          striped
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
                <Table.Row
                  key={row.id}
                  ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                  data-index={virtualRow.index} //needed for dynamic row height measurement
                  className="group"
                  position="absolute"
                  display="flex"
                  w="100%"
                  transform={`translateY(${virtualRow.start}px)`} //this should always be a `style` as it changes on scroll
                  cursor={onRowClick ? "pointer" : "default"}
                  onClick={() => onRowClick?.(row)}
                >
                  {row.getVisibleCells().map((cell) => {
                    const cellValue = flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    );

                    return (
                      <Table.Cell
                        key={cell.id}
                        display="flex"
                        w={`${cell.column.getSize()}px`}
                        _groupHover={{
                          bg: "bg.emphasized",
                          borderColor: "border.emphasized",
                        }}
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
                      </Table.Cell>
                    );
                  })}
                </Table.Row>
              );
            })}

            {isLoading && (
              <Table.Row
                display="flex"
                transform={`translateY(${rowVirtualizer.getTotalSize()}px)`}
              >
                <Table.Cell
                  display="flex"
                  w="100%"
                  h={`${ESTIMATE_ROW_HEIGHT}px`}
                  gap={2}
                >
                  <Loading size="sm" />
                  <span>Loading...</span>
                </Table.Cell>
              </Table.Row>
            )}

            {!isLoading && isEmpty && (
              <Table.Row display="flex" w="100%">
                <Table.Cell>No data available</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Flex>
    );
  }
);
