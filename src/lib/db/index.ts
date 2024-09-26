import { rawGlyphs } from "@/constant/glyphs";
import { rawMain } from "@/constant/main";

export type Glyph = {
  id: string;
  glyph_num: string;
  glyphs: string;
  occerrences: string;
  book_id: string;
};

export type Record = {
  entry: string;
  variants: string;
  id: string;
  djt: string;
  dkw: string;
  ucs: string;
};

export type Results = {
  character: Record | undefined;
  glyphs: Glyph[];
};

export function getImagePath(glyph: Glyph) {
  const imageHost="https://hng-images.kojisho.com";
  const path = `${imageHost}/${glyph.book_id}/${glyph.glyph_num}.png`;
  return path;
}

export function getEntryByChar(char: string) {
  const result = rawMain.find(
    (data) => data.entry == char || data.variants.includes(char)
  );
  const djt = result?.djt;
  const glyphsDataResult = rawGlyphs.filter((data) => data.id == djt);

  const results = {
    character: result,
    glyphs: glyphsDataResult,
  } as Results;

  return results;
}
