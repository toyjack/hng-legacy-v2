import { setStaticParamsLocale } from 'next-international/server'
import { getEntryByChar, getImagePath, Record } from "@/lib/db";
import { getStaticParams } from '@/locales/server';
import mainJson from "@/constant/main.json";

export function generateStaticParams() {
  console.log(getStaticParams())
  const mainTable=mainJson as Record[];
  const params = mainTable.map((record) => {
    return {
      character: record.entry,
    };
  });
  return params
}

export default function CharacterPage({
  params: {locale, character },
}: {
  params: {locale:string; character: string };
}) {
  setStaticParamsLocale(locale);

  const char = decodeURIComponent(character);
  const results = getEntryByChar(char);
  if (!results) {
    return <div>Character not found</div>;
  }
  return (
    <div className="container mx-auto">
      <div className="flex gap-4 p-4 my-8 bg-base-100 rounded-md shadow-xl">
        <div>見出し字：{results.character?.entry}</div>
        <div>大字典番号：{results.character?.djt}</div>
        <div>大漢和番号：{results.character?.dkw}</div>
      </div>

      <div className="bg-base-300">
        <div>
          <h2 className="text-xl font-bold p-2">中国写本</h2>
          <div className="p-2 flex flex-wrap">{results.glyphs?.map((glyph) => (
          <div className="card" key={glyph.glyph_num}>
            <img
            key={glyph.id}
            src={getImagePath(glyph)}
            alt={glyph.glyphs}
            width="100"
          />
          </div>
        ))}</div>
        </div>
      </div>

    </div>
  );
}
