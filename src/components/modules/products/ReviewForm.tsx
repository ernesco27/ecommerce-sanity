"use client";

import React, { useActionState, useState } from "react";
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
//import { CldUploadWidget } from "next-cloudinary";
import { UploadIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ProductRating from "@/components/ui/rating";

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

const ReviewForm = ({ productId }: { productId: number }) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reviewTitle: "",
      rating: 1,
      reviewDetails: "",
    },
  });

  async function onSubmit(values: FormData) {
    // if (!user) {
    //   toast.error("You must be signed in to leave a review");
    //   return;
    // }
    // try {
    //   const reviewData = {
    //     ...values,
    //     reviewImages: photos.map((photo) => photo.secure_url),
    //     productId,
    //     userId: user.id,
    //   };
    //   console.log("Review Data:", reviewData);
    //   const result = await createReview(reviewData);
    //   if (result.success) {
    //     toast.success("Review submitted successfully!");
    //     form.reset();
    //     setPhotos([]);
    //     router.refresh();
    //   } else {
    //     toast.error("Failed to submit review. Please try again.");
    //   }
    // } catch (error) {
    //   console.error("Error submitting review:", error);
    //   toast.error("Failed to submit review. Please try again.");
    // }
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
                  className="border focus-visible:border-primary-300 text-lg lg:text-xl h-12"
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
                  className="outline-none focus-visible:border-primary-300 text-lg lg:text-xl min-h-[100px] max-h-[200px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <div className="space-y-2">
          <FormLabel>Review Photos (Optional)</FormLabel>
          <div className="space-y-4">
            <CldUploadWidget
              uploadPreset="fashionista"
              onSuccess={(result, { widget }) => {
                setPhotos((prev) => [...prev, result.info]);
              }}
              onQueuesEnd={(result, { widget }) => {
                widget.close({ quiet: true });
              }}
              options={{
                multiple: true,
                maxFiles: 3,
                singleUploadAutoClose: false,
              }}
            >
              {({ open }) => (
                <div className="space-y-4">
                  <div
                    className="flex flex-col justify-center border rounded-md w-full h-[200px] text-lg text-gray-500 items-center gap-2 cursor-pointer"
                    onClick={() => open()}
                  >
                    <UploadIcon className="w-6 h-6" />
                    <span>Upload photos</span>
                    <p className="text-xs text-black font-medium">
                      Browse (Max 3 photos)
                    </p>
                  </div>

                  {photos.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo.secure_url}
                            alt={`Preview ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            className="absolute w-4 h-4 flex items-center justify-center top-1 right-1 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhotos(photos.filter((_, i) => i !== index));
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CldUploadWidget>
          </div>
        </div> */}

        <Button
          type="submit"
          size="lg"
          disabled={!isLoaded || !isSignedIn}
          className="bg-primary-900 text-lg"
        >
          Submit Review
        </Button>
      </form>
    </Form>
  );
};

export default ReviewForm;
