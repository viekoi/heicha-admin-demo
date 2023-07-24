"use client";

import { Loader } from "@/components/ui/loader";


const Loading = () => {
  return ( 
    <div className=" fixed inset-0 h-full w-full">
      <div className="flex items-center justify-center w-full h-full">
        <Loader />
      </div>
    </div>
   );
}
 
export default Loading;