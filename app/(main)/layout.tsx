import { ReactNode } from "react";
import ClientRootLayout from "@/components/RootLayout/ClientRootLayout";
import AuthLayout from "./AuthLayout";
import { TitleProvider } from "@/components/RootLayout/TitleContext";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <TitleProvider>
          <ClientRootLayout>
            <AuthLayout>{children}</AuthLayout>
          </ClientRootLayout>
        </TitleProvider>
      </body>
    </html>
  );
}
