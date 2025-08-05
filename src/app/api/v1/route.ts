import { NextRequest } from 'next/server';
import { createSuccessResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  const baseUrl = new URL(request.url).origin;
  
  const apiDocumentation = {
    version: 'v1',
    title: 'HNG汉字字体规范史数据集 API',
    description: '提供汉字、字体和文献数据的RESTful API接口',
    base_url: `${baseUrl}/api/v1`,
    endpoints: {
      characters: {
        'GET /characters/{character}': {
          description: '根据汉字查询字体信息',
          example: `${baseUrl}/api/v1/characters/一`
        },
        'GET /characters/search?q={character}': {
          description: '搜索汉字（支持variants参数）',
          example: `${baseUrl}/api/v1/characters/search?q=一&variants=true`
        },
        'GET /characters/djt/{djt_number}': {
          description: '根据大字典号查询',
          example: `${baseUrl}/api/v1/characters/djt/00001`
        },
        'GET /characters/dkw/{dkw_number}': {
          description: '根据大漢和号查询',
          example: `${baseUrl}/api/v1/characters/dkw/M00001`
        },
        'GET /characters/id/{unified_id}': {
          description: '根据统合ID查询',
          example: `${baseUrl}/api/v1/characters/id/00001`
        },
        'POST /characters/batch': {
          description: '批量查询汉字',
          example: `${baseUrl}/api/v1/characters/batch`,
          body: { characters: ['一', '二', '三'], include_variants: true }
        },
        'GET /characters/{character}/glyphs': {
          description: '获取汉字的所有字体（支持过滤）',
          example: `${baseUrl}/api/v1/characters/一/glyphs?book_type=CM&date_from=500&date_to=700`
        },
        'GET /characters/{character}/stats': {
          description: '获取汉字统计信息',
          example: `${baseUrl}/api/v1/characters/一/stats`
        }
      },
      glyphs: {
        'GET /glyphs/{glyph_id}': {
          description: '获取特定字体图像信息',
          example: `${baseUrl}/api/v1/glyphs/00001A`
        },
        'GET /glyphs/book/{book_id}/glyph/{glyph_number}': {
          description: '根据文献和字体号获取图像',
          example: `${baseUrl}/api/v1/glyphs/book/dng/glyph/0325`
        }
      },
      books: {
        'GET /books': {
          description: '获取文献列表（支持分页和过滤）',
          example: `${baseUrl}/api/v1/books?type=CM&era=初唐写本&page=1&limit=20`
        },
        'GET /books/{book_id}': {
          description: '根据ID获取文献详情',
          example: `${baseUrl}/api/v1/books/dng`
        },
        'GET /book-types': {
          description: '获取文献分类信息',
          example: `${baseUrl}/api/v1/book-types`
        },
        'GET /book-types/{type_id}/books': {
          description: '根据分类获取文献',
          example: `${baseUrl}/api/v1/book-types/CM/books`
        }
      },
      statistics: {
        'GET /stats': {
          description: '获取数据库统计信息',
          example: `${baseUrl}/api/v1/stats`
        }
      }
    },
    query_parameters: {
      pagination: {
        page: '页码（默认：1）',
        limit: '每页条数（默认：20，最大：100）'
      },
      filtering: {
        book_type: '文献类型（CM, CP, JM, JP, K, X）',
        era: '时代（南北朝写本, 隋写本, 初唐写本等）',
        date_from: '起始年代',
        date_to: '结束年代',
        location: '收藏地点',
        authority: '公私性质（公的, 私的）'
      },
      output_control: {
        include_variants: '是否包含异体字（默认：false）',
        include_images: '是否包含图像URL（默认：true）',
        fields: '指定返回字段（逗号分隔）'
      }
    },
    response_format: {
      success: {
        success: true,
        data: '响应数据',
        message: '操作消息',
        timestamp: '时间戳',
        version: 'API版本'
      },
      error: {
        success: false,
        error: {
          code: '错误码',
          message: '错误消息',
          details: '错误详情'
        },
        timestamp: '时间戳',
        version: 'API版本'
      }
    },
    contact: {
      project: 'HNG汉字字体规范史数据集',
      repository: 'https://github.com/your-repo/hng-legacy-v2'
    }
  };

  return createSuccessResponse(apiDocumentation, 'API文档获取成功', 200);
}