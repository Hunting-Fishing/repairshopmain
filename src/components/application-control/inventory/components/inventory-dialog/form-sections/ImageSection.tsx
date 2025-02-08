import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { useFileUpload } from "../../../hooks/useFileUpload";
import type { InventoryItemFormData } from "../../../types/base";

interface ImageSectionProps {
  form: UseFormReturn<InventoryItemFormData>;
}

export function ImageSection({ form }: ImageSectionProps) {
  const { uploadFile, isUploading } = useFileUpload();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await uploadFile(file);
      if (imageUrl) {
        form.setValue('image_url', imageUrl);
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name="image_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Image</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              {field.value && (
                <img
                  src={field.value}
                  alt="Item preview"
                  className="h-32 w-32 object-cover rounded-md"
                />
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
