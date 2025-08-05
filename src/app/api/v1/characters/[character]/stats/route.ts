import { NextRequest } from 'next/server';
import { getCharacterByEntry } from '@/lib/api/db';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ character: string }> }
) {
  try {
    const { character } = await params;
    const decodedCharacter = decodeURIComponent(character);

    // 验证输入
    if (!decodedCharacter || decodedCharacter.trim().length === 0) {
      return createErrorResponse(
        ErrorCodes.INVALID_PARAMETER,
        '汉字参数无效',
        '汉字不能为空',
        400
      );
    }

    // 查询汉字
    const result = getCharacterByEntry(decodedCharacter);

    if (!result) {
      return createErrorResponse(
        ErrorCodes.CHARACTER_NOT_FOUND,
        '汉字未找到',
        `字符 '${decodedCharacter}' 不存在于HNG数据集中`,
        404
      );
    }

    // 计算统计信息
    const bookTypeStats = result.glyph_groups.map(group => ({
      book_type: group.book_type.name,
      book_count: group.books.length,
      glyph_count: group.books.reduce((total, book) => total + book.glyphs.length, 0)
    }));

    // 计算时代分布
    const eraStats: { [era: string]: { book_count: number; glyph_count: number } } = {};
    result.glyph_groups.forEach(group => {
      group.books.forEach(book => {
        const era = book.book_info.era;
        if (!eraStats[era]) {
          eraStats[era] = { book_count: 0, glyph_count: 0 };
        }
        eraStats[era].book_count++;
        eraStats[era].glyph_count += book.glyphs.length;
      });
    });

    // 计算用例总数
    const totalOccurrences = result.glyph_groups.reduce((total, group) =>
      total + group.books.reduce((bookTotal, book) =>
        bookTotal + book.glyphs.reduce((glyphTotal, glyph) =>
          glyphTotal + parseInt(glyph.occerrences || '0'), 0
        ), 0
      ), 0
    );

    const stats = {
      character: result.character.entry,
      total_glyphs: result.total_glyphs,
      total_books: result.total_books,
      total_occurrences: totalOccurrences,
      book_type_distribution: bookTypeStats,
      era_distribution: Object.entries(eraStats).map(([era, stats]) => ({
        era,
        ...stats
      })).sort((a, b) => b.glyph_count - a.glyph_count),
      earliest_appearance: Math.min(...result.glyph_groups.flatMap(group =>
        group.books.map(book => book.book_info.date_order)
      )),
      latest_appearance: Math.max(...result.glyph_groups.flatMap(group =>
        group.books.map(book => book.book_info.date_order)
      ))
    };

    return createSuccessResponse(stats, '汉字统计信息获取成功', 200);

  } catch (error) {
    console.error('Character Stats API Error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      '服务器内部错误',
      error instanceof Error ? error.message : '未知错误',
      500
    );
  }
}