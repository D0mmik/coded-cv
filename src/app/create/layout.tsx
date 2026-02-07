import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Coded CV",
  description:
    "Build your developer resume styled as source code. Pick a language, fill in your details, and export a beautiful PDF.",
  alternates: {
    canonical: "https://codedcv.com/create",
  },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
