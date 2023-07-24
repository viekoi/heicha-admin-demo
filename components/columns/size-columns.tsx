"use client"

import Image from "next/image"

import { ColumnDef } from "@tanstack/react-table"



import { Checkbox } from "@/components/ui/checkbox"

import { SizeColumn } from "@/app/(dashboard)/sizes/components/columns"

export const SelectSizeColumns: ColumnDef<SizeColumn>[] = [
  {
    id: "Chọn",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row,table }) => (
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

];