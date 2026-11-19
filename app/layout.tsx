import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EIXO | Confiança começa na mente",
  description: "Educação sobre ansiedade de desempenho.",
  icons: {
    icon: [{ url: "/favicon.svg?v=2", type: "image/svg+xml", sizes: "any" }],
    shortcut: "/favicon.svg?v=2",
    apple: "/icon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}