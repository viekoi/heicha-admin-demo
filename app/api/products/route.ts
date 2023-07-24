import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export const GET = async (req: Request) => {
  try {
    const products = await prismadb.product.findMany({
      where: {},
      include: {
        toppings: {
          include: {
            topping: true,
          },
        },
        sizes: {
          include: {
            size: true,
          },
        },
        images: true,
        category: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[productsS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, categoryId, images, toppingIds, sizes, description } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }
    if (!description) {
      return new NextResponse("description is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("category id is required", { status: 400 });
    }

    if (!images) {
      return new NextResponse("images is required", { status: 400 });
    }

    if (!toppingIds) {
      return new NextResponse("topping id is required", { status: 400 });
    }

    if (!sizes) {
      return new NextResponse("topping id is required", { status: 400 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        description,
        categoryId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        toppings: {
          createMany: {
            data: toppingIds.map((id: string) => {
              return { toppingId: id };
            }),
          },
        },
        sizes: {
          createMany: {
            data: sizes,
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[SIZES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { userId } = auth();

    const body = await req.json();

    const ids = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!ids) {
      return new NextResponse("ids is required", { status: 400 });
    }

    const products = await prismadb.product.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
