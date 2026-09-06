import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { LoginForm } from "@/components/admin/login-form";
import { getAdminSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-5 py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black_30%,transparent_75%)]" />
        <div className="absolute left-1/2 top-1/4 h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[110px]" />
      </div>

      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-line bg-surface p-8 sm:p-10">
          <div className="flex flex-col items-center text-center">
            <Logo size={44} wordmark={false} />
            <h1 className="mt-5 text-xl font-semibold tracking-[-0.025em] text-ink">
              admin console
            </h1>
            <p className="mt-1.5 font-mono text-[11px] tracking-[0.05em] text-dim">
              ramya ai · internal access only
            </p>
          </div>
          <LoginForm />
        </div>
        <p className="mt-6 text-center font-mono text-[11px] tracking-[0.05em] text-dim">
          <Link href="/" className="transition-colors duration-150 hover:text-muted">
            ← back to ramyaai.tech
          </Link>
        </p>
      </div>
    </main>
  );
}
