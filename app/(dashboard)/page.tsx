import { auth } from "@/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
      <p className="mt-4">
        Welcome, {session.user.name || session.user.email}!
      </p>
    </main>
  );
}
