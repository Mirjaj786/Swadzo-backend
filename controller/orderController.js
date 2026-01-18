import Order from "../models/orderModle.js";
import User from "../models/UserModle.js";
import Stripe from "stripe";

export const placeOrder = async (req, res) => {
  const frontendURL = process.env.FRONTEND_URL;
  const stripeSecret = process.env.STRIPE_SECRET;

  if (!stripeSecret || !frontendURL) {
    return res.status(500).json({
      success: false,
      message: "Missing STRIPE_SECRET or FRONTEND_URL in server environment",
    });
  }

  const stripe = new Stripe(stripeSecret);

  try {
    const userId = req.userId;
    const { items, amount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Delivery charge
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 30 * 100,
      },
      quantity: 1,
    });

    // Minify items for metadata to avoid 500 char limit
    const metaItems = items.map((item) => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      // Exclude description, image, etc.
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      locale: "auto",
      success_url: `${frontendURL}/verify?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendURL}/verify?success=false`,
      metadata: {
        userId: userId,
        address: JSON.stringify(address).substring(0, 499), // Truncate if necessary (risky but better than crash)
        items: JSON.stringify(metaItems).substring(0, 499), // Truncate if necessary
        amount: amount,
      },
    });

    res.status(201).json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.log("Stripe Order Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOrder = async (req, res) => {
  const { success, sessionId } = req.body;
  const stripe = new Stripe(process.env.STRIPE_SECRET);

  try {
    if (success === "true" && sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid") {
        if (
          !session.metadata ||
          !session.metadata.items ||
          !session.metadata.address
        ) {
          console.log("Metadata missing in session:", sessionId);
          return res.status(400).json({
            success: false,
            message: "Order details missing. Please contact support.",
          });
        }

        const userId = session.metadata.userId;
        let address, items;

        try {
          address = JSON.parse(session.metadata.address);
          items = JSON.parse(session.metadata.items);
        } catch (parseError) {
          console.log("JSON Parse Error:", parseError.message);
          return res.status(500).json({
            success: false,
            message: "Corrupt order data.",
          });
        }

        const amount = session.metadata.amount;

        const newOrder = new Order({
          userId,
          items,
          amount,
          address,
          payment: true,
        });

        await newOrder.save();
        await User.findByIdAndUpdate(userId, { cartData: {} });

        res
          .status(200)
          .json({ success: true, message: "Paid and Order Created" });
      } else {
        res
          .status(400)
          .json({ success: false, message: "Payment not verified" });
      }
    } else {
      res.status(200).json({ success: false, message: "Payment failed" });
    }
  } catch (err) {
    console.log("Verify Order Error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Order verification failed" });
  }
};

// User orders for frontend
export const UserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ userId });

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(`Error fetching user orders: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch orders" });
  }
};

// user orders for admin

export const OrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(`Error fetching all orders: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch all orders" });
  }
};

//  updating order status
export const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    await Order.findByIdAndUpdate(orderId, { status: status });
    return res
      .status(200)
      .json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.log(`Error updating order status: ${error.message}`);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update order status" });
  }
};
