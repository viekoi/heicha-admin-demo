"use client";

import Image from "next/image";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

import { Checkbox } from "@/components/ui/checkbox";

import { Image as PrismaImage, Category, Size, Topping } from "@prisma/client";

export type ProductColumn = {
  id: string;
  name: string;
  category: Category;
  categoryId: string;
  images: PrismaImage[];
  sizes: { size: Size; price: string }[];
  toppings: Topping[];
};

export const columns: ColumnDef<ProductColumn>[] = [
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
    enableSorting: false,
    enableHiding: false,
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
        <Image
          src={row.original.images[0].url}
          alt="image"
          height={40}
          width={40}
        />
        ({row.original.images.length})
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Mã phân loại",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.category.name}
      </div>
    ),
  },
  {
    accessorKey: "topping",
    header: "Topping khả dụng",
    cell: ({ row }) => (
      <>
      <div className="flex items-center gap-x-2 relative">
        {row.original.toppings.slice(0, 4).map((topping, index) => {
          return (
            <div
              key={topping.id}
              className="absolute w-[40px] h-[40px] bg-stone-300 rounded-full border-[1px] border-solid border-stone-300 overflow-hidden"
              style={{
                transform: `translateX(${index * 20}px)`,
                zIndex: row.original.toppings.length - index,
              }}
            >
              <Image
                className="absolute"
                src={topping.imageUrl}
                alt="image"
                fill
                objectFit="cover"
              />
            </div>
          );
        })}
        <div className="absolute translate-x-[100px] ">{`(${row.original.toppings.length})`}</div>
        
      </div>
      </>
    ),
  },
  {
    accessorKey: "size",
    header: "Size khả dụng",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <ul className="flex flex-col gap-1">
          {row.original.sizes.map((size) => {
            return (
              <li
                className=""
                key={size.size.id}
              >{`${size.size.name} - ${size.price}`}</li>
            );
          })}
        </ul>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
