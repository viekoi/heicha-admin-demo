"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { SizeColumn, columns } from "./columns";
import { useAlertModal } from "@/hooks/useAlertModal";

interface SizesClientProps {
  data: SizeColumn[];
};

export const SizesClient: React.FC<SizesClientProps> = ({
  data
}) => {

  const router = useRouter();
  const alertModal = useAlertModal()

  const [loading,setLoading] = useState(false)

  const onDelete = async (ids:string[]) => {
    try {
      setLoading(true);
      await fetch(`/api/sizes`, {
        method: "DELETE",
        body: JSON.stringify(ids),
      });
      router.refresh();
      router.push(`/sizes`);
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
        <Heading title={`Size: ${data.length}`} description="Quản lí size" />
        <Button onClick={() => router.push(`/sizes/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm mới
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} onDelete={onDelete} loading={loading} />
      <Heading title="API" description="API của Sizes" />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
};
