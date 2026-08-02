import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const title = "BigChungyTV | Gamdom Raffle and Bonuses";
const description =
  "Every $5,000 wagered on Gamdom under code CHUNGY earns a ticket in the monthly raffle. Claim bonuses and watch BigChungyTV live on Kick.";

export const metadata: Metadata = {
  title: { default: title, template: "%s | BigChungyTV" },
  description,
  applicationName: "BigChungyTV",
  openGraph: {
    type: "website",
    locale: "en_US",
    title,
    description,
    siteName: "BigChungyTV",
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#141210",
};

// Runs before first paint so the intro state is known without a flash.
// The full vault sequence plays once per session; every later navigation
// lands on the resting state so the CTA is immediately reachable.
const introScript = `(function(){
  try {
    var m = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var seen = sessionStorage.getItem("bctv-intro");
    document.documentElement.setAttribute("data-intro", (seen || m) ? "instant" : "run");
    if (!seen) sessionStorage.setItem("bctv-intro", "1");
  } catch (e) {
    document.documentElement.setAttribute("data-intro", "instant");
  }
})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
