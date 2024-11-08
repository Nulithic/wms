import { ReactNode } from "react";
import ClientRootLayout from "@/components/RootLayout/ClientRootLayout";
import AuthLayout from "./AuthLayout";
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <ClientRootLayout>
          <AuthLayout>{children}</AuthLayout>
        </ClientRootLayout>
      </body>
    </html>
  );
}
