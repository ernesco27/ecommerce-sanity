import React, { ReactElement } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Order } from "./types";
import OrderInvoiceDocument from "./OrderInvoiceDocument";
//import { Button } from "@sanity/ui"; // For a consistent button style
import { Button } from "@/components/ui/button";

interface OrderPdfActionsProps {
  order: Order;
  logoUrl?: string; // Add logoUrl prop
}

const OrderPdfActions: React.FC<OrderPdfActionsProps> = ({
  order,
  logoUrl,
}) => {
  return (
    <PDFDownloadLink
      document={<OrderInvoiceDocument order={order} logoUrl={logoUrl} />}
      fileName={`Invoice-${order.orderNumber || "order"}.pdf`}
      style={{ textDecoration: "none" }} // Remove default link styling
    >
      {({ loading, error, url, blob }) => (
        // <Button
        //   text={
        //     loading ? "Generating PDF..." : error ? "Error" : "Download Invoice"
        //   }
        //   mode="ghost"
        //   disabled={loading || !!error} // Disable if loading or error
        //   title={
        //     error
        //       ? "Failed to generate PDF. Please try again."
        //       : "Download Order Invoice"
        //   }
        // />
        <Button
          variant="outline"
          size="lg"
          disabled={loading || !!error}
          className=" !bg-primary-500 hover:!bg-primary-900 text-white cursor-pointer transition-all duration-300"
        >
          {loading ? "Generating PDF..." : error ? "Error" : "Download Invoice"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default OrderPdfActions;
