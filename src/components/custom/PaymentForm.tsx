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

const paymentFormSchema = z.object({
  paymentMethod: z.enum(["card", "paypal"]),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid expiry date (MM/YY)"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  cardholderName: z.string().min(2, "Cardholder name is required"),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentFormProps {
  onSubmit: (data: PaymentFormValues) => Promise<void>;
  total: number;
}

export function PaymentForm({ onSubmit, total }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "card",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
    },
  });

  const handleSubmit = async (data: PaymentFormValues) => {
    setIsProcessing(true);
    try {
      await onSubmit(data);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.slice(0, 16);
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const formatCVV = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.slice(0, 4);
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
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="card" id="card" />
                    <Label
                      htmlFor="card"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="h-4 w-4" />
                      Credit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="paypal" id="paypal" disabled />
                    <Label
                      htmlFor="paypal"
                      className="flex items-center gap-2 cursor-not-allowed text-gray-400"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42c-.756 3.915-3.421 5.367-6.864 5.367h-1.76c-.524 0-.968.382-1.05.9l-1.158 7.323H4.782a.641.641 0 0 0-.633.74l.415 2.63a.641.641 0 0 0 .633.74h4.604c.524 0 .968-.382 1.05-.9l1.12-7.106h2.19c4.298 0 7.664-1.747 8.647-6.797.03-.15.054-.294.077-.437.292-1.867-.002-3.137-1.012-4.287-1.112-1.267-3.12-1.81-5.69-1.81H8.074L5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437z" />
                      </svg>
                      PayPal (Coming Soon)
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("paymentMethod") === "card" && (
          <>
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      {...field}
                      onChange={(e) => {
                        field.onChange(formatCardNumber(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MM/YY"
                        {...field}
                        onChange={(e) => {
                          field.onChange(formatExpiryDate(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="123"
                        {...field}
                        onChange={(e) => {
                          field.onChange(formatCVV(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cardholderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cardholder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" className="w-full" disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(total)}`
          )}
        </Button>
      </form>
    </Form>
  );
}
