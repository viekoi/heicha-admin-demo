"use client"


import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

import { Checkbox } from "@/components/ui/checkbox"

export type SizeColumn = {
  id: string
  name: string;
}

export const columns: ColumnDef<SizeColumn>[] = [
  {
    id: "Chọn",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Tên",
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];