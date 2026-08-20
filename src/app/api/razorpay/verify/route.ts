import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, contactId, resultType, amount, isDummy } = body;

    // Handle dummy mode for testing
    if (isDummy) {
      const dbData: any = {
        userId: session.user.id,
        amount: parseInt(amount) || 100
      };
      
      if (resultType === "PLATFORM_USER") {
        dbData.platformUserId = contactId;
      } else {
        dbData.contactId = contactId;
      }

      await prisma.unlockedContact.create({
        data: dbData
      });

      return NextResponse.json({ success: true, message: "Dummy payment verified" });
    }

    // Real signature verification
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex");

    console.log("Razorpay verify:", {
      text,
      received_signature: razorpay_signature,
      generated_signature: generated_signature,
      secret_length: process.env.RAZORPAY_KEY_SECRET?.length
    });

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature", received: razorpay_signature, expected: generated_signature }, { status: 400 });
    }

    // Create the UnlockedContact record
    const dbData: any = {
      userId: session.user.id,
      amount: parseInt(amount) || 0
    };
    
    if (resultType === "PLATFORM_USER") {
      dbData.platformUserId = contactId;
    } else {
      dbData.contactId = contactId;
    }

    await prisma.unlockedContact.create({
      data: dbData
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify payment" }, { status: 500 });
  }
}
