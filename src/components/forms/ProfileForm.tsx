"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { toast } from "sonner";

import { useRef, useTransition, useState, useEffect } from "react";
import Image from "next/image";
import { ReloadIcon } from "@radix-ui/react-icons";
import { User } from "../../../sanity.types";
import { UserSchema } from "@/lib/validations";
import { editUser } from "@/lib/actions/profile.action";
import { convertSanityRefToUrl } from "@/lib/utils";

interface Params {
  user: User;
}

// Custom Image Upload Component
const ImageUploadField = ({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to get the proper image URL
  const getImageUrl = (imageValue: string): string => {
    if (!imageValue) return "";

    // Check if it's already a URL (starts with http/https)
    if (imageValue.startsWith("http://") || imageValue.startsWith("https://")) {
      return imageValue;
    }

    // Check if it's a Sanity image reference (contains 'image-' and doesn't look like a URL)
    if (imageValue.includes("image-") && !imageValue.includes("://")) {
      // For Sanity image references, construct the URL using the proper format
      return convertSanityRefToUrl(imageValue);
    }

    // If it's neither, return empty string
    return "";
  };

  // Update preview URL when value changes
  useEffect(() => {
    const imageUrl = getImageUrl(value);
    setPreviewUrl(imageUrl);
  }, [value]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(`File ${file.name} is too large. Maximum size is 2MB`);
      return;
    }

    // Create preview URL for the uploaded file
    const previewUrl = URL.createObjectURL(file);
    setPreviewUrl(previewUrl);

    try {
      setUploading(true);
      const formData = new FormData();

      formData.append("files", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setUploadedImage(data.images[0]);

      // Convert the Sanity reference to URL immediately
      const imageRef = data.images[0].asset._ref;
      const imageUrl = convertSanityRefToUrl(imageRef);

      onChange(imageUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload images",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <div className="relative ">
        <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Edit Icon Overlay */}
        <button
          type="button"
          onClick={handleEditClick}
          className="absolute -bottom-1 left-28  w-10 h-10 bg-primary-900 hover:bg-primary-900/80 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

const ProfileFormSchema = UserSchema.extend({
  image: z.any().optional(),
});

const ProfileForm = ({ user }: Params) => {
  // Define form.
  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      image: user?.image || "",
      name: user?.name || "",
      email: user?.email || "",
      username: user?.username || "",
      phone: user?.phone || "",
    },
  });

  const [isPending, startTransition] = useTransition();

  // Helper function to convert Sanity reference to URL
  const convertImageToUrl = (imageValue: string): string => {
    if (!imageValue) return "";

    // If it's already a URL, return as-is
    if (imageValue.startsWith("http://") || imageValue.startsWith("https://")) {
      return imageValue;
    }

    // If it's a Sanity image reference, convert to URL
    if (imageValue.includes("image-") && !imageValue.includes("://")) {
      return convertSanityRefToUrl(imageValue);
    }

    return imageValue;
  };

  // Define your submit handler.
  const handleEditUser = async (data: z.infer<typeof ProfileFormSchema>) => {
    startTransition(async () => {
      // Convert image reference to URL before submitting
      const imageUrl = convertImageToUrl(data.image || "");

      const result = await editUser({
        userId: user._id,
        name: data.name,
        email: data.email,
        username: data.username,
        phone: data.phone || "",
        image: imageUrl,
      });

      if (result.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(
          result?.error?.message || "An error occurred. Please try again.",
        );
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleEditUser)}
        className="mt-10 space-y-6"
      >
        <FormField
          control={form.control}
          name="image"
          render={({ field: formField, fieldState }) => (
            <FormItem>
              <ImageUploadField
                value={formField.value || ""}
                onChange={formField.onChange}
                error={fieldState.error?.message}
              />

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Full Name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px]  border"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px]  border"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Email Address <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px]  border"
                  type="email"
                  disabled
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Phone Number <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px]  border"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={isPending}
          className="primary-gradient w-full paragraph-medium rounded-2 px-4 py-3 font-inter min-h-12 !text-light-900 cursor-pointer"
        >
          {isPending ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" />
              <span>Updating..</span>
            </>
          ) : (
            <>Update Changes</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
