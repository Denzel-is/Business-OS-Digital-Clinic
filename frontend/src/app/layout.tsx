import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";

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
  themeColor: "#060b0a",
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
