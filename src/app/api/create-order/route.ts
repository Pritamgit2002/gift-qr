// Updated implementation for app/api/create-order/route.ts with detailed error logging
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = "INR", receipt, notes } = body;

    // Debug logs - be careful not to expose full credentials in production
    const keyIdPrefix = process.env.RAZORPAY_TEST_KEY_ID?.substring(0, 8);
    console.log("Key ID prefix:", keyIdPrefix);
    console.log(
      "Key ID format correct:",
      process.env.RAZORPAY_TEST_KEY_ID?.startsWith("rzp_test_")
    );

    // Create a test Razorpay instance
    try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_TEST_KEY_ID || "",
        key_secret: process.env.RAZORPAY_TEST_SECRET_KEY || "",
      });

      // Try a simple API call first to test authentication
      try {
        // Test with a very simple API call
        const testAuth = await razorpay.customers.all();
        console.log("Authentication test successful");
      } catch (authTestError: any) {
        console.error("Authentication test failed:", authTestError.message);
        return NextResponse.json(
          {
            success: false,
            message: "Razorpay authentication test failed",
            error: authTestError.message,
          },
          { status: 401 }
        );
      }

      // If we get here, authentication worked, now try creating an order
      const orderData = {
        amount: Math.round(amount * 100),
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        notes: notes || {},
      };

      console.log("Creating order with data:", orderData);

      const order = await razorpay.orders.create(orderData);
      console.log("Order created successfully:", order.id);

      return NextResponse.json({
        success: true,
        order,
      });
    } catch (razorpayError: any) {
      console.error("Error initializing Razorpay:", razorpayError);
      return NextResponse.json(
        {
          success: false,
          message: "Error initializing Razorpay",
          error: razorpayError.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("General error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error processing request",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
