import { NextRequest } from 'next/server';
import { getGlyphByBookAndNumber } from '@/lib/api/db';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ book_id: string; glyph_number: string }> }
) {
  try {
    const { book_id, glyph_number } = await params;

    // 验证参数
    if (!book_id || book_id.trim().length === 0) {
      return createErrorResponse(
        ErrorCodes.INVALID_PARAMETER,
        '文献ID无效',
        '文献ID不能为空',
        400
      );
    }

    if (!glyph_number || !/^\d{4}$/.test(glyph_number)) {
      return createErrorResponse(
        ErrorCodes.INVALID_PARAMETER,
        '字体号格式无效',
        '字体号应为4位数字格式，如 0325',
        400
      );
    }

    // 查询字体
    const glyph = getGlyphByBookAndNumber(book_id, glyph_number);

    if (!glyph) {
      return createErrorResponse(
        ErrorCodes.GLYPH_NOT_FOUND,
        '字体未找到',
        `文献 '${book_id}' 中的字体号 '${glyph_number}' 不存在`,
        404
      );
    }

    return createSuccessResponse(glyph, '查询成功', 200);

  } catch (error) {
    console.error('Glyph by Book API Error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      '服务器内部错误',
      error instanceof Error ? error.message : '未知错误',
      500
    );
  }
}