"use client";

import Container from "@/components/custom/Container";
import PageHeader from "@/components/modules/products/PageHeader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import NumberInput from "@/components/custom/NumberInput";

const page = () => {
  const [quantity, setQuantity] = useState<number>(1);
  return (
    <div>
      <PageHeader heading="Shopping Cart" link1="cart" />
      <Container>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Table className="">
              <TableHeader className="bg-yellow-500">
                <TableRow>
                  <TableHead className="w-[20px]  text-black text-lg lg:text-xl"></TableHead>
                  <TableHead className=" text-black text-lg lg:text-xl">
                    Product
                  </TableHead>
                  <TableHead className="text-black text-lg lg:text-xl">
                    Price
                  </TableHead>
                  <TableHead className="text-black text-lg lg:text-xl">
                    Quantity
                  </TableHead>
                  <TableHead className="text-black text-lg lg:text-xl">
                    Subtotal
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {tableData.map((row, index) => (
                    <TableRow key={row.feature}>
                      <TableCell className="font-medium text-lg lg:text-xl">
                        {row.feature}
                      </TableCell>
                      <TableCell className="text-lg lg:text-xl capitalize">
                        {row.description}
                      </TableCell>
                    </TableRow>
                  ))} */}
                <TableRow>
                  {/* Action */}
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Trash2 />
                    </Button>
                  </TableCell>
                  {/* Product */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-[100px] h-[100px] rounded-md bg-red-400">
                        image
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-lg font-bold">Product Name</p>
                        <div className="flex gap-2 h-5 items-center text-[16px] text-gray-500">
                          <span>Color: Brown</span>
                          <Separator orientation="vertical" />

                          <span>Size: XXL</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  {/* Price */}
                  <TableCell>
                    <p className="text-lg ">GHC 100.00</p>
                  </TableCell>
                  {/* Quantity */}
                  <TableCell>
                    <NumberInput
                      quantity={quantity}
                      setQuantity={setQuantity}
                      max={5}
                    />
                  </TableCell>
                  {/* Subtotal */}
                  <TableCell>
                    <p className="text-lg ">GHC 100.00</p>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="col-span-1 bg-blue-400">Order summary</div>
        </div>
      </Container>
    </div>
  );
};

export default page;
