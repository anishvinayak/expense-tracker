import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FlowLedger — Personal Finance Tracker",
    template: "%s | FlowLedger",
  },
  description:
    "Track expenses, manage budgets, monitor spending, and understand where your money flows with FlowLedger.",
  applicationName: "FlowLedger",
  keywords: [
    "FlowLedger",
    "expense tracker",
    "personal finance",
    "budget planner",
    "expense management",
    "finance dashboard",
  ],
  authors: [{ name: "FlowLedger" }],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "FlowLedger — Personal Finance Tracker",
    description:
      "Track every rupee. Know where it flows.",
    siteName: "FlowLedger",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#022c2c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}