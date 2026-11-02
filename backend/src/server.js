
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { Resend } = require("resend");
const pool = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Escape customer/product information before inserting it into HTML.
const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

// Build the VistaCart confirmation email.
const buildOrderEmail = (order, customerName, items) => {
  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #eee;">
            ${escapeHtml(item.productName)}
          </td>
          <td style="padding:12px;text-align:center;border-bottom:1px solid #eee;">
            ${item.quantity}
          </td>
          <td style="padding:12px;text-align:right;border-bottom:1px solid #eee;">
            Rs. ${Number(item.lineTotal).toLocaleString("en-PK", {
              minimumFractionDigits: 2,
            })}
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:30px 12px;background:#f5f5f5;font-family:Arial,sans-serif;color:#222;">
        <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;">
          <div style="background:#171717;padding:30px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:30px;letter-spacing:2px;">
              VistaCart
            </h1>
            <p style="margin:10px 0 0;color:#d4d4d4;">
              Your order is confirmed
            </p>
          </div>

          <div style="padding:30px;">
            <h2 style="margin-top:0;">Thank you, ${escapeHtml(customerName)}!</h2>
            <p style="color:#555;line-height:1.6;">
              We've received your order and are getting it ready.
              Your payment method is Cash on Delivery.
            </p>

            <div style="background:#f7f7f7;padding:18px;border-radius:10px;margin:22px 0;">
              <p style="margin:0 0 8px;color:#777;font-size:13px;">ORDER NUMBER</p>
              <h2 style="margin:0;">${escapeHtml(order.orderNumber)}</h2>
            </div>

            <h3>Order summary</h3>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <thead>
                <tr style="background:#f7f7f7;">
                  <th style="padding:12px;text-align:left;">Product</th>
                  <th style="padding:12px;text-align:center;">Qty</th>
                  <th style="padding:12px;text-align:right;">Amount</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>

            <div style="margin-top:20px;padding-top:15px;border-top:1px solid #eee;">
              <p style="display:flex;justify-content:space-between;">
                <span>Subtotal</span>
                <strong>Rs. ${Number(order.subtotal).toLocaleString("en-PK", {
                  minimumFractionDigits: 2,
                })}</strong>
              </p>
              <p style="display:flex;justify-content:space-between;">
                <span>Shipping</span>
                <strong>Free</strong>
              </p>
              <p style="font-size:19px;display:flex;justify-content:space-between;">
                <strong>Total</strong>
                <strong>Rs. ${Number(order.total).toLocaleString("en-PK", {
                  minimumFractionDigits: 2,
                })}</strong>
              </p>
            </div>

            <div style="margin-top:25px;padding:16px;background:#f7f7f7;border-radius:10px;">
              <strong>Delivery address</strong>
              <p style="margin-bottom:0;color:#555;line-height:1.6;">
                ${escapeHtml(order.shippingAddress)}<br />
                ${escapeHtml(order.shippingCity)}
              </p>
            </div>

            <p style="margin-top:28px;color:#777;font-size:13px;line-height:1.6;">
              Thank you for shopping with VistaCart. We'll keep you updated
              about your order.
            </p>
          </div>

          <div style="padding:18px;text-align:center;background:#f7f7f7;color:#888;font-size:12px;">
            © ${new Date().getFullYear()} VistaCart. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;
};

// Security headers
app.use(helmet());

// Allow the ShopSphere frontend
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

// API rate limiting
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  })
);

// Welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to ShopSphere API",
  });
});

// Database health check
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS database_time");

    res.json({
      success: true,
      message: "ShopSphere API and database are working!",
      databaseTime: result.rows[0].database_time,
    });
  } catch (error) {
    console.error("Database health error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed.",
    });
  }
});

// Get all active products
app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        slug,
        description,
        category,
        image_url,
        price,
        stock,
        is_active,
        created_at
      FROM products
      WHERE is_active = TRUE
      ORDER BY created_at DESC, id DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      products: result.rows,
    });
  } catch (error) {
    console.error("Products fetch error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve products.",
    });
  }
});

// Get one active product by ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const result = await pool.query(
      `SELECT
        id,
        name,
        slug,
        description,
        category,
        image_url,
        price,
        stock,
        is_active,
        created_at
      FROM products
      WHERE id = $1 AND is_active = TRUE`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Single product fetch error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve this product.",
    });
  }
});

// Create an order and send its confirmation email
app.post("/api/orders", async (req, res) => {
  const {
    shippingName,
    shippingPhone,
    shippingAddress,
    shippingCity,
    customerEmail,
    paymentMethod,
    items,
  } = req.body;

  if (
    typeof shippingName !== "string" ||
    !shippingName.trim() ||
    shippingName.trim().length > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid customer name.",
    });
  }

  if (
    typeof shippingPhone !== "string" ||
    !shippingPhone.trim() ||
    shippingPhone.trim().length > 30
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid phone number.",
    });
  }

  if (
    typeof customerEmail !== "string" ||
    customerEmail.trim().length > 255 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address.",
    });
  }

  if (
    typeof shippingAddress !== "string" ||
    !shippingAddress.trim() ||
    shippingAddress.trim().length > 2000
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid delivery address.",
    });
  }

  if (
    typeof shippingCity !== "string" ||
    !shippingCity.trim() ||
    shippingCity.trim().length > 100
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid city.",
    });
  }

  if (paymentMethod !== "cod") {
    return res.status(400).json({
      success: false,
      message: "Currently, only Cash on Delivery is available.",
    });
  }

  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return res.status(400).json({
      success: false,
      message: "Your cart is empty or contains too many items.",
    });
  }

  const itemMap = new Map();

  for (const item of items) {
    const productId = String(item?.id ?? "");
    const quantity = Number(item?.quantity);

    if (
      !/^\d+$/.test(productId) ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1 ||
      quantity > 999
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more cart items are invalid.",
      });
    }

    const combinedQuantity = (itemMap.get(productId) || 0) + quantity;

    if (combinedQuantity > 999) {
      return res.status(400).json({
        success: false,
        message: "The requested quantity is too large.",
      });
    }

    itemMap.set(productId, combinedQuantity);
  }

  let client;

  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const verifiedItems = [];
    let subtotalCents = 0;

    for (const [productId, quantity] of itemMap.entries()) {
      const productResult = await client.query(
        `SELECT id, name, price, stock
         FROM products
         WHERE id = $1 AND is_active = TRUE
         FOR UPDATE`,
        [productId]
      );

      if (productResult.rows.length === 0) {
        throw new Error("A product in your cart is no longer available.");
      }

      const product = productResult.rows[0];
      const availableStock = Number(product.stock);

      if (availableStock < quantity) {
        throw new Error(
          `Insufficient stock for "${product.name}". Available quantity: ${availableStock}.`
        );
      }

      const unitPriceCents = Math.round(Number(product.price) * 100);
      const lineTotalCents = unitPriceCents * quantity;

      if (!Number.isSafeInteger(lineTotalCents)) {
        throw new Error("The order total is too large.");
      }

      subtotalCents += lineTotalCents;

      if (!Number.isSafeInteger(subtotalCents)) {
        throw new Error("The order total is too large.");
      }

      verifiedItems.push({
        productId: product.id,
        productName: product.name,
        unitPrice: (unitPriceCents / 100).toFixed(2),
        quantity,
        lineTotal: (lineTotalCents / 100).toFixed(2),
      });
    }

    const shippingFeeCents = 0;
    const totalCents = subtotalCents + shippingFeeCents;

    const subtotal = (subtotalCents / 100).toFixed(2);
    const shippingFee = (shippingFeeCents / 100).toFixed(2);
    const total = (totalCents / 100).toFixed(2);

    const orderResult = await client.query(
      `INSERT INTO orders (
        user_id,
        customer_email,
        email_status,
        subtotal,
        shipping_fee,
        total,
        payment_method,
        payment_status,
        order_status,
        shipping_name,
        shipping_phone,
        shipping_address,
        shipping_city
      )
      VALUES (NULL, $1, 'not_sent', $2, $3, $4, 'cod', 'pending', 'pending', $5, $6, $7, $8)
      RETURNING id, customer_email, subtotal, shipping_fee, total,
                payment_method, payment_status, order_status, created_at`,
      [
        customerEmail.trim().toLowerCase(),
        subtotal,
        shippingFee,
        total,
        shippingName.trim(),
        shippingPhone.trim(),
        shippingAddress.trim(),
        shippingCity.trim(),
      ]
    );

    const order = orderResult.rows[0];

    for (const item of verifiedItems) {
      await client.query(
        `INSERT INTO order_items (
          order_id,
          product_id,
          product_name,
          unit_price,
          quantity,
          line_total
        )
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          order.id,
          item.productId,
          item.productName,
          item.unitPrice,
          item.quantity,
          item.lineTotal,
        ]
      );

      const stockResult = await client.query(
        `UPDATE products
         SET stock = stock - $1
         WHERE id = $2 AND stock >= $1
         RETURNING id`,
        [item.quantity, item.productId]
      );

      if (stockResult.rows.length === 0) {
        throw new Error(
          `Stock changed while placing your order for "${item.productName}". Please try again.`
        );
      }
    }

    await client.query("COMMIT");

    // The order is now safely saved. Email problems must not undo it.
    client.release();
    client = null;

    const orderNumber = `SS-${String(order.id).padStart(6, "0")}`;
    let emailStatus = "failed";

    if (!resend) {
      console.error("Order email not sent: RESEND_API_KEY is not configured.");
    } else {
      try {
        const { data, error } = await resend.emails.send({
          from: process.env.EMAIL_FROM || "onboarding@resend.dev",
          to: [order.customer_email],
          subject: `Your VistaCart order ${orderNumber} is confirmed`,
          html: buildOrderEmail(
            {
              ...order,
              orderNumber,
              shippingAddress: shippingAddress.trim(),
              shippingCity: shippingCity.trim(),
            },
            shippingName.trim(),
            verifiedItems
          ),
        });

        if (error) {
          throw new Error(error.message);
        }

        emailStatus = "sent";
        console.log(`Confirmation email sent for ${orderNumber}.`, data?.id || "");
      } catch (emailError) {
        emailStatus = "failed";
        console.error(
          `Confirmation email failed for ${orderNumber}:`,
          emailError.message
        );
      }
    }

    await pool.query(
      "UPDATE orders SET email_status = $1 WHERE id = $2",
      [emailStatus, order.id]
    );

    return res.status(201).json({
      success: true,
      message: "Your order has been placed successfully!",
      emailStatus,
      order: {
        id: order.id,
        orderNumber,
        customerEmail: order.customer_email,
        subtotal: order.subtotal,
        shippingFee: order.shipping_fee,
        total: order.total,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
        createdAt: order.created_at,
        items: verifiedItems,
      },
    });
  } catch (error) {
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Order rollback error:", rollbackError.message);
      }
    }

    console.error("Order creation error:", error.message);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to place your order.",
    });
  } finally {
    if (client) {
      client.release();
    }
  }
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// General error handler
app.use((error, req, res, next) => {
  console.error("Server error:", error.message);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

app.listen(PORT, () => {
  console.log(`ShopSphere API running at http://localhost:${PORT}`);
});
