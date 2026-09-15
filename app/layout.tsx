import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://croissant.cl"),
  title: { default: "Croissant.cl | La Boulangerie 17", template: "%s | Croissant.cl" },
  description: "Croissants y hojaldres artesanales de elaboración limitada. Laminado artesanal, mantequilla francesa y belga, fermentación lenta y soluciones HORECA.",
  openGraph: {
    title: "Croissant.cl | La Boulangerie 17",
    description: "Más que un croissant, una experiencia.",
    url: "https://croissant.cl",
    siteName: "Croissant.cl",
    locale: "es_CL",
    type: "website",
    images: [{ url: "/images/hero-croissant.webp", width: 720, height: 588, alt: "Croissants artesanales Croissant.cl" }]
  },
  icons: { icon: "/images/logo-lb17.webp" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
