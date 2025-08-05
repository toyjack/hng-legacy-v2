import { NextRequest } from 'next/server';
import { getGlyphById } from '@/lib/api/db';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ glyph_id: string }> }
) {
  try {
    const { glyph_id } = await params;

    // 验证glyph_id格式（如：00001A）
    if (!glyph_id || !/^\d{5}[A-Z]$/.test(glyph_id)) {
      return createErrorResponse(
        ErrorCodes.INVALID_PARAMETER,
        '字体ID格式无效',
        '字体ID应为5位数字+大写字母格式，如 00001A',
        400
      );
    }

    // 查询字体
    const glyph = getGlyphById(glyph_id);

    if (!glyph) {
      return createErrorResponse(
        ErrorCodes.GLYPH_NOT_FOUND,
        '字体未找到',
        `字体ID '${glyph_id}' 不存在`,
        404
      );
    }

    return createSuccessResponse(glyph, '查询成功', 200);

  } catch (error) {
    console.error('Glyph API Error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      '服务器内部错误',
      error instanceof Error ? error.message : '未知错误',
      500
    );
  }
}