"use client";

import { logout } from "@/actions/auth";
import { Button } from "../ui/button";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit">Logout</Button>
    </form>
  );
}
