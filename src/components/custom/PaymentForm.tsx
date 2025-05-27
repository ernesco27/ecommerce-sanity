"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard } from "lucide-react";
import { usePaystackPayment } from "@/lib/hooks/usePaystackPayment";
import { toast } from "sonner";

const paymentFormSchema = z.object({
  paymentMethod: z.enum(["card", "paypal"]),
  email: z.string().email("Please enter a valid email address"),
  cardholderName: z.string().min(2, "Cardholder name is required"),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  onSuccess: () => void;
  onClose: () => void;
  total: number;
}

export function PaymentForm({ onSuccess, onClose, total }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { initializePayment, isScriptLoaded } = usePaystackPayment();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "card",
      email: "",
      cardholderName: "",
    },
  });

  const handleSubmit = async (data: PaymentFormValues) => {
    if (!isScriptLoaded) {
      toast.error(
        "Payment system is initializing. Please try again in a moment.",
      );
      return;
    }

    console.log(
      "Attempting to use Paystack Key from env:",
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    );
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      toast.error("Paystack configuration error. Please contact support.");
      console.error(
        "Paystack public key is not defined in environment variables.",
      );
      return;
    }

    setIsProcessing(true);
    try {
      // Introduce a small delay to ensure Paystack's script is fully ready
      await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay

      const config = {
        email: data.email,
        amount: Math.round(total * 100), // Convert to smallest currency unit (kobo)
        publicKey: publicKey, // Use the validated public key
        firstname: data.cardholderName.split(" ")[0],
        lastname: data.cardholderName.split(" ").slice(1).join(" "),
        onSuccess: () => {
          setTimeout(() => {
            setIsProcessing(false);
            toast.success("Payment successful!");
            onSuccess();
          }, 100); // Delay to allow Paystack to complete its flow
        },
        onClose: () => {
          setTimeout(() => {
            setIsProcessing(false);
            toast.info("Payment window closed");
            onClose();
          }, 100); // Delay to allow Paystack to complete its flow
        },
      };

      initializePayment(config);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Payment initialization failed. Please try again.",
      );
      setIsProcessing(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4 "
                >
                  <div className="flex items-center  space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-gray-50 ">
                    <RadioGroupItem value="card" id="card" />
                    <Label
                      htmlFor="card"
                      className="flex items-center gap-2 cursor-pointer w-full"
                    >
                      <CreditCard className="h-4 w-4" />
                      Pay with Card / Bank Transfer / Mobile Money
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardholderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-lg"
          disabled={isProcessing || !isScriptLoaded}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : !isScriptLoaded ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading payment system...
            </>
          ) : (
            `Pay ${new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "GHS",
            }).format(total)}`
          )}
        </Button>
      </form>
    </Form>
  );
}
