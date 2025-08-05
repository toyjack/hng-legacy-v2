import { NextRequest } from 'next/server';
import { getAllBooks } from '@/lib/api/db';
import { createSuccessResponse, createErrorResponse, createPaginatedResponse, ErrorCodes, parseQueryParams, createPagination } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = parseQueryParams(searchParams);

    // 构建过滤条件
    const filters = {
      type: queryParams.book_type,
      era: queryParams.era,
      dateFrom: queryParams.date_from,
      dateTo: queryParams.date_to,
      location: queryParams.location,
      authority: queryParams.authority
    };

    // 获取所有匹配的文献
    const allBooks = getAllBooks(filters);

    // 分页处理
    const totalItems = allBooks.length;
    const startIndex = (queryParams.page - 1) * queryParams.limit;
    const endIndex = startIndex + queryParams.limit;
    const paginatedBooks = allBooks.slice(startIndex, endIndex);

    // 创建分页元数据
    const pagination = createPagination(queryParams.page, queryParams.limit, totalItems);

    return createPaginatedResponse(paginatedBooks, pagination, '查询成功');

  } catch (error) {
    console.error('Books API Error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      '服务器内部错误',
      error instanceof Error ? error.message : '未知错误',
      500
    );
  }
}