import { NextRequest } from 'next/server';
import { getStatistics } from '@/lib/api/db';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const stats = getStatistics();
    return createSuccessResponse(stats, '统计信息获取成功', 200);

  } catch (error) {
    console.error('Statistics API Error:', error);
    return createErrorResponse(
      ErrorCodes.INTERNAL_ERROR,
      '服务器内部错误',
      error instanceof Error ? error.message : '未知错误',
      500
    );
  }
}