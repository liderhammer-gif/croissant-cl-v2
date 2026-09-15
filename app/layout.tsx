import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://croissant.cl"),
  title: { default: "Croissant.cl | La Boulangerie 17", template: "%s | Croissant.cl" },
  description: "Croissants artesanales elaborados con inspiración francesa por La Boulangerie 17 en Chile.",
  openGraph: {
    title: "Croissant.cl | La Boulangerie 17",
    description: "Croissants artesanales, sabores premium y soluciones HORECA.",
    url: "https://croissant.cl",
    siteName: "Croissant.cl",
    locale: "es_CL",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
