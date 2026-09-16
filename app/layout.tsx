import type { Metadata } from "next";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";
import "./public-extras.css";
import "./admin.css";
import "./forms.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://croissant.cl"),
  title: {
    default: "Croissants artesanales en Santiago | Croissant.cl",
    template: "%s | Croissant.cl"
  },
  description:
    "Croissants y hojaldres artesanales en Santiago. Laminado artesanal, mantequilla francesa y belga, fermentación lenta y soluciones HORECA para cafeterías, hoteles y restaurantes.",
  alternates: {
    canonical: "/"
  },
  applicationName: "Croissant.cl",
  creator: "La Boulangerie 17",
  publisher: "La Boulangerie SpA",
  category: "Panadería y pastelería artesanal",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxImagePreview: "large",
      maxSnippet: -1,
      maxVideoPreview: -1
    }
  },
  openGraph: {
    title: "Croissants artesanales en Santiago | Croissant.cl",
    description:
      "Croissants y hojaldres artesanales de elaboración limitada, con fermentación lenta y soluciones HORECA.",
    url: "https://croissant.cl",
    siteName: "Croissant.cl",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/images/hero-croissant.webp",
        alt: "Croissants artesanales Croissant.cl"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Croissants artesanales en Santiago | Croissant.cl",
    description:
      "Croissants y hojaldres artesanales de elaboración limitada, con fermentación lenta y soluciones HORECA.",
    images: ["/images/hero-croissant.webp"]
  },
  icons: { icon: "/images/logo-lb17.webp" }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://croissant.cl/#organization",
  name: "La Boulangerie SpA",
  alternateName: "La Boulangerie 17",
  url: "https://croissant.cl",
  logo: "https://croissant.cl/images/logo-lb17.webp",
  foundingDate: "2017",
  email: "contacto@croissant.cl",
  brand: {
    "@type": "Brand",
    name: "Croissant.cl",
    url: "https://croissant.cl"
  },
  sameAs: ["https://www.instagram.com/croissant.chile/"]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://croissant.cl/#website",
  url: "https://croissant.cl",
  name: "Croissant.cl",
  inLanguage: "es-CL",
  publisher: {
    "@id": "https://croissant.cl/#organization"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
