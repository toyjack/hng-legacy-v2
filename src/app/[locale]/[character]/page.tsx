import { getEntryByChar, getImagePath } from "@/lib/db";
import Image from "next/image";

export default function CharacterPage({
  params: { character },
}: {
  params: { character: string };
}) {
  const char = decodeURIComponent(character);
  const results = getEntryByChar(char);

  console.log(results.glyphsData);

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

      <div className="flex flex-col p-2 gap-2 ">
        {results.glyphsData.map((book) => (
          <div className="flex flex-col gap-2" key={book?.type}>
            <h2 key={book?.type} className="text-xl font-bold p-2">
              {book?.type}
            </h2>

            <div className="flex overflow-x-scroll md:flex-wrap md:overflow-hidden">
              {book?.books.map((book) => {
                if (book.glyphs.length === 0) {
                  return null;
                }
                return (
                  <div
                    key={book.book_info.id}
                    className="p-2 flex bg-base-100 gap-2"
                  >
                    <div className="card flex gap-4 bg-base-200 hover:shadow-md">
                      <div className="card-body">
                        <h2 className="card-title">
                          {book.book_info.short_name}
                        </h2>
                      </div>

                      <div className="flex gap-2 p-2">
                        {book.glyphs?.map((glyph) => {
                          if (!glyph) {
                            return null;
                          }

                          return (
                            <div
                              className="card w-32 bg-base-100 shadow-md"
                              key={glyph.book_id + glyph.glyph_num}
                            >
                              <figure>
                                <Image
                                  key={glyph.id}
                                  src={getImagePath(glyph)}
                                  alt={glyph.glyphs}
                                  width={64}
                                  height={64}
                                  style={{
                                    width: "auto",
                                    height: "100%",
                                  }}
                                />
                              </figure>
                              <div className="card-body">
                                <h2 className="card-title">
                                  用例：{glyph.occerrences}
                                </h2>
                                
                             
                              
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {/* 
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
        </div> */}
      </div>
      <pre>
        <code>{JSON.stringify(results.glyphsData, null, 2)}</code>
      </pre>
    </div>
  );
}
