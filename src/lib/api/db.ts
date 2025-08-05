import { bookTypes } from "@/constant/book_types";
import { rawBooks } from "@/constant/books";
import glyphs from "@/constant/glyphs.json";
import main from "@/constant/main.json";
import { Glyph, Record } from "@/types";

// 类型安全的数据
const glyphsData = glyphs as Glyph[];
const mainData = main as Record[];

export interface BookInfo {
  id: string;
  name: string;
  short_name: string;
  era: string;
  type: {
    id: string;
    name: string;
  };
  date: string;
  date_order: number;
  is_standard: boolean;
  authority_type: string;
  location: string;
  glyph_count?: number;
}

export interface CharacterInfo {
  entry: string;
  variants: string[];
  unified_id: string;
  djt_number: string;
  dkw_number: string;
  ucs_code: string;
}

export interface GlyphInfo extends Glyph {
  image_url: string;
  thumbnail_url?: string;
}

export interface GlyphGroup {
  book_type: {
    id: string;
    name: string;
  };
  books: {
    book_info: BookInfo;
    glyphs: GlyphInfo[];
  }[];
}

export interface CharacterSearchResult {
  character: CharacterInfo;
  glyph_groups: GlyphGroup[];
  total_glyphs: number;
  total_books: number;
}

// 获取图像路径
export function getImagePath(glyph: Glyph, thumbnail = false): string {
  const imageHost = "https://hng-images.kojisho.com";
  const path = thumbnail 
    ? `${imageHost}/${glyph.book_id}/thumb/${glyph.glyph_num}.png`
    : `${imageHost}/${glyph.book_id}/${glyph.glyph_num}.png`;
  return path;
}

// 根据汉字查询
export function getCharacterByEntry(character: string): CharacterSearchResult | null {
  const result = mainData.find(
    (data) => data.entry === character || data.variants.includes(character)
  );

  if (!result) {
    return null;
  }

  const djt = result.djt;
  const relatedGlyphs = glyphsData.filter((data) => data.id.startsWith(String(djt)));

  const glyphGroups = bookTypes.map((bookType) => {
    const books = rawBooks.filter((book) => book.type === bookType.id);

    if (books.length === 0) {
      return null;
    }

    return {
      type: bookType,
      books: books.map((book) => {
        const bookGlyphs = relatedGlyphs.filter((data) => data.book_id === book.id);
        
        return {
          book_info: transformBookInfo(book),
          glyphs: bookGlyphs.map(transformGlyphInfo)
        };
      }).filter(bookData => bookData.glyphs.length > 0)
    };
  }).filter(group => group && group.books.length > 0) as GlyphGroup[];

  return {
    character: transformCharacterInfo(result),
    glyph_groups: glyphGroups,
    total_glyphs: relatedGlyphs.length,
    total_books: glyphGroups.reduce((total, group) => total + group.books.length, 0)
  };
}

// 根据大字典号查询
export function getCharacterByDjt(djtNumber: string): CharacterSearchResult | null {
  const result = mainData.find((data) => data.djt === djtNumber);
  return result ? getCharacterByEntry(result.entry) : null;
}

// 根据大漢和号查询
export function getCharacterByDkw(dkwNumber: string): CharacterSearchResult | null {
  const result = mainData.find((data) => data.dkw === dkwNumber);
  return result ? getCharacterByEntry(result.entry) : null;
}

// 根据统合ID查询
export function getCharacterById(unifiedId: string): CharacterSearchResult | null {
  const result = mainData.find((data) => data.id === unifiedId);
  return result ? getCharacterByEntry(result.entry) : null;
}

// 批量查询汉字
export function getCharactersBatch(characters: string[], includeVariants = false): CharacterSearchResult[] {
  return characters
    .map(char => getCharacterByEntry(char))
    .filter((result): result is CharacterSearchResult => result !== null);
}

// 获取所有文献
export function getAllBooks(filters?: {
  type?: string;
  era?: string;
  dateFrom?: number;
  dateTo?: number;
  location?: string;
  authority?: string;
}): BookInfo[] {
  let filteredBooks = rawBooks;

  if (filters) {
    if (filters.type) {
      filteredBooks = filteredBooks.filter(book => book.type === filters.type);
    }
    if (filters.era) {
      filteredBooks = filteredBooks.filter(book => book.kubun === filters.era);
    }
    if (filters.dateFrom) {
      filteredBooks = filteredBooks.filter(book => parseInt(book.date_order) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      filteredBooks = filteredBooks.filter(book => parseInt(book.date_order) <= filters.dateTo!);
    }
    if (filters.location) {
      filteredBooks = filteredBooks.filter(book => book.shozo.includes(filters.location!));
    }
    if (filters.authority) {
      filteredBooks = filteredBooks.filter(book => book.koushi === filters.authority);
    }
  }

  return filteredBooks.map(transformBookInfo);
}

// 根据ID获取文献
export function getBookById(bookId: string): BookInfo | null {
  const book = rawBooks.find(book => book.id === bookId);
  return book ? transformBookInfo(book) : null;
}

// 获取文献分类
export function getBookTypes() {
  return bookTypes.map(type => ({
    ...type,
    book_count: rawBooks.filter(book => book.type === type.id).length
  }));
}

// 根据分类获取文献
export function getBooksByType(typeId: string): BookInfo[] {
  const books = rawBooks.filter(book => book.type === typeId);
  return books.map(transformBookInfo);
}

// 获取字体信息
export function getGlyphById(glyphId: string): GlyphInfo | null {
  const glyph = glyphsData.find(g => g.id === glyphId);
  return glyph ? transformGlyphInfo(glyph) : null;
}

// 根据文献和字体号获取字体
export function getGlyphByBookAndNumber(bookId: string, glyphNumber: string): GlyphInfo | null {
  const glyph = glyphsData.find(g => g.book_id === bookId && g.glyph_num === glyphNumber);
  return glyph ? transformGlyphInfo(glyph) : null;
}

// 获取统计信息
export function getStatistics() {
  const totalCharacters = mainData.length;
  const totalGlyphs = glyphsData.length;
  const totalBooks = rawBooks.length;
  
  const bookTypeStats = bookTypes.map(type => ({
    type: type.name,
    count: rawBooks.filter(book => book.type === type.id).length
  }));

  const eraStats = [...new Set(rawBooks.map(book => book.kubun))]
    .map(era => ({
      era,
      count: rawBooks.filter(book => book.kubun === era).length
    }));

  return {
    total_characters: totalCharacters,
    total_glyphs: totalGlyphs,
    total_books: totalBooks,
    book_type_distribution: bookTypeStats,
    era_distribution: eraStats
  };
}

// 转换函数
function transformCharacterInfo(record: Record): CharacterInfo {
  return {
    entry: record.entry,
    variants: record.variants ? record.variants.split(',').filter(v => v.trim()) : [],
    unified_id: record.id,
    djt_number: record.djt,
    dkw_number: record.dkw,
    ucs_code: record.ucs
  };
}

function transformBookInfo(book: any): BookInfo {
  const bookType = bookTypes.find(type => type.id === book.type);
  return {
    id: book.id,
    name: book.name,
    short_name: book.short_name,
    era: book.kubun,
    type: {
      id: book.type,
      name: bookType?.name || book.type
    },
    date: book.date,
    date_order: parseInt(book.date_order),
    is_standard: book.normal_type === '標準',
    authority_type: book.koushi || '',
    location: book.shozo || '',
    glyph_count: glyphsData.filter(g => g.book_id === book.id).length
  };
}

function transformGlyphInfo(glyph: Glyph): GlyphInfo {
  return {
    ...glyph,
    image_url: getImagePath(glyph),
    thumbnail_url: getImagePath(glyph, true)
  };
}