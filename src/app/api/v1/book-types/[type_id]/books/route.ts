import { NextRequest } from 'next/server';
import { getBooksByType } from '@/lib/api/db';
import { createSuccessResponse, createErrorResponse, createPaginatedResponse, ErrorCodes, parseQueryParams, createPagination } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type_id: string }> }
) {
  try {
    const { type_id } = await params;
    const { searchParams } = new URL(request.url);
    const queryParams = parseQueryParams(searchParams);

    // 验证type_id
    const validTypes = ['CM', 'CP', 'JM', 'JP', 'K', 'X'];
    if (!validTypes.includes(type_id)) {
      return createErrorResponse(
        ErrorCodes.INVALID_PARAMETER,
        '文献类型无效',
        `文献类型必须是以下之一: ${validTypes.join(', ')}`,
        400
      );
    }

    // 获取指定类型的文献
    const allBooks = getBooksByType(type_id);

    // 分页处理
    const totalItems = allBooks.length;
    const startIndex = (queryParams.page - 1) * queryParams.limit;
    const endIndex = startIndex + queryParams.limit;
    const paginatedBooks = allBooks.slice(startIndex, endIndex);

    // 创建分页元数据
    const pagination = createPagination(queryParams.page, queryParams.limit, totalItems);

    return createPaginatedResponse(paginatedBooks, pagination, '查询成功');

  } catch (error) {
    console.error('Books by Type API Error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      '服务器内部错误',
      error instanceof Error ? error.message : '未知错误',
      500
    );
  }
}