import type { Metadata } from "next";
import "../globals.css";
import Providers from "./providers";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { getStaticParams } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";

export const metadata: Metadata = {
  title: "HNG 単字検索",
  description: "漢字字体規範史データセット単字検索",
};

export function generateStaticParams() {
  return getStaticParams()
}

export default function RootLayout({
  params: { locale },
  children,
}: Readonly<{
  params: { locale: string };
  children: React.ReactNode;
}>) {
  setStaticParamsLocale(locale)

  return (
    <html data-theme="hng" lang={locale}>
      <body>
        <Providers locale={locale}>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
