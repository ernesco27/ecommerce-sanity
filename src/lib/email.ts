import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    variant: {
      color: string;
      size: string;
      price: number;
    };
  }>;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  shippingMethod: {
    name: string;
    price: number;
    estimatedDays: string;
  };
  subtotal: number;
  total: number;
}

export async function sendOrderConfirmationEmail(
  to: string,
  data: OrderEmailData,
) {
  try {
    const {
      orderNumber,
      customerName,
      items,
      shippingAddress,
      shippingMethod,
      subtotal,
      total,
    } = data;

    const itemsList = items
      .map(
        (item) => `
          <tr>
            <td style="padding: 10px 0;">${item.name}</td>
            <td style="padding: 10px 0;">${item.variant.color} / ${item.variant.size}</td>
            <td style="padding: 10px 0;">$${item.variant.price.toFixed(2)}</td>
            <td style="padding: 10px 0;">${item.quantity}</td>
            <td style="padding: 10px 0;">$${(item.variant.price * item.quantity).toFixed(2)}</td>
          </tr>
        `,
      )
      .join("");

    const response = await resend.emails.send({
      from: "Your Store <orders@yourdomain.com>",
      to,
      subject: `Order Confirmation - #${orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Order Confirmation</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .order-details { margin-bottom: 30px; }
              .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .items-table th { text-align: left; padding: 10px 0; border-bottom: 2px solid #eee; }
              .summary { background: #f9f9f9; padding: 20px; margin-bottom: 20px; }
              .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank you for your order!</h1>
                <p>Hi ${customerName},</p>
                <p>We've received your order and it's being processed.</p>
              </div>

              <div class="order-details">
                <h2>Order #${orderNumber}</h2>
                
                <table class="items-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Variant</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsList}
                  </tbody>
                </table>

                <div class="summary">
                  <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
                  <p><strong>Shipping:</strong> $${shippingMethod.price.toFixed(2)}</p>
                  <p><strong>Total:</strong> $${total.toFixed(2)}</p>
                </div>

                <div class="shipping-info">
                  <h3>Shipping Information</h3>
                  <p>${shippingAddress.fullName}</p>
                  <p>${shippingAddress.addressLine1}</p>
                  ${shippingAddress.addressLine2 ? `<p>${shippingAddress.addressLine2}</p>` : ""}
                  <p>${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}</p>
                  <p>${shippingAddress.country}</p>
                  <p>Phone: ${shippingAddress.phone}</p>
                </div>

                <div class="shipping-method">
                  <h3>Shipping Method</h3>
                  <p>${shippingMethod.name}</p>
                  <p>Estimated delivery: ${shippingMethod.estimatedDays}</p>
                </div>
              </div>

              <div class="footer">
                <p>If you have any questions, please contact our customer service.</p>
                <p>Thank you for shopping with us!</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return response;
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
}
