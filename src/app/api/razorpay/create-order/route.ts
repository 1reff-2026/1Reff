import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { contactId, resultType } = body;

    if (!contactId || !resultType) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    let amount = 0;
    if (resultType === "ADMIN_DATABASE") amount = 100;
    else if (resultType === "PLATFORM_USER") amount = 100;
    else if (resultType === "USER_REFERRAL") amount = 150;
    else {
      return NextResponse.json({ error: "Invalid result type" }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      // If no keys, return a dummy order for testing mode
      return NextResponse.json({
        id: "order_dummy_" + Date.now(),
        amount: amount * 100,
        currency: "INR",
        notes: { contactId, resultType, userId: session.user.id },
        dummy: true
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        contactId,
        resultType,
        userId: session.user.id,
      },
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);

  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 });
  }
}
