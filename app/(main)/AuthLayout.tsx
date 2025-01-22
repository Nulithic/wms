"use client";

import { type ReactNode } from "react";
import { useAuthorization } from "@/libs/hooks/useAuthorization";

export default function MainLayoutAuthorization({ children }: { children: ReactNode }) {
  const { isAuthorized, isLoading } = useAuthorization();

  if (isLoading) {
    return null;
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}
