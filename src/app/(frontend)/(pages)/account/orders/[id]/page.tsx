import React from "react";

import OrderDetails from "./OrderDetails";

const OrderDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <OrderDetails id={id} />;
};

export default OrderDetailPage;
