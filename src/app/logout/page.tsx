"use client";

import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }, []);

  return (
    <div>
      <h1>Logout</h1>
      <p>Logging out...</p>
    </div>
  );
}
