"use client";
import { useState,useEffect} from "react";
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
  onValueChange:(event: string[])=>void, 
  initialData:{id:string}[] | undefined
}

export function SelectToppingTable<TData, TValue>({
  columns,
  data,
  searchKey,
  onValueChange,
  initialData

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
    onRowSelectionChange:setRowSelection,
    state: {
      columnFilters,
      rowSelection,
    },
  });

 
  const seletedIds = table.getFilteredSelectedRowModel().rows.map((row)=>{
    const data:any = {...row.original}  
    return data.id
  })

  


  const handleInitialSelectedIds = ()=>{
    if(!initialData) return
    table.getFilteredRowModel().rows.map((row)=>{
      const data:any = {...row.original}
      const obj = initialData.find(o => o.id ===data.id);
      if(obj){
        row.toggleSelected(true)
      }
    })
  }





 useEffect(() => {
   onValueChange(seletedIds)
   console.log(`ran 1`)
 }, [rowSelection])



 useEffect(()=>{
  handleInitialSelectedIds()
  console.log('ran 2')
 },[])

 
 


 
  



  return (
    <>
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Nhập tên để tìm sản phẩm"
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
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
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
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
                </TableRow>
              ))
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
