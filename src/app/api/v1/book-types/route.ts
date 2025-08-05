import { NextRequest } from 'next/server';
import { getBookTypes } from '@/lib/api/db';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const bookTypes = getBookTypes();
    return createSuccessResponse(bookTypes, '查询成功', 200);

  } catch (error) {
    console.error('Book Types API Error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      '服务器内部错误',
      error instanceof Error ? error.message : '未知错误',
      500
    );
  }
}