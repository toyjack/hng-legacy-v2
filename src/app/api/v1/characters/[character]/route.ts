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

    return createSuccessResponse(result, '查询成功', 200);

  } catch (error) {
    console.error('Character API Error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      '服务器内部错误',
      error instanceof Error ? error.message : '未知错误',
      500
    );
  }
}