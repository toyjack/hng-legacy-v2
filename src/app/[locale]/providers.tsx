"use client";
import { I18nProviderClient } from "@/locales/client";

export default function Providers({
  locale,
  children,
}: Readonly<{ locale: string; children: React.ReactNode }>) {
  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>;
}
