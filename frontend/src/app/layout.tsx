import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Business OS: Digital Clinic",
    template: "%s | Business OS: Digital Clinic",
  },
  description:
    "Диагностика цифровых проблем бизнеса и проектирование быстрых, удобных и защищённых IT-систем.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#07100f",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
