import { NextRequest } from 'next/server';
import { getCharactersBatch } from '@/lib/api/db';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/api/response';

interface BatchRequestBody {
  characters: string[];
  include_variants?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: BatchRequestBody = await request.json();

    // 验证请求体
    if (!body.characters || !Array.isArray(body.characters)) {
      return createErrorResponse(
        ErrorCodes.INVALID_PARAMETER,
        '请求参数无效',
        'characters 字段必须是字符串数组',
        400
      );
    }

    // 限制批量查询数量
    if (body.characters.length === 0) {
      return createErrorResponse(
        ErrorCodes.INVALID_PARAMETER,
        '请求参数无效',
        '至少需要提供一个汉字',
        400
      );
    }

    if (body.characters.length > 50) {
      return createErrorResponse(
        ErrorCodes.INVALID_PARAMETER,
        '查询数量超限',
        '单次批量查询最多支持50个汉字',
        400
      );
    }

    // 过滤和验证汉字
    const validCharacters = body.characters
      .map(char => decodeURIComponent(char.trim()))
      .filter(char => char.length > 0);

    if (validCharacters.length === 0) {
      return createErrorResponse(
        ErrorCodes.INVALID_PARAMETER,
        '请求参数无效',
        '没有有效的汉字查询参数',
        400
      );
    }

    // 批量查询
    const results = getCharactersBatch(validCharacters, body.include_variants || false);

    // 构建响应数据
    const responseData = {
      results,
      summary: {
        requested_count: validCharacters.length,
        found_count: results.length,
        not_found: validCharacters.filter(char => 
          !results.some(result => result.character.entry === char)
        )
      }
    };

    return createSuccessResponse(responseData, '批量查询完成', 200);

  } catch (error) {
    console.error('Batch Characters API Error:', error);
    
    // JSON解析错误
    if (error instanceof SyntaxError) {
      return createErrorResponse(
        ErrorCodes.INVALID_PARAMETER,
        '请求体格式错误',
        '请求体必须是有效的JSON格式',
        400
      );
    }

    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      '服务器内部错误',
      error instanceof Error ? error.message : '未知错误',
      500
    );
  }
}