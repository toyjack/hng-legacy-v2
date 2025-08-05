import { NextRequest } from 'next/server';
import { getCharacterById } from '@/lib/api/db';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ unified_id: string }> }
) {
  try {
    const { unified_id } = await params;

    // 验证统合ID格式（5位数字）
    if (!unified_id || !/^\d{5}[a-z]?$/.test(unified_id)) {
      return createErrorResponse(
        ErrorCodes.INVALID_PARAMETER,
        '统合ID格式无效',
        '统合ID应为5位数字，可选字母后缀，如 00001 或 00006b',
        400
      );
    }

    // 查询
    const result = getCharacterById(unified_id);

    if (!result) {
      return createErrorResponse(
        ErrorCodes.CHARACTER_NOT_FOUND,
        '汉字未找到',
        `统合ID '${unified_id}' 对应的汉字不存在`,
        404
      );
    }

    return createSuccessResponse(result, '查询成功', 200);

  } catch (error) {
    console.error('Unified ID API Error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      '服务器内部错误',
      error instanceof Error ? error.message : '未知错误',
      500
    );
  }
}