import { NextRequest } from 'next/server';
import { getCharacterByDjt } from '@/lib/api/db';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ djt_number: string }> }
) {
  try {
    const { djt_number } = await params;

    // 验证大字典号格式
    if (!djt_number || !/^\d{5}$/.test(djt_number)) {
      return createErrorResponse(
        ErrorCodes.INVALID_PARAMETER,
        '大字典号格式无效',
        '大字典号应为5位数字',
        400
      );
    }

    // 查询
    const result = getCharacterByDjt(djt_number);

    if (!result) {
      return createErrorResponse(
        ErrorCodes.CHARACTER_NOT_FOUND,
        '汉字未找到',
        `大字典号 '${djt_number}' 对应的汉字不存在`,
        404
      );
    }

    return createSuccessResponse(result, '查询成功', 200);

  } catch (error) {
    console.error('DJT API Error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      '服务器内部错误',
      error instanceof Error ? error.message : '未知错误',
      500
    );
  }
}