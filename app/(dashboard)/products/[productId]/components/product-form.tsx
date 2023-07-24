"use client";

import * as z from "zod";
import { useState } from "react";
import {
  Product,
  Size,
  Category,
  Image as PrismaImage,
  ProductTopping,
  ProductSize,
} from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { SelectToppingTable } from "@/components/tables/select-topping-data-table";
import { SelectSizeTable } from "@/components/tables/select-size-data-table";
import { SelectToppingColumns } from "@/components/columns/topping-columns";
import { SelectSizeColumns } from "@/components/columns/size-columns";
import { ToppingColumn } from "@/app/(dashboard)/toppings/components/columns";

const formSchema = z.object({
  name: z.string().min(1, { message: "Hãy nhập tên" }),
  description: z.string(),
  categoryId: z.string().min(1, { message: "Hãy chọn một phân loại" }),
  images: z
    .object({ url: z.string() })
    .array()
    .min(1, { message: "Hãy thêm ít nhất 1 ảnh" }),
  toppingIds: z.string().array(),
  sizes: z
    .object({
      sizeId: z.string(),
      price: z.coerce.number(),
    })
    .array(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData:
    | ((Product & { images: PrismaImage[] } & {
        toppings: ProductTopping[];
      }) & { sizes: ProductSize[] })
    | null;
  sizes: (Size & { products: ProductSize[] })[];
  toppings: ToppingColumn[];
  categories: Category[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  sizes,
  toppings,
  categories,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm";
  const description = initialData
    ? "chỉnh sửa một sản phẩm."
    : "Thêm một sản phẩm mới";
  const toastMessage = initialData
    ? "sản phẩm cập nhật thành công."
    : "sản phẩm được tạo thành công .";
  const action = initialData ? "Lưu thay đổi" : "Tạo";

  const defaultValues = initialData
    ? {
        ...initialData,
        toppingIds: initialData.toppings.map((topping) => {
          return topping.toppingId;
        }),
        sizes: initialData.sizes.map((size) => {
          return {
            sizeId: size.sizeId,
            price: parseFloat(String(size.price)),
          };
        }),
      }
    : {
        name: "",
        category: "",
        description:"",
        images: [],
        toppingIds: [],
        sizes: [],
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });



  const onSubmit = async (data: ProductFormValues) => {
    console.log(data)
    try {
      setLoading(true);
      if (initialData) {
        await fetch(`/api/products/${params.productId}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        }).then((response) => {
          if (response.ok) {
            router.refresh();
            toast.success(toastMessage);
          }
        });
      } else {
        await fetch(`/api/products`, {
          method: "POST",
          body: JSON.stringify(data),
        }).then((response) => {
          if (response.ok) {
            router.refresh();
            router.push(`/products`);
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
    if (initialData)
      try {
        setLoading(true);
        await fetch(`/api/products/${params.toppingId}`, {
          method: "DELETE",
        });
        router.refresh();
        router.push(`/products`);
        toast.success("Product deleted.");
      } catch (error: any) {
        toast.error("Đã có lỗi.");
      } finally {
        setLoading(false);
        setOpen(false);
      }
    else return;
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
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
                      placeholder="vd: Cà phê đen"
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã phân loại</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Lựa một mã phân loại"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả sản phẩm</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Mô tả..."
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
            name="sizes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chọn size và nhập giá</FormLabel>
                <SelectSizeTable
                  onValueChange={field.onChange}
                  data={sizes}
                  columns={SelectSizeColumns}
                  searchKey="name"
                  initialData={initialData?.sizes.map((size) => {
                    return {
                      sizeId: size.sizeId,
                      price: parseFloat(String(size.price)),
                    };
                  })}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="toppingIds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chọn Topping</FormLabel>
                <SelectToppingTable
                  onValueChange={field.onChange}
                  data={toppings}
                  columns={SelectToppingColumns}
                  searchKey="name"
                  initialData={initialData?.toppings.map((topping) => {
                    return {
                      id: topping.toppingId,
                    
                    };
                  })}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
