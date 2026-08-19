import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Revive Auto Detail | Premium Automotive Detailing",
  description:
    "Premium automotive detailing engineered to restore, protect, and elevate your vehicle. Serving discerning clients with paint correction, ceramic coating, and full detailing services.",
  keywords: "automotive detailing, paint correction, ceramic coating, car detailing, premium detailing",
  openGraph: {
    title: "Revive Auto Detail | Premium Automotive Detailing",
    description: "Restore the Drive. Premium automotive detailing for discerning clients.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
