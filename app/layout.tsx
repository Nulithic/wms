import { ReactNode } from "react";
import ClientRootLayout from "@/components/RootLayout/ClientRootLayout";
import Providers from "@/app/providers";
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ClientRootLayout>{children}</ClientRootLayout>
        </Providers>
      </body>
    </html>
  );
}
