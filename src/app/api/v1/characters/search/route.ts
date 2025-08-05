import { NextRequest } from 'next/server';
import { getCharacterByEntry } from '@/lib/api/db';
import { createSuccessResponse, createErrorResponse, ErrorCodes, parseQueryParams } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    // 验证查询参数
    if (!query || query.trim().length === 0) {
      return createErrorResponse(
        ErrorCodes.MISSING_PARAMETER,
        '缺少查询参数',
        '请提供查询参数 q',
        400
      );
    }

    const decodedQuery = decodeURIComponent(query);
    const { include_variants } = parseQueryParams(searchParams);

    // 查询汉字
    const result = getCharacterByEntry(decodedQuery);

    if (!result) {
      return createErrorResponse(
        ErrorCodes.CHARACTER_NOT_FOUND,
        '汉字未找到',
        `字符 '${decodedQuery}' 不存在于HNG数据集中`,
        404
      );
    }

    // 如果不包含异体字，可以过滤响应数据
    if (!include_variants) {
      result.character.variants = [];
    }

    return createSuccessResponse(result, '搜索成功', 200);

  } catch (error) {
    console.error('Character Search API Error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      '服务器内部错误',
      error instanceof Error ? error.message : '未知错误',
      500
    );
  }
}