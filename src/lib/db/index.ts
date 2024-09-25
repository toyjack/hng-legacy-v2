import main from "@/constant/main.json";
import glyphs from "@/constant/glyphs.json";

export type Glyph={
  "id": string
  "glyph_num": string
  "glyphs":string
  "occerrences":string
  "book_id": string
  }

  export type Record={
    entry: string;
    variants: string;
    id: string;
    djt: string;
    dkw: string;
    ucs: string;
  }

export const glyphsData = glyphs as Glyph[];

export const mainData = main as Record [];
export type Results ={
  character: Record | undefined;
  glyphs: Glyph[];
}

export function getImagePath(glyph: Glyph) {
  const path=`/images/${glyph.book_id}/${glyph.glyph_num}.png`;
  return path;
}

export function getEntryByChar(char: string) {
  const result = mainData.find(
    (data) => data.entry == char || data.variants.includes(char)
  );
  const djt = result?.djt;
  const glyphsDataResult = glyphsData.filter((data) => data.id == djt);

  const results={
    character: result,
    glyphs: glyphsDataResult,
  } as Results;

  return results;
}
