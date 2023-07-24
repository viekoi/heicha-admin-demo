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
import ImageUpload from "@/components/ui/image-upload";
import {Topping} from "@prisma/client";


const formSchema = z.object({
  name: z.string().min(1,{message:"Hãy nhập tên"}),
  price: z.coerce.number().min(1,{message:"Hãy nhập giá"}),
  imageUrl: z.string().min(1,{message:"Hãy thêm ảnh(một ảnh duy nhất)"}),
 
});

type ToppingFormValues = z.infer<typeof formSchema>;

interface ToppingFormProps {
  initialData:
    | (Topping)
    | null;
}

export const ToppingForm: React.FC<ToppingFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();



  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Chỉnh sửa topping" : "Tạo topping";
  const description = initialData ? "chỉnh sửa một topping." : "Thêm một topping mới";
  const toastMessage = initialData ? "topping cập nhật thành công." : "topping được tạo thành công .";
  const action = initialData ? "Lưu thay đổi" : "Tạo";

  const defaultValues = initialData
    ? {
        ...initialData,
        price: parseFloat(String(initialData?.price)),
      }
    : {
        name: "",
        imageUrl: "",
        price: 0,
      };

  const form = useForm<ToppingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ToppingFormValues) => {
    console.log(data)
    try {
      setLoading(true);
      if (initialData) {
        await fetch(`/api/toppings/${params.toppingId}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        }).then((response) => {
          if (response.ok) {
            router.refresh();
            toast.success(toastMessage);
          }
        });
      } else {
        
        await fetch(`/api/toppings`, {
          method: "POST",
          body: JSON.stringify(data),
        }).then((response) => {
          if (response.ok) {
            router.refresh();
            router.push(`/toppings`);
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
      await fetch(`/api/toppings/${params.toppingId}`, {
        method: "DELETE",
      });
      router.refresh();
      router.push(`/toppings`);
      toast.success('Product deleted.');
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
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ảnh sản phẩm</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên sản phẩm</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="vd: Chân Châu (Viết in toàn bộ chữ cái đầu tiên)"
                      {...field}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="vd: 5000"
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
