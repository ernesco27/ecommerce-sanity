import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { Order, OrderItem as OrderItemType } from "./types"; // Assuming types.ts is in the same directory or adjust path

// Register a basic font. You might need to host or ensure availability of more complex fonts.
// See @react-pdf/renderer docs for font registration.
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TYFv.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TYFv.ttf",
      fontWeight: "bold",
    }, // Example for bold, ensure correct font file if needed
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 30,
    lineHeight: 1.5,
  },

  card: {
    borderWidth: 1, // Set border thickness
    borderColor: "#cccccc", // Set border color
    marginBottom: 15, // Space below the card
    padding: 10, // Padding inside the card
    flexDirection: "row", // Align children in a row
    justifyContent: "space-between", // Space out children
    alignItems: "flex-start", // Align children to the top
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 3,
  },
  text: {
    marginBottom: 3,
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%", // Adjust based on content
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    backgroundColor: "#f2f2f2",
    padding: 5,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 10,
  },
  tableCol: {
    width: "25%", // Adjust based on content
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    padding: 5,
    textAlign: "left",
  },
  tableCell: {
    fontSize: 10,
  },
  footer: {
    position: "absolute",
    fontSize: 10,
    bottom: 15,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "grey",
  },
  totalSection: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
    flexDirection: "column",
    //justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 5,
    width: "50%",
    alignSelf: "flex-end",
  },
  totalText: {
    textAlign: "right",
    // fontSize: 12,
    fontWeight: "bold",
  },
  totalBreakdown: {
    textAlign: "right",
    //fontSize: 12,
  },

  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
    width: "100%",
  },
});

interface OrderInvoiceDocumentProps {
  order: Order;
  logoUrl?: string;
}

const OrderInvoiceDocument: React.FC<OrderInvoiceDocumentProps> = ({
  order,
  logoUrl,
}) => (
  <Document title={`Invoice ${order.orderNumber}`}>
    <Page size="A4" style={styles.page}>
      <View style={styles.headerContainer}>
        {logoUrl ? (
          <Image style={styles.logo} src={logoUrl} />
        ) : (
          <View style={styles.logo} />
        )}
        <Text style={styles.invoiceTitle}>Order Invoice</Text>
      </View>

      <View style={styles.card}>
        <View>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <Text style={styles.text}>
            Full Name: {order.user?.name || "N/A"}
          </Text>
          <Text style={styles.text}>
            Phone Number: {order.shippingAddress?.phone || "N/A"}
          </Text>
          <Text style={styles.text}>
            Email: {order.shippingAddress?.email || "N/A"}
          </Text>
        </View>
        <View>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <Text style={styles.text}>Order Number: {order.orderNumber}</Text>
          <Text style={styles.text}>
            Order Date:{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString()
              : "N/A"}
          </Text>
          <Text style={styles.text}>
            Payment Status:{" "}
            {order.paymentStatus
              ? order.paymentStatus.charAt(0).toUpperCase() +
                order.paymentStatus.slice(1)
              : "Not paid"}
          </Text>
          <Text style={styles.text}>
            Order Status:{" "}
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <Text style={styles.text}>
          {order.shippingAddress?.formatted || "N/A"}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, { width: "40%" }]}>
              Product
            </Text>
            <Text style={[styles.tableColHeader, { width: "30%" }]}>
              Variant
            </Text>
            <Text style={[styles.tableColHeader, { width: "15%" }]}>
              Quantity
            </Text>
            <Text style={[styles.tableColHeader, { width: "15%" }]}>
              Subtotal
            </Text>
          </View>
          {/* Table Body */}
          {order.items?.map((item: OrderItemType, index: number) => {
            let variantDetails = "N/A";
            if (item.variant) {
              const parts = [];
              if (item.variant.color)
                parts.push(`Color: ${item.variant.color}`);
              if (item.variant.size) parts.push(`Size: ${item.variant.size}`);
              if (item.variant.price !== undefined)
                parts.push(`Price: GHs${item.variant.price.toFixed(2)}`);
              variantDetails = parts.join(", ") || "N/A";
            }
            return (
              <View style={styles.tableRow} key={index}>
                <Text
                  style={[styles.tableCol, { width: "40%" }, styles.tableCell]}
                >
                  {item.product?.name || "Unknown Product"}
                </Text>
                <Text
                  style={[styles.tableCol, { width: "30%" }, styles.tableCell]}
                >
                  {variantDetails}
                </Text>
                <Text
                  style={[
                    styles.tableCol,
                    { width: "15%", textAlign: "center" },
                    styles.tableCell,
                  ]}
                >
                  {item.quantity || 0}
                </Text>
                <Text
                  style={[
                    styles.tableCol,
                    { width: "15%", textAlign: "right" },
                    styles.tableCell,
                  ]}
                >
                  GHs{(item.subtotal || 0).toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.section, styles.totalSection]}>
        <View style={styles.totalContainer}>
          <Text style={[styles.text, styles.totalBreakdown]}>Subtotal:</Text>
          <Text style={[styles.text, styles.totalBreakdown]}>
            GHs{order.subtotal.toFixed(2) || 0}
          </Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={[styles.text, styles.totalBreakdown]}>Discount:</Text>
          <Text style={[styles.text, styles.totalBreakdown]}>
            GHs{order.discount.toFixed(2) || 0}
          </Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={[styles.text, styles.totalBreakdown]}>Tax:</Text>
          <Text style={[styles.text, styles.totalBreakdown]}>
            GHs{order.tax.toFixed(2) || 0}
          </Text>
        </View>

        <View style={styles.totalContainer}>
          <Text style={[styles.text, styles.totalBreakdown]}>
            Shipping Cost:
          </Text>
          <Text style={[styles.text, styles.totalBreakdown]}>
            GHs{order.shippingCost.toFixed(2) || 0}
          </Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={[styles.text, styles.totalText]}>Total Amount:</Text>
          <Text style={[styles.text, styles.totalText]}>
            GHs{(order.total || 0).toFixed(2)}
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>Thank you for your order!</Text>
    </Page>
  </Document>
);

export default OrderInvoiceDocument;
