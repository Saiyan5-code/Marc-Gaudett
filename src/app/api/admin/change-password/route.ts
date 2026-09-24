import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  // Only allow authenticated admins
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await request.json();

  // Validate inputs
  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Current password and new password are required." },
      { status: 400 }
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "New password must be at least 6 characters." },
      { status: 400 }
    );
  }

  // Verify current password against the env var
  if (currentPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 403 }
    );
  }

  // Update the .env file on disk (works for local/self-hosted deployments)
  try {
    const envPath = path.resolve(process.cwd(), ".env");

    if (!fs.existsSync(envPath)) {
      return NextResponse.json(
        { error: "Could not locate .env file. Password change is not supported in this environment." },
        { status: 500 }
      );
    }

    let envContent = fs.readFileSync(envPath, "utf-8");

    // Replace the ADMIN_PASSWORD line
    if (envContent.includes("ADMIN_PASSWORD=")) {
      envContent = envContent.replace(
        /^ADMIN_PASSWORD=.*$/m,
        `ADMIN_PASSWORD="${newPassword}"`
      );
    } else {
      // Append if not present
      envContent += `\nADMIN_PASSWORD="${newPassword}"\n`;
    }

    fs.writeFileSync(envPath, envContent, "utf-8");

    // Also update the in-memory env var so the new password works immediately
    process.env.ADMIN_PASSWORD = newPassword;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update .env:", err);
    return NextResponse.json(
      { error: "Failed to save new password. Check server permissions." },
      { status: 500 }
    );
  }
}
