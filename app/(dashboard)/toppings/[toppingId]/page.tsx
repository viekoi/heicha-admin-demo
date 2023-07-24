import prismadb from "@/lib/prismadb";
import { ToppingForm } from "./components/topping-form";
import { Topping } from "@prisma/client";
const ToppingPage = async ({
  params
}: {
  params: { toppingId: string}
}) => {
  
  const topping = await prismadb.topping.findUnique({
    where: {
      id: params.toppingId,
    }
  });

 

  


  

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ToppingForm
          initialData={topping}
        />
      </div>
    </div>
  );
}

export default ToppingPage;