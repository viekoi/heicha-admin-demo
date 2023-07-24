import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export const GET = async (req: Request) => {
  try {
    const toppings = await prismadb.topping.findMany({
      where: {},
    });

    return NextResponse.json(toppings);
  } catch (error) {
    console.log("[TOPPINGS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();

    const body = await req.json();

    console.log(body);

    const { name, price, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    const topping = await prismadb.topping.create({
      data: {
        name,
        price,
        imageUrl,
      },
    });

    return NextResponse.json(topping);
  } catch (error) {
    console.log("[TOPPINGS_POST]", error);
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

    const toppings = await prismadb.topping.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json(toppings);
  } catch (error) {
    console.log("[TOPPINGS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
