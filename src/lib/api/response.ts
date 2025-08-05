import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  message?: string;
  timestamp: string;
  version: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_prev: boolean;
}

export function createSuccessResponse<T>(
  data: T,
  message = '操作成功',
  status: number = 200
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
    version: 'v1'
  };

  return NextResponse.json(response, { status });
}

export function createErrorResponse(
  code: string,
  message: string,
  details?: string,
  status: number = 400
): NextResponse<ApiResponse> {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details
    },
    timestamp: new Date().toISOString(),
    version: 'v1'
  };

  return NextResponse.json(response, { status });
}

export function createPaginatedResponse<T>(
  items: T[],
  pagination: PaginationMeta,
  message = '查询成功'
): NextResponse<ApiResponse<{ items: T[]; pagination: PaginationMeta }>> {
  return createSuccessResponse({
    items,
    pagination
  }, message);
}

// 错误码枚举
export const ErrorCodes = {
  CHARACTER_NOT_FOUND: 'CHARACTER_NOT_FOUND',
  BOOK_NOT_FOUND: 'BOOK_NOT_FOUND',
  GLYPH_NOT_FOUND: 'GLYPH_NOT_FOUND',
  INVALID_PARAMETER: 'INVALID_PARAMETER',
  MISSING_PARAMETER: 'MISSING_PARAMETER',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
} as const;

// 分页辅助函数
export function createPagination(
  page: number,
  limit: number,
  totalItems: number
): PaginationMeta {
  const totalPages = Math.ceil(totalItems / limit);
  
  return {
    current_page: page,
    per_page: limit,
    total_pages: totalPages,
    total_items: totalItems,
    has_next: page < totalPages,
    has_prev: page > 1
  };
}

// 查询参数解析辅助函数
export function parseQueryParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
  
  return {
    page,
    limit,
    book_type: searchParams.get('book_type') || undefined,
    era: searchParams.get('era') || undefined,
    date_from: searchParams.get('date_from') ? parseInt(searchParams.get('date_from')!) : undefined,
    date_to: searchParams.get('date_to') ? parseInt(searchParams.get('date_to')!) : undefined,
    location: searchParams.get('location') || undefined,
    authority: searchParams.get('authority') || undefined,
    include_variants: searchParams.get('include_variants') === 'true',
    include_images: searchParams.get('include_images') !== 'false',
    fields: searchParams.get('fields')?.split(',') || undefined
  };
}