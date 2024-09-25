import Info from "@/components/info";
import SearchForm from "@/components/search-form";
import { getI18n, getStaticParams } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";

export function generateStaticParams() {
  return getStaticParams();
}

export default async function Home({
  params: { locale },
}: Readonly<{
  params: { locale: string };
}>) {
  setStaticParamsLocale(locale);

  const t = await getI18n();
  return (
    <main className="container mx-auto">
      <h2>{t("hello")}</h2>
      <Info />
      <div>
        <SearchForm />
      </div>
    </main>
  );
}
