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
      <body>
        <a
          className="fixed left-4 top-4 z-50 -translate-y-24 rounded-control bg-accent px-4 py-3 font-semibold text-accent-ink transition-transform focus:translate-y-0"
          href="#main-content"
        >
          Перейти к содержанию
        </a>
        {children}
      </body>
    </html>
  );
}
