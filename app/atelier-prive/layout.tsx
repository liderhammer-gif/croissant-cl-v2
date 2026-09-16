import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atelier Privé",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true
  }
};

export default function AtelierPriveLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
