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
  colorScheme: "dark light",
  themeColor: [
    { color: "#060b0a", media: "(prefers-color-scheme: dark)" },
    { color: "#f5f7f2", media: "(prefers-color-scheme: light)" },
  ],
};

const themeScript = `
  try {
    const stored = localStorage.getItem("business-os-theme");
    const theme = stored === "light" || stored === "dark"
      ? stored
      : (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = "dark";
  }
`;

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
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
