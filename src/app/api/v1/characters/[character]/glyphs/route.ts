import { NextRequest } from 'next/server';
import { getCharacterByEntry } from '@/lib/api/db';
import { createSuccessResponse, createErrorResponse, ErrorCodes, parseQueryParams } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ character: string }> }
) {
  try {
    const { character } = await params;
    const { searchParams } = new URL(request.url);
    const queryParams = parseQueryParams(searchParams);
    
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

    // 查询汉字及其字体
    const result = getCharacterByEntry(decodedCharacter);

    if (!result) {
      return createErrorResponse(
        ErrorCodes.CHARACTER_NOT_FOUND,
        '汉字未找到',
        `字符 '${decodedCharacter}' 不存在于HNG数据集中`,
        404
      );
    }

    // 过滤字体数据
    let filteredGlyphs = result.glyph_groups;

    // 根据文献类型过滤
    if (queryParams.book_type) {
      filteredGlyphs = filteredGlyphs.filter(group => 
        group.book_type.id === queryParams.book_type
      );
    }

    // 根据年代范围过滤
    if (queryParams.date_from || queryParams.date_to) {
      filteredGlyphs = filteredGlyphs.map(group => ({
        ...group,
        books: group.books.filter(book => {
          const bookDate = book.book_info.date_order;
          const fromDate = queryParams.date_from || 0;
          const toDate = queryParams.date_to || 9999;
          return bookDate >= fromDate && bookDate <= toDate;
        })
      })).filter(group => group.books.length > 0);
    }

    // 计算过滤后的统计信息
    const totalGlyphs = filteredGlyphs.reduce((total, group) => 
      total + group.books.reduce((bookTotal, book) => bookTotal + book.glyphs.length, 0), 0
    );
    const totalBooks = filteredGlyphs.reduce((total, group) => total + group.books.length, 0);

    const responseData = {
      character: result.character,
      glyph_groups: filteredGlyphs,
      total_glyphs: totalGlyphs,
      total_books: totalBooks,
      filters_applied: {
        book_type: queryParams.book_type,
        date_from: queryParams.date_from,
        date_to: queryParams.date_to
      }
    };

    return createSuccessResponse(responseData, '字体查询成功', 200);

  } catch (error) {
    console.error('Character Glyphs API Error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      '服务器内部错误',
      error instanceof Error ? error.message : '未知错误',
      500
    );
  }
}