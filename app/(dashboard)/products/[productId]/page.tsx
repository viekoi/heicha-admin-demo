import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";
import { ToppingColumn } from "../../toppings/components/columns";
import { formatter } from "@/lib/utils";

const ToppingPage = async ({
  params
}: {
  params: { productId: string}
}) => {
  
  const product = await prismadb.product.findUnique({
    where: {
      id:params.productId
    },
    include:{
      category:true,
      toppings:true,
      sizes:true,
      images:true
    },
  });

  const toppings = await prismadb.topping.findMany({
    where:{},
    orderBy:{
      createdAt:"desc"
    }
  })




  const sizes = await prismadb.size.findMany({
    where:{},
    include:{
      products:{
        where:{
          productId:product? product.id :{}
        }
      }
    },
    orderBy:{
      createdAt:"desc"
    }
  })

  
  const categories = await prismadb.category.findMany({
    where:{},
    orderBy:{
      createdAt:"desc"
    }
  })
 

  const formattedToppings: ToppingColumn[] = toppings.map((item) => ({
    id: item.id,
    name: item.name,
    price: formatter.format(item.price.toNumber()),
    imageUrl:item.imageUrl,
  }));


  

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          toppings={formattedToppings}
          categories={categories}
          sizes={sizes}
        />
      </div>
    </div>
  );
}

export default ToppingPage;