import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const siteUrl = "https://codedcv.dstrnadel.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Coded CV - Your Resume, Written in Code",
    template: "%s | Coded CV",
  },
  description:
    "Create a stunning developer resume styled as source code. Choose from 6 programming languages — C#, Python, TypeScript, Go, Rust, Java — export to PDF, and share on X. Free, no sign-up.",
  keywords: [
    "developer resume",
    "code resume",
    "programmer CV",
    "resume builder",
    "developer CV",
    "source code resume",
    "TypeScript resume",
    "Python resume",
    "free resume builder",
    "PDF resume",
    "coded CV",
  ],
  authors: [{ name: "Coded CV" }],
  creator: "Coded CV",
  openGraph: {
    title: "Coded CV - Your Resume, Written in Code",
    description:
      "Create a developer resume styled as source code. 6 languages, PDF export, free.",
    url: siteUrl,
    siteName: "Coded CV",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coded CV - Your Resume, Written in Code",
    description:
      "Create a developer resume styled as source code. 6 languages, PDF export, free.",
    creator: "@codedcv",
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${jetbrainsMono.className} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Coded CV",
              url: siteUrl,
              description:
                "Create a developer resume styled as source code. Choose from 6 programming languages, export to PDF, and share.",
              applicationCategory: "BusinessApplication",
              operatingSystem: "All",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "6 programming language styles",
                "PDF export",
                "Share on X/Twitter",
                "Dark IDE theme",
                "Free, no sign-up required",
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
