import { NextRequest } from 'next/server';
import { getCharacterByDkw } from '@/lib/api/db';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dkw_number: string }> }
) {
  try {
    const { dkw_number } = await params;

    // 验证大漢和号格式（M + 5位数字）
    if (!dkw_number || !/^M\d{5}$/.test(dkw_number)) {
      return createErrorResponse(
        ErrorCodes.INVALID_PARAMETER,
        '大漢和号格式无效',
        '大漢和号应为M+5位数字格式，如 M00001',
        400
      );
    }

    // 查询
    const result = getCharacterByDkw(dkw_number);

    if (!result) {
      return createErrorResponse(
        ErrorCodes.CHARACTER_NOT_FOUND,
        '汉字未找到',
        `大漢和号 '${dkw_number}' 对应的汉字不存在`,
        404
      );
    }

    return createSuccessResponse(result, '查询成功', 200);

  } catch (error) {
    console.error('DKW API Error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      '服务器内部错误',
      error instanceof Error ? error.message : '未知错误',
      500
    );
  }
}