"use client";

import { Loader } from "@/components/ui/loader";


const Loading = () => {
  return ( 
    <div className="flex h-full inset-0 w-full items-center justify-center">
      <Loader />
    </div>
   );
}
 
export default Loading;