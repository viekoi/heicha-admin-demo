"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import {  useRouter } from "next/navigation";

import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { ToppingColumn, columns } from "./columns";
import { useAlertModal } from "@/hooks/useAlertModal";

interface ToppingsClientProps {
  data: ToppingColumn[];
};

export const ToppingsClient: React.FC<ToppingsClientProps> = ({
  data
}) => {

  const router = useRouter();
  const alertModal = useAlertModal()

  const [loading,setLoading] = useState(false)


  const onDelete = async (ids:string[]) => {
    try {
      setLoading(true);
      await fetch(`/api/toppings`, {
        method: "DELETE",
        body: JSON.stringify(ids),
      });
      router.refresh();
      router.push(`/toppings`);
      toast.success('Xóa thành công.');
    } catch (error: any) {
      toast.error('Đã có lỗi.');
    } finally {
      setLoading(false);
      alertModal.onClose()
     
    }
  };

  return (
    <> 
      <div className="flex items-center justify-between">
        <Heading title={`Sản phẩm: ${data.length}`} description="Quản lí topping" />
        <Button onClick={() => router.push(`/toppings/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm mới
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} onDelete={onDelete} loading={loading}/>
      <Heading title="API" description="API của Toppings" />
      <Separator />
      <ApiList entityName="toppings" entityIdName="toppingId" />
    </>
  );
};
