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

import { CategoryColumn, columns } from "./columns";
import { useAlertModal } from "@/hooks/useAlertModal";
import { error } from "console";

interface CategoriesClientProps {
  data: CategoryColumn[];
};

export const CategoriesClient: React.FC<CategoriesClientProps> = ({
  data
}) => {

  const router = useRouter();
  const alertModal = useAlertModal()

  const [loading,setLoading] = useState(false)
  const onDelete = async (ids:string[]) => {
    try {
      setLoading(true);
      await fetch(`/api/categories`, {
        method: "DELETE",
        body: JSON.stringify(ids),
      }).then((response) => {
        if (response.ok) {
          toast.success('Xóa thành công.');
          router.refresh();
          router.push(`/categories`);
        }else{
          toast.error('Không thể thực hiện vì có sản phẩm đang dùng một trong các mã phân loại này.');
        }
      })
      
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
        <Heading title={`Phân loại: ${data.length}`} description="Quản lí phân loại" />
        <Button onClick={() => router.push(`/categories/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm mới
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} onDelete={onDelete} loading={loading} />
      <Heading title="API" description="API của Categories" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};
