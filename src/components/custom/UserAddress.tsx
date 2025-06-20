"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { client } from "@/sanity/lib/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import useSWR from "swr";

interface Address {
  _id: string;
  _type: "address";
  addressType: "shipping" | "billing" | "both";
  user: {
    _type: "reference";
    _ref: string;
  };
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface GuestAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface GuestAddresses {
  shipping?: GuestAddress;
  billing?: GuestAddress;
}

const addressFormSchema = z.object({
  addressType: z.enum(["shipping", "billing", "both"]),
  fullName: z.string().min(5, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  addressLine1: z.string().min(5, "Address must be at least 5 characters"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().optional(),
  country: z.string().min(2, "Country must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  isDefault: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

interface UserAddressProps {
  onSubmit?: (addresses: {
    shipping: GuestAddress;
    billing: GuestAddress;
  }) => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const UserAddress = ({ onSubmit }: UserAddressProps) => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [guestAddresses, setGuestAddresses] = useState<GuestAddresses>({});
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [selectedShippingId, setSelectedShippingId] = useState<
    string | undefined
  >();
  const [selectedBillingId, setSelectedBillingId] = useState<
    string | undefined
  >();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  const getDefaultAddress = (type: "shipping" | "billing") => {
    return addresses.find(
      (address) =>
        address.isDefault &&
        (address.addressType === type || address.addressType === "both"),
    );
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      setLoading(true);

      try {
        const response = await fetch("/api/addresses");
        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }
        const data = await response.json();
        setAddresses(data.addresses);

        setAddresses(data.addresses);

        // Set initial selected addressesAdd commentMore actions
        const defaultShipping = data.addresses.find(
          (addr: Address) =>
            addr.isDefault &&
            (addr.addressType === "shipping" || addr.addressType === "both"),
        );
        const defaultBilling = data.addresses.find(
          (addr: Address) =>
            addr.isDefault &&
            (addr.addressType === "billing" || addr.addressType === "both"),
        );

        setSelectedShippingId(defaultShipping?._id);
        setSelectedBillingId(defaultBilling?._id);

        // If we have a default shipping address, trigger the initial selection
        if (defaultShipping) {
          if (useSameAddress) {
            onSubmit?.({
              shipping: defaultShipping,
              billing: defaultShipping,
            });
          } else if (defaultBilling) {
            onSubmit?.({
              shipping: defaultShipping,
              billing: defaultBilling,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        toast.error("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user, useSameAddress]);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      addressType: "both",
      email: user?.emailAddresses[0]?.emailAddress || "",
      isDefault: false,
    },
  });

  const handleSubmit = async (data: AddressFormValues) => {
    if (user) {
      setIsAddingAddress(true);
      try {
        const response = await fetch("/api/addresses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to add address");
        }

        const result = await response.json();
        setAddresses((prev) => [...prev, result.address]);
        //await mutate(); // Revalidate the addresses data
        toast.success("Address added successfully");
        form.reset();
        setIsDialogOpen(false);

        // If in checkout flow, call onSubmit with the new address
        if (onSubmit) {
          if (data.addressType === "shipping") {
            onSubmit({
              shipping: result.address,
              billing: useSameAddress
                ? result.address
                : getDefaultAddress("billing") || result.address,
            });
          } else if (data.addressType === "billing") {
            onSubmit({
              shipping: getDefaultAddress("shipping") || result.address,
              billing: result.address,
            });
          } else {
            // Both shipping and billing
            onSubmit({
              shipping: result.address,
              billing: result.address,
            });
          }
        }
      } catch (error) {
        console.error("Error adding address:", error);
        toast.error("Failed to add address");
      } finally {
        setIsAddingAddress(false);
      }
    } else {
      // Handle guest address submission
      const { addressType, ...addressData } = data;
      const guestAddress: GuestAddress = addressData;

      if (addressType === "shipping") {
        const addresses = {
          shipping: guestAddress,
          billing: useSameAddress
            ? guestAddress
            : guestAddresses.billing || guestAddress,
        };
        setGuestAddresses(addresses);
        if (onSubmit) onSubmit(addresses);
      } else if (addressType === "billing" && !useSameAddress) {
        const addresses = {
          shipping: guestAddresses.shipping || guestAddress,
          billing: guestAddress,
        };
        setGuestAddresses(addresses);
        if (onSubmit) onSubmit(addresses);
      }

      toast.success("Address saved");
      form.reset();
    }
  };

  const handleGuestSubmit = (data: AddressFormValues) => {
    console.log("formData:", data);
    try {
      const { addressType, ...addressData } = data;
      const guestAddress: GuestAddress = addressData;

      let updatedAddresses = guestAddresses;

      if (addressType === "shipping") {
        updatedAddresses = {
          shipping: guestAddress,
          billing: useSameAddress
            ? guestAddress
            : guestAddresses.billing || guestAddress,
        };
      } else if (addressType === "billing") {
        updatedAddresses = {
          shipping: guestAddresses.shipping || guestAddress,
          billing: guestAddress,
        };
      } else {
        // Both shipping and billing
        updatedAddresses = {
          shipping: guestAddress,
          billing: guestAddress,
        };
      }

      // Update local state
      setGuestAddresses(updatedAddresses);

      //console.log("guest:", updatedAddresses);

      // Invoke onSubmit if defined
      if (onSubmit) {
        onSubmit(updatedAddresses);
      }

      toast.success("Address saved successfully!");
    } catch (error) {
      console.error("Error in handleGuestSubmit:", error);
      toast.error("Failed to save address.");
    }
  };

  const getSelectedAddress = (type: "shipping" | "billing") => {
    if (type === "shipping" || (type === "billing" && useSameAddress)) {
      return addresses.find(
        (address: Address) =>
          address.isDefault &&
          (address.addressType === type || address.addressType === "both"),
      );
    }
    return undefined;
  };

  const handleShippingSelect = (value: string) => {
    setSelectedShippingId(value);
    const selectedAddress = addresses.find(
      (addr: Address) => addr._id === value,
    );

    if (selectedAddress && onSubmit) {
      if (useSameAddress) {
        onSubmit({
          shipping: selectedAddress,
          billing: selectedAddress,
        });
      } else {
        const billingAddress = selectedBillingId
          ? addresses.find((addr: Address) => addr._id === selectedBillingId)
          : selectedAddress;
        onSubmit({
          shipping: selectedAddress,
          billing: billingAddress || selectedAddress,
        });
      }
    }
  };

  const handleBillingSelect = (value: string) => {
    setSelectedBillingId(value);
    const selectedAddress = addresses.find(
      (addr: Address) => addr._id === value,
    );

    if (selectedAddress && onSubmit) {
      const shippingAddress = selectedShippingId
        ? addresses.find((addr: Address) => addr._id === selectedShippingId)
        : selectedAddress;
      onSubmit({
        shipping: shippingAddress || selectedAddress,
        billing: selectedAddress,
      });
    }
  };

  const handleUseSameAddress = (checked: boolean) => {
    setUseSameAddress(checked);
    if (checked && selectedShippingId) {
      const shippingAddress = addresses.find(
        (addr: Address) => addr._id === selectedShippingId,
      );
      if (shippingAddress && onSubmit) {
        onSubmit({
          shipping: shippingAddress,
          billing: shippingAddress,
        });
      }
    }
  };

  if (!isUserLoaded) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {/* <h2 className="text-2xl font-bold">Delivery Information</h2> */}
        {user ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="dark:bg-primary-500 dark:hover:ring-2 dark:hover:ring-primary-500 dark:hover:shadow-lg dark:hover:shadow-primary-500/50 cursor-pointer"
              >
                Add New Address
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[95vh] overflow-y-auto py-8  ">
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>
                  Add a new shipping or billing address to your account.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="addressType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select address type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="shipping">Shipping</SelectItem>
                            <SelectItem value="billing">Billing</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fullName"
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

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2 (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Apt 4B" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Tema" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Region/State</FormLabel>
                          <FormControl>
                            <Input placeholder="Greater Accra" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Ghana" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+233 (555) 000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 cursor-pointer "
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Set as default address
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full bg-primary-500 dark:bg-primary-500  dark:hover:ring-2 dark:hover:ring-primary-500 dark:hover:shadow-lg dark:hover:shadow-primary-500/50 cursor-pointer"
                    disabled={isAddingAddress}
                  >
                    {isAddingAddress ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding Address...
                      </>
                    ) : (
                      "Add Address"
                    )}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        ) : (
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/sign-in")}
            className="w-full bg-primary-500 dark:bg-primary-500 dark:hover:ring-2 dark:hover:ring-primary-500 dark:hover:shadow-lg dark:hover:shadow-primary-500/50 cursor-pointer"
          >
            Sign in to save addresses
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address Selection */}
        <Card className="py-4">
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
            <CardDescription>
              {user
                ? "Select your shipping address"
                : "Enter your shipping address"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <RadioGroup
                value={selectedShippingId}
                onValueChange={handleShippingSelect}
              >
                {addresses
                  .filter(
                    (address: Address) =>
                      address.addressType === "shipping" ||
                      address.addressType === "both",
                  )
                  .map((address: Address) => (
                    <div
                      key={address._id}
                      className="flex items-center space-x-2 border p-4 rounded-lg mb-2"
                    >
                      <RadioGroupItem value={address._id} id={address._id} />
                      <Label htmlFor={address._id} className="flex-1">
                        <div>
                          <p className="font-medium">{address.fullName}</p>
                          <p className="text-sm text-gray-500">
                            {address.addressLine1}
                            {address.addressLine2 &&
                              `, ${address.addressLine2}`}
                          </p>
                          <p className="text-sm text-gray-500">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p className="text-sm text-gray-500">
                            {address.country}
                          </p>
                          <p className="text-sm text-gray-500">
                            {address.phone}
                          </p>
                        </div>
                      </Label>
                    </div>
                  ))}
              </RadioGroup>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleGuestSubmit)}
                  className="space-y-4"
                >
                  <input
                    type="hidden"
                    {...form.register("addressType")}
                    value="shipping"
                  />
                  <FormField
                    control={form.control}
                    name="fullName"
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
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2 (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Apt 4B" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New York" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="10001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Set as default address
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full bg-primary-500 dark:bg-primary-500 dark:hover:ring-2 dark:hover:ring-primary-500 dark:hover:shadow-lg dark:hover:shadow-primary-500/50 cursor-pointer"
                  >
                    Save Shipping Address
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* Billing Address Selection */}
        <Card className="py-4">
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
            <CardDescription>
              {user
                ? "Select your billing address"
                : "Enter your billing address"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="useSameAddress"
                  checked={useSameAddress}
                  onChange={(e) => handleUseSameAddress(e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="useSameAddress" className="font-normal">
                  Use same address as shipping
                </Label>
              </div>
            </div>

            {!useSameAddress &&
              (user ? (
                <RadioGroup
                  value={selectedBillingId}
                  onValueChange={handleBillingSelect}
                >
                  {addresses
                    .filter(
                      (address: Address) =>
                        address.addressType === "billing" ||
                        address.addressType === "both",
                    )
                    .map((address: Address) => (
                      <div
                        key={address._id}
                        className="flex items-center space-x-2 border p-4 rounded-lg mb-2"
                      >
                        <RadioGroupItem value={address._id} id={address._id} />
                        <Label htmlFor={address._id} className="flex-1">
                          <div>
                            <p className="font-medium">{address.fullName}</p>
                            <p className="text-sm text-gray-500">
                              {address.addressLine1}
                              {address.addressLine2 &&
                                `, ${address.addressLine2}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {address.city}, {address.state}{" "}
                              {address.postalCode}
                            </p>
                            <p className="text-sm text-gray-500">
                              {address.country}
                            </p>
                            <p className="text-sm text-gray-500">
                              {address.phone}
                            </p>
                          </div>
                        </Label>
                      </div>
                    ))}
                </RadioGroup>
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleGuestSubmit)}
                    className="space-y-4"
                  >
                    <input
                      type="hidden"
                      {...form.register("addressType")}
                      value="billing"
                    />
                    <FormField
                      control={form.control}
                      name="fullName"
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
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="addressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 1</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="addressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address Line 2 (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Apt 4B" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="United States" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <FormField
                      control={form.control}
                      name="isDefault"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="h-4 w-4"
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Set as default address
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full bg-primary-500 dark:bg-primary-500 dark:hover:ring-2 dark:hover:ring-primary-500 dark:hover:shadow-lg dark:hover:shadow-primary-500/50 cursor-pointer"
                    >
                      Save Billing Address
                    </Button>
                  </form>
                </Form>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAddress;
