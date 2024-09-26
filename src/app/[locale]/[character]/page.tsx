import { bookTypes } from "@/constant/book_types";
import { getEntryByChar, getImagePath,  } from "@/lib/db";
import Image from "next/image";

export default function CharacterPage({
  params: {  character },
}: {
  params: {  character: string };
}) {
  const char = decodeURIComponent(character);
  const results = getEntryByChar(char);

  console.log(results);

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

      <div className="bg-base-300 w-full shadow card p-2">
        { bookTypes.map((bookType) => (
          <h2 key={bookType.id} className="text-xl font-bold p-2">
            {bookType.name}
          </h2>
        ))  
        }

        <h2 className="text-xl font-bold p-2">中国写本</h2>
        
        <div className="p-2 flex flex-wrap w-full gap-4">
          {results.glyphs?.map((glyph) => (
            <div
              className="card w-32 bg-base-100 shadow-md"
              key={glyph.book_id + glyph.glyph_num}
            >
              <Image
                key={glyph.id}
                src={getImagePath(glyph)}
                alt={glyph.glyphs}
                width={64}
                height={64}
                style={{
                  width: 'auto' ,
                  height:'100%',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
