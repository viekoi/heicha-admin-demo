"use client"

import Image from "next/image"

import { ColumnDef } from "@tanstack/react-table"



import { Checkbox } from "@/components/ui/checkbox"

import { ToppingColumn } from "@/app/(dashboard)/toppings/components/columns"

export const SelectToppingColumns: ColumnDef<ToppingColumn>[] = [
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
  {
    accessorKey: "image",
    header: "Ảnh sản phẩm",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
       <Image src={row.original.imageUrl} alt="image" height={40} width={40}/>
      </div>
    )
  },
  {
    accessorKey: "price",
    header: "Giá",
  },

];