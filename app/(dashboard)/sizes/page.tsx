import React from 'react'
import prismadb from '@/lib/prismadb';
import format from 'date-fns/format';
import vi from 'date-fns/locale/vi'
import { SizesClient } from './components/SizesClient';
import { SizeColumn } from './components/columns';

const page = async() => {

  const sizes = await prismadb.size.findMany({
    where: {
    },
    orderBy: {
      createdAt: 'desc'
    }
  });




  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'do-M-yyyy',{locale:vi}),
  }));


  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSizes}/>
       
      </div>
    </div>
  )
}

export default page