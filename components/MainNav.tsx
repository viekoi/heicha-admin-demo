"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();


  const routes = [
    {
      href: `/`,
      label: 'Overview',
      active: pathname === `/`,
    },
    {
      href: `/products`,
      label: 'Sản phẩm',
      active: pathname === `/products${params.productId ? `/${params.productId}`:""}`,
    },
    {
      href: `/toppings`,
      label: 'Toppings',
      active: pathname === `/toppings${params.toppingId ? `/${params.toppingId}`:""}`,
    },
    {
      href: `/categories`,
      label: 'Phân Loại',
      active: pathname ===`/categories${params.categoryId ? `/${params.categoryId}`:""}`
    },
    {
      href: `/sizes`,
      label: 'Sizes',
      active: pathname === `/sizes${params.sizeId ? `/${params.sizeId}`:""}`,
    },
    {
      href: `/orders`,
      label: 'Orders',
      active: pathname === `/orders`,
    },

  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
      </Link>
      ))}
    </nav>
  )
};