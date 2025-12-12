import { NextRequest, NextResponse } from "next/server";
import { sendTalentRequestEmail } from "@/lib/email/send-email";


// Created on 12/12/25 by MS to use the request talent modal 
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, phone, notes } = body || {};

    // Validate required fields
    if (!name || !email || !notes) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Debug log
    console.log("Incoming Talent Request:", {
      name,
      email,
      phone,
      notes,
    });

    // Send email using existing SMTP helper
    await sendTalentRequestEmail({
      toEmail: "InterTalent@intersolutions.com",
      requesterName: name,
      requesterEmail: email,
      requesterPhone: phone || null,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: "Talent request submitted",
    });
  } catch (error) {
    console.error("Talent Request API Error:", error);

    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}
