"use client";
import { useState, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelection,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  onValueChange: (event: { sizeId: string; price: number }[]) => void;
  initialData: { sizeId: string; price: number }[] | undefined;
}

export function SelectSizeTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onValueChange,
  initialData,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
  });

  const [submitData, setSubmitData] = useState(initialData ? initialData : []);
  const [unCheckedValues, setUnCheckedValues] = useState<
    {
      sizeId: string;
      price: number;
    }[]
  >([]);
// on price change
  const onSelectandSetPrice = (sizeId: string, price: number) => {
    const updatedData = [...submitData];
    const updatedingIndex = updatedData.findIndex((o) => o.sizeId === sizeId);
    if (updatedingIndex === -1) {
      updatedData.push({ sizeId: sizeId, price: price });
    } else {
      updatedData[updatedingIndex].price = price;
    }
    setSubmitData(updatedData);
  };

  const handleInitialSelectedIds = () => {
    if (!initialData) return;
    table.getFilteredRowModel().rows.map((row) => {
      const data: any = { ...row.original };
      const obj = initialData.find((o) => o.sizeId === data.id);
      if (obj) {
        row.toggleSelected(true);
      }
    });

    setSubmitData(initialData);
  };
// handle inital selected
  useEffect(() => {
    handleInitialSelectedIds();
  }, []);
// handle unselected (have to be under handle intial selected)
  useEffect(() => {
    const seletedIds = table.getFilteredSelectedRowModel().rows.map((row) => {
      const data: any = { ...row.original };
      return data.id;
    });

    const newUncheckedValues = [...submitData].filter(
      (o) => !seletedIds.includes(o.sizeId)
    );

    const reCheckedData = [...unCheckedValues].filter((o) =>
      seletedIds.includes(o.sizeId)
    );

    const preCheckedData = [...submitData].filter((o) =>
      seletedIds.includes(o.sizeId)
    );

    const updatedUnCheckedValues = [
      ...unCheckedValues,
      ...newUncheckedValues,
    ].filter((ad) => reCheckedData.every((fd) => fd.sizeId !== ad.sizeId));

    // giá trị submit form mới
    const updatedData = [...preCheckedData, ...reCheckedData];
    setSubmitData(updatedData);
    setUnCheckedValues(updatedUnCheckedValues);
  }, [rowSelection]);

// handle form filed value change
  useEffect(() => {
    onValueChange(submitData);
  }, [submitData]);

  return (
    <>
      <div>
        <div className="flex items-center py-4">
          <Input
            placeholder="Nhập tên để tìm sản phẩm"
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                  <TableHead>Giá</TableHead>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  const data: any = { ...row.original };
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Input
                          placeholder="VD: 30000"
                          defaultValue={
                            initialData
                              ? Number(
                                  initialData.find((o) => o.sizeId === data.id)
                                    ?.price
                                )
                              : 0
                          }
                          disabled={!row.getIsSelected()}
                          type="number"
                          onChange={(e) => {
                            onSelectandSetPrice(
                              data.id,
                              Number(e.target.value)
                            );
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không có sản phẩm nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Quay lại
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Tiếp theo
          </Button>
        </div>
      </div>
    </>
  );
}
