"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <Button
      disabled={pending}
      icon={<LogOut aria-hidden />}
      onClick={logout}
      size="compact"
      variant="ghost"
    >
      {pending ? "Выходим…" : "Выйти"}
    </Button>
  );
}
