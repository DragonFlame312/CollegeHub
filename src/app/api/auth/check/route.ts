import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabase } from "@/lib/database-interface";

export async function GET(req: NextRequest) {
  try {
    // Get the session token from the cookie
    const cookieStore = cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { authenticated: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get the database instance
    const db = getDatabase();

    // Check if the user is authenticated
    const user = await db.getCurrentUser(sessionToken);

    if (!user) {
      return NextResponse.json(
        { authenticated: false, message: "Invalid or expired session" },
        { status: 401 }
      );
    }

    // Return the user data
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error("Authentication check error:", error);
    return NextResponse.json(
      { authenticated: false, message: "Authentication error" },
      { status: 500 }
    );
  }
}
