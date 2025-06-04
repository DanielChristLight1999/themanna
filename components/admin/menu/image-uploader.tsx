"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Trash, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { useFormContext } from "react-hook-form";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface ImageUploaderProps {
  name: string;
}

export function ImageUploader({ name }: ImageUploaderProps) {
  const { control, setValue, watch } = useFormContext();
  const images = watch(name) || [];

  // const onDrop = useCallback(
  //   (acceptedFiles: File[]) => {
  //     const previews = acceptedFiles.map((file) =>
  //       Object.assign(file, {
  //         preview: URL.createObjectURL(file),
  //       })
  //     );
  //     setValue(name, [...images, ...previews], { shouldValidate: true });
  //   },
  //   [images, name, setValue]
  // );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const compressedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          try {
            const compressed = await imageCompression(file, {
              maxSizeMB: 2, // Max size per image in MB
              maxWidthOrHeight: 1200, // Resize if necessary
              useWebWorker: true,
            });

            return Object.assign(compressed, {
              preview: URL.createObjectURL(compressed),
            });
          } catch (error) {
            console.error("Compression error:", error);
            return file;
          }
        })
      );

      setValue(name, [...images, ...compressedFiles], { shouldValidate: true });
    },
    [images, setValue, name]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: true,
  });

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setValue(name, updated, { shouldValidate: true });
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>Product Images</FormLabel>
          <div
            {...getRootProps()}
            className="border border-dashed rounded-xl p-6 text-center cursor-pointer bg-muted/40"
          >
            <Input {...getInputProps()} />
            <UploadCloud size={24} className="mx-auto mb-2 text-muted-foreground" />
          </div>
          <FormDescription>
            Drag & drop or click to upload images (multiple allowed)
          </FormDescription>
          {images?.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {images.map((file: File & { preview?: string } | string, index: number) => {
                const isFile = typeof file !== "string" && file instanceof File;
                const src =
                  typeof file === "string"
                    ? file
                    : file.preview || URL.createObjectURL(file);

                return (
                  <div
                    key={index}
                    className="relative group rounded overflow-hidden"
                  >
                    <Image
                      src={src}
                      alt={`Preview ${index}`}
                      width={300}
                      height={300}
                      className="object-cover h-32 w-full rounded"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 opacity-80"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
