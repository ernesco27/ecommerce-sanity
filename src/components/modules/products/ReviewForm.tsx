"use client";

import React, { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UploadIcon, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ProductRating from "@/components/ui/rating";
import Image from "next/image";

const formSchema = z.object({
  reviewTitle: z.string().min(10, {
    message: "Review title must be at least 10 characters.",
  }),
  rating: z.number().min(1, {
    message: "Rating must be at least 1.",
  }),
  reviewDetails: z.string().min(10, {
    message: "Review details must be at least 10 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

interface UploadedImage {
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
}

const ReviewForm = ({ productId }: { productId: string }) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    // Limit to 3 photos
    if (photos.length + newFiles.length > 3) {
      toast.error("Maximum 3 photos allowed");
      return;
    }

    // Validate file sizes
    for (const file of newFiles) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB`);
        return;
      }
    }

    setPhotos((prev) => [...prev, ...newFiles]);

    try {
      setUploading(true);
      const formData = new FormData();
      newFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload images");
      }

      const data = await response.json();
      setUploadedImages((prev) => [...prev, ...data.images]);
      toast.success("Images uploaded successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload images",
      );
      // Remove the files that failed to upload
      setPhotos((prev) => prev.filter((p) => !newFiles.includes(p)));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reviewTitle: "",
      rating: 1,
      reviewDetails: "",
    },
  });

  async function onSubmit(values: FormData) {
    if (!user) {
      toast.error("You must be signed in to leave a review");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          productId,
          userId: user.id,
          images: uploadedImages,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit review");
      }

      toast.success("Review submitted successfully!");
      form.reset();
      setPhotos([]);
      setUploadedImages([]);
      router.refresh();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit review",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full lg:w-[80%]"
      >
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating *</FormLabel>
              <FormControl>
                <ProductRating value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reviewTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Title *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex. Best product ever"
                  {...field}
                  className="focus-visible:border-ring focus-visible:ring-yellow-300 text-lg lg:text-xl h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reviewDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Details *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex. This product is amazing"
                  {...field}
                  className="outline-none focus-visible:border-ring focus-visible:ring-yellow-300 text-lg lg:text-xl min-h-[100px] max-h-[200px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Review Photos (Optional)</FormLabel>
          <div className="space-y-4">
            <div
              className="flex flex-col justify-center border rounded-md w-full h-[200px] text-lg text-gray-500 items-center gap-2 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Input
                type="file"
                accept="image/*"
                multiple
                hidden
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={uploading || photos.length >= 3}
              />
              <UploadIcon className="w-6 h-6" />
              <span>{uploading ? "Uploading..." : "Upload photos"}</span>
              <p className="text-xs text-black font-medium">
                Browse (Max 3 photos, 5MB each)
              </p>
            </div>

            {photos.length > 0 && (
              <div className="flex gap-4 flex-wrap">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="w-[100px] h-[100px] bg-gray-200 rounded-md overflow-hidden">
                      <Image
                        src={URL.createObjectURL(photo)}
                        alt={`Review photo ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={!isLoaded || !isSignedIn || uploading || submitting}
          className="bg-yellow-900 text-lg hover:bg-yellow-600 cursor-pointer"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Form>
  );
};

export default ReviewForm;
