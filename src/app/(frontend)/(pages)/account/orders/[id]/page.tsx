import React from "react";

import OrderDetails from "./OrderDetails";
import PageHeader from "@/components/modules/products/PageHeader";

const OrderDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <>
      <PageHeader
        heading="Order Details"
        link1="Account"
        link2="Order Details"
      />
      <OrderDetails id={id} />
    </>
  );
};

export default OrderDetailPage;
