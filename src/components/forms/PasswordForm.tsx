"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";

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
import { z, ZodType } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { ReloadIcon } from "@radix-ui/react-icons";

interface PasswordFormProps<T extends FieldValues, R = null> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse<R>>;
}

const PasswordForm = <T extends FieldValues, R = null>({
  schema,
  defaultValues,
  onSubmit,
}: PasswordFormProps<T, R>) => {
  // Define form.
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const [isPending, startTransition] = useTransition();

  // Define your submit handler.
  const handleSubmit: SubmitHandler<T> = async (data) => {
    console.log("data:", data);

    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords don't match.");
      return;
    }

    const result = (await onSubmit(data)) as ActionResponse<R>;

    if (result?.success) {
      toast.success("Password updated successfully!");
    } else {
      toast.error(
        result?.error?.message || "An error occurred. Please try again.",
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-10 space-y-6"
      >
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5 w-full">
                <FormLabel className="paragraph-medium text-dark400_light700">
                  {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    type={"password"}
                    {...field}
                    className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          disabled={isPending}
          className="primary-gradient w-full paragraph-medium rounded-2 px-4 py-3 font-inter min-h-12 !text-light-900 cursor-pointer"
        >
          {isPending ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>Update Changes</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PasswordForm;
