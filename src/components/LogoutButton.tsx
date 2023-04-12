"use client";

import { signOut } from "next-auth/react";
import { CiLogout as LogoutIcon } from "react-icons/ci";

export default function LogoutButton() {
  const logout = () => {
    signOut();
  };
  return (
    <button onClick={logout}>
      <LogoutIcon />
    </button>
  );
}
