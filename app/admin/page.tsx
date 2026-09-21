import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Dashboard, type DashboardMember } from "@/components/admin/dashboard";
import { getAdminSession } from "@/lib/session";
import { getAllRows } from "@/lib/waitlist";
import { getSettings } from "@/lib/settings";
import { sheetsConfigured } from "@/lib/sheets";
import { listChatAccess } from "@/lib/chat-access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "admin console",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const rows = await getAllRows();
  const members: DashboardMember[] = rows.map((r) => ({
    id: r.id,
    email: r.email,
    name: r.name,
    avatarUrl: r.avatarUrl,
    source: r.source,
    position: r.position,
    createdAt:
      r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    lastSyncedAt:
      r.lastSyncedAt instanceof Date
        ? r.lastSyncedAt.toISOString()
        : r.lastSyncedAt
          ? String(r.lastSyncedAt)
          : null,
    welcomeEmailSentAt:
      r.welcomeEmailSentAt instanceof Date
        ? r.welcomeEmailSentAt.toISOString()
        : r.welcomeEmailSentAt
          ? String(r.welcomeEmailSentAt)
          : null,
  }));

  let settings: Record<string, string> = {};
  try {
    settings = await getSettings();
  } catch {
    /* fresh database — settings editor still renders */
  }

  let chatAccess: { email: string; grantedAt: string | null }[] = [];
  try {
    chatAccess = (await listChatAccess()).map((r) => ({
      email: r.email,
      grantedAt: r.grantedAt ? r.grantedAt.toISOString() : null,
    }));
  } catch {
    /* fresh database — chat access panel stays empty */
  }

  return (
    <Dashboard
      adminEmail={session.email}
      members={members}
      sheetsConfigured={sheetsConfigured()}
      settings={settings}
      chatAccess={chatAccess}
    />
  );
}
