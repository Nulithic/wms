import { ReactNode } from "react";
import ClientRootLayout from "@/components/RootLayout/ClientRootLayout";
import AuthLayout from "./AuthLayout";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <ClientRootLayout>
      <AuthLayout>{children}</AuthLayout>
    </ClientRootLayout>
  );
}
