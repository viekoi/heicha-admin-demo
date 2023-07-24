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

import { ProductColumn, columns } from "./columns";
import { useAlertModal } from "@/hooks/useAlertModal";

interface ProductsClientProps {
  data: ProductColumn[];
}

export const ProductsClient: React.FC<ProductsClientProps> = ({ data }) => {

  const router = useRouter();
  const alertModal = useAlertModal();

  const [loading, setLoading] = useState(false);

  const onDelete = async (ids: string[]) => {
    try {
      setLoading(true);
      await fetch(`/api/products`, {
        method: "DELETE",
        body: JSON.stringify(ids),
      });
      router.refresh();
      router.push(`/products`);
      toast.success("Xóa thành công.");
    } catch (error: any) {
      toast.error("Đã có lỗi.");
    } finally {
      setLoading(false);
      alertModal.onClose();
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sản phẩm: ${data.length}`}
          description="Quản lí sản phẩm"
        />
        <Button onClick={() => router.push(`/products/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Thêm mới
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="name"
        columns={columns}
        data={data}
        onDelete={onDelete}
        loading={loading}
      />
      <Heading title="API" description="API của Products" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};
