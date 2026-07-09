import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// GET handler to retrieve waitlist submissions (secured by a query parameter secret)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    
    // Check .env.local for ADMIN_SECRET or fallback to default
    const adminSecret = process.env.ADMIN_SECRET || "streak_secret_admin_key";

    if (!secret || secret !== adminSecret) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const filePath = path.join(process.cwd(), "waitlist_submissions.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }

    const fileData = fs.readFileSync(filePath, "utf8");
    const submissions = JSON.parse(fileData || "[]");
    
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error retrieving waitlist:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST handler to add user to waitlist
export async function POST(req: NextRequest) {
  try {
    const { email, phone } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "waitlist_submissions.json");

    let submissions = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileData = fs.readFileSync(filePath, "utf8");
        submissions = JSON.parse(fileData || "[]");
      } catch (err) {
        console.error("Error reading waitlist file, initializing empty:", err);
      }
    }

    // Check if already exists
    const existingIndex = submissions.findIndex((s: any) => s.email.toLowerCase() === email.toLowerCase());
    if (existingIndex !== -1) {
      return NextResponse.json({ 
        success: true, 
        message: "You are already in the mycelium network!",
        key: submissions[existingIndex].key,
        alreadyExists: true 
      });
    }

    // Generate a premium referral/access key code server-side
    const segment1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const segment2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedKey = `STRK-${segment1}-${segment2}`;

    const newSubmission = {
      email: email.toLowerCase(),
      phone: phone || null,
      key: generatedKey,
      timestamp: new Date().toISOString(),
    };

    submissions.push(newSubmission);
    try {
      fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), "utf8");
    } catch (err) {
      console.warn("Unable to write waitlist locally (read-only file system in production):", err);
    }

    // Return success along with the Formspree URL so the client browser can make the request directly.
    // This ensures Formspree sees the actual user's browser IP/fingerprint and avoids rate-limit blocks.
    const formspreeVar = process.env.FORMSPREE_ID?.trim() || null;

    return NextResponse.json({ 
      success: true, 
      message: "Successfully joined the waitlist!", 
      key: generatedKey,
      formspreeUrl: formspreeVar
    });
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
