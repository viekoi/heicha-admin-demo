"use client";

import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { Category } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(1,{message:"Hãy nhập tên"}),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  initialData:Category | null;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();



  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Chỉnh sửa phân loại" : "Tạo phân loại";
  const description = initialData ? "chỉnh sửa một phân loại." : "Thêm một phân loại mới";
  const toastMessage = initialData ? "phân loại cập nhật thành công." : "phân loại được tạo thành công .";
  const action = initialData ? "Lưu thay đổi" : "Tạo";

  const defaultValues = initialData
    ? {
        ...initialData,
      }
    : {
        name: "",
      };

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await fetch(`/api/categories/${params.categoryId}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        }).then((response) => {
          if (response.ok) {
            router.refresh();
            toast.success(toastMessage);
          }
        });;
      } else {
        await fetch(`/api/categories`, {
          method: "POST",
          body: JSON.stringify(data),
        }).then((response) => {
          if (response.ok) {
            router.refresh();
            router.push(`/categories`);
            toast.success(toastMessage);
          }
        });
      }
    } catch (error: any) {
      toast.error("Đã có lỗi.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if(initialData)
    try {
      setLoading(true);
      await fetch(`/api/categories/${params.categoryId}`, {
        method: "DELETE",
      }).then((response) => {
        if (response.ok) {
          toast.success('Xóa thành công.');
          router.refresh();
          router.push(`/categories`);
        }else{
          toast.error('Không thể thực hiện vì có sản phẩm đang dùng mã phân loại này.');
        }
      });
    } catch (error: any) {
      toast.error('Đã có lỗi.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
    else return
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên phân loại</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="vd: Cà phê(viết in chữ cái đầu tiên)"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
