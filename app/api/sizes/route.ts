import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';



export const GET = async (req: Request) => {
  try {
    const sizes = await prismadb.size.findMany({
      where: {},
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[SIZES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const  POST = async (req:Request)=> {
  try {
    const { userId } = auth();

    const body = await req.json();

    

    const { name} = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    const size = await prismadb.size.create({
      data: {
        name,
      },
    });
  
    return NextResponse.json(size);
  } catch (error) {
    console.log('[SIZES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export const  DELETE = async (req:Request)=> {
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

    const sizes = await prismadb.size.deleteMany({
      where:{
        id:{
          in:ids
        }
      }
    });
  
    return NextResponse.json(sizes);
  } catch (error) {
    console.log('[SIZES_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


