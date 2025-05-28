import React, { ReactElement } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Order } from "./types";
import OrderInvoiceDocument from "./OrderInvoiceDocument";
import { Button } from "@sanity/ui"; // For a consistent button style

interface OrderPdfActionsProps {
  order: Order;
}

const OrderPdfActions: React.FC<OrderPdfActionsProps> = ({ order }) => {
  return (
    <PDFDownloadLink
      document={<OrderInvoiceDocument order={order} />}
      fileName={`Invoice-${order.orderNumber || "order"}.pdf`}
      style={{ textDecoration: "none" }} // Remove default link styling
    >
      {({ loading, error, url, blob }) => (
        <Button
          text={
            loading ? "Generating PDF..." : error ? "Error" : "Download Invoice"
          }
          mode="ghost"
          disabled={loading || !!error} // Disable if loading or error
          title={
            error
              ? "Failed to generate PDF. Please try again."
              : "Download Order Invoice"
          }
        />
      )}
    </PDFDownloadLink>
  );
};

export default OrderPdfActions;
