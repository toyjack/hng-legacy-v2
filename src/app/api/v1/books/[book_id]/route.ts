import { NextRequest } from 'next/server';
import { getBookById } from '@/lib/api/db';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/api/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ book_id: string }> }
) {
  try {
    const { book_id } = await params;

    // 验证book_id
    if (!book_id || book_id.trim().length === 0) {
      return createErrorResponse(
        ErrorCodes.INVALID_PARAMETER,
        '文献ID无效',
        '文献ID不能为空',
        400
      );
    }

    // 查询文献
    const book = getBookById(book_id);

    if (!book) {
      return createErrorResponse(
        ErrorCodes.BOOK_NOT_FOUND,
        '文献未找到',
        `文献ID '${book_id}' 不存在`,
        404
      );
    }

    return createSuccessResponse(book, '查询成功', 200);

  } catch (error) {
    console.error('Book Detail API Error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      '服务器内部错误',
      error instanceof Error ? error.message : '未知错误',
      500
    );
  }
}