import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.redirect(new URL("/Medy-Gribkov-Resume.pdf", process.env.NEXT_PUBLIC_SITE_URL || "https://docchat-cagb.onrender.com"));
}
