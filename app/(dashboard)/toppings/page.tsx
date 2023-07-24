import React from 'react'
import prismadb from '@/lib/prismadb';
import format from 'date-fns/format';
import vi from 'date-fns/locale/vi'


import { ToppingsClient } from './components/ToppingClient'
import { ToppingColumn } from './components/columns';
import { formatter } from "@/lib/utils";


const page = async() => {

  const toppings = await prismadb.topping.findMany({
    where: {
    },
    orderBy: {
      createdAt: 'desc'
    }
  });




  const formattedToppings: ToppingColumn[] = toppings.map((item) => ({
    id: item.id,
    name: item.name,
    price: formatter.format(item.price.toNumber()),
    createdAt: format(item.createdAt, 'do-M-yyyy',{locale:vi}),
    imageUrl:item.imageUrl,
  }));

  


  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ToppingsClient data={formattedToppings}/>
       
      </div>
    </div>
  )
}

export default page