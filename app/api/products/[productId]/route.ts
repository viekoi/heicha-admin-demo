import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("product id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
    //   include: {
    //     products:true
    //   },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[product_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    
 

    

    const product = await prismadb.product.delete({
      where: {
        id: params.productId,
      },
    });

    
    
    return NextResponse.json(product);
  } catch (error) {
    console.log("[product_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    

    const {name,categoryId,images,toppingIds,sizes,description} = body;

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

    const product = await prismadb.product.update({
      where:{
        id:params.productId
      },
      data:{
         name,
         description,
        categoryId,
        images: {
          deleteMany:{},
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
        toppings:{
          deleteMany:{},
          createMany:{
            data:toppingIds.map((id:string)=>{
              return {toppingId:id}
            })
          }
        },
        sizes:{
          deleteMany:{},
          createMany:{
            data:sizes
          }
        }
      }
    });
    

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
