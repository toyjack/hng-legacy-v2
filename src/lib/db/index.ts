import { bookTypes } from "@/constant/book_types";
import { rawBooks } from "@/constant/books";
import glyphs from "@/constant/glyphs.json";
import main from "@/constant/main.json";
import { Glyph } from "@/types";

// some bug from d.ts
const glyphsData = glyphs as Glyph[];
const mainData = main;

export function getImagePath(glyph:Glyph) {
  const imageHost="https://hng-images.kojisho.com";
  const path = `${imageHost}/${glyph.book_id}/${glyph.glyph_num}.png`;
  return path;
}

export function getEntryByChar(char: string) {
  const result = mainData.find(
    (data) => data.entry == char || data.variants.includes(char)
  );
  const djt = result?.djt;
  // to find id xxxxxB
  const glyphsDataResult = glyphsData.filter((data) => data.id.startsWith(String(djt)));

  const glyphs = bookTypes.map((bookType) => {
    const books = rawBooks.filter((book) => book.type == bookType.id);

    if (books.length === 0) {
      return null;
    }

    return {
      type: bookType.id,
      books: books.map((book) => {
        const glyphs = glyphsDataResult.filter((data) => data.book_id===book.id);
        
        return {
          book_info: book,
          glyphs: glyphs
        };
      })
    }
  })
  
  const results = {
    character: result,
    glyphs: glyphsDataResult,
    glyphsData:glyphs
  };

  return results;
}
