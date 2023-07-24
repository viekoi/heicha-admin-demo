import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { toppingId: string } }
) {
  try {
    if (!params.toppingId) {
      return new NextResponse("Topping id is required", { status: 400 });
    }

    const topping = await prismadb.topping.findUnique({
      where: {
        id: params.toppingId,
      },
      include: {
        products:true
      },
    });

    return NextResponse.json(topping);
  } catch (error) {
    console.log("[TOPPING_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { toppingId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.toppingId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    
 

    

    const topping = await prismadb.topping.delete({
      where: {
        id: params.toppingId,
      },
    });

    
    
    return NextResponse.json(topping);
  } catch (error) {
    console.log("[TOPPING_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { toppingId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const {
      name,
      price,
      imageUrl,
      
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.toppingId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("ImageUrl are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    



    


    const topping =  await prismadb.topping.update({
      where: {
        id: params.toppingId,
      },
      data: {
        name,
        price,
        imageUrl,
      },
    });

    

    return NextResponse.json(topping);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
