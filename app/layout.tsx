import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"EIXO | Confiança começa na mente",description:"Educação sobre ansiedade de desempenho."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}