import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

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

  // Get effective current password: DB takes priority over env var
  const dbSetting = await prisma.siteSettings.findUnique({
    where: { key: "ADMIN_PASSWORD" },
  });
  const effectivePassword = dbSetting?.value ?? process.env.ADMIN_PASSWORD;

  // Verify current password
  if (currentPassword !== effectivePassword) {
    return NextResponse.json(
      { error: "Current password is incorrect." },
      { status: 403 }
    );
  }

  // Save new password to the database
  await prisma.siteSettings.upsert({
    where: { key: "ADMIN_PASSWORD" },
    update: { value: newPassword },
    create: { key: "ADMIN_PASSWORD", value: newPassword },
  });

  // Also update in-memory so the current server session reflects the change immediately
  process.env.ADMIN_PASSWORD = newPassword;

  return NextResponse.json({ success: true });
}
