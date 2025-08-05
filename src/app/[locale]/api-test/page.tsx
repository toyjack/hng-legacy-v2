'use client';

import { useState } from 'react';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
  message?: string;
  timestamp: string;
  version: string;
}

export default function ApiTestPage() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [character, setCharacter] = useState('一');

  const testEndpoints = [
    {
      name: '查询汉字',
      url: '/api/v1/characters/一',
      method: 'GET'
    },
    {
      name: '搜索汉字',
      url: '/api/v1/characters/search?q=一',
      method: 'GET'
    },
    {
      name: '大字典号查询',
      url: '/api/v1/characters/djt/00001',
      method: 'GET'
    },
    {
      name: '大漢和号查询',
      url: '/api/v1/characters/dkw/M00001',
      method: 'GET'
    },
    {
      name: '统合ID查询',
      url: '/api/v1/characters/id/00001',
      method: 'GET'
    },
    {
      name: '文献列表',
      url: '/api/v1/books?limit=5',
      method: 'GET'
    },
    {
      name: '文献分类',
      url: '/api/v1/book-types',
      method: 'GET'
    },
    {
      name: '统计信息',
      url: '/api/v1/stats',
      method: 'GET'
    },
    {
      name: 'API文档',
      url: '/api/v1',
      method: 'GET'
    }
  ];

  const testApi = async (url: string, method: string = 'GET') => {
    setLoading(true);
    try {
      const response = await fetch(url, { method });
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      setResponse({
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: '请求失败',
          details: error instanceof Error ? error.message : '未知错误'
        },
        timestamp: new Date().toISOString(),
        version: 'v1'
      });
    } finally {
      setLoading(false);
    }
  };

  const testBatchApi = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/characters/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          characters: ['一', '二', '三'],
          include_variants: true
        })
      });
      const data = await response.json();
      setResponse(data);
    } catch (error) {
      setResponse({
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: '批量查询失败',
          details: error instanceof Error ? error.message : '未知错误'
        },
        timestamp: new Date().toISOString(),
        version: 'v1'
      });
    } finally {
      setLoading(false);
    }
  };

  const testCustomCharacter = async () => {
    if (!character.trim()) return;
    const url = `/api/v1/characters/${encodeURIComponent(character)}`;
    await testApi(url);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">HNG API 测试页面</h1>
      
      {/* 自定义汉字测试 */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">自定义汉字查询</h2>
          <div className="flex gap-2">
            <input
              type="text"
              className="input input-bordered flex-1"
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              placeholder="输入汉字"
            />
            <button 
              className="btn btn-primary" 
              onClick={testCustomCharacter}
              disabled={loading}
            >
              查询
            </button>
          </div>
        </div>
      </div>

      {/* 预设API测试 */}
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <h2 className="card-title">API端点测试</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {testEndpoints.map((endpoint, index) => (
              <button
                key={index}
                className="btn btn-outline btn-sm"
                onClick={() => testApi(endpoint.url, endpoint.method)}
                disabled={loading}
              >
                {endpoint.name}
              </button>
            ))}
            <button
              className="btn btn-outline btn-sm"
              onClick={testBatchApi}
              disabled={loading}
            >
              批量查询
            </button>
          </div>
        </div>
      </div>

      {/* 响应显示 */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">API响应</h2>
          {loading && (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}
          {response && !loading && (
            <div>
              <div className={`alert ${response.success ? 'alert-success' : 'alert-error'} mb-4`}>
                <span>
                  {response.success ? '✓ 成功' : '✗ 失败'}: {response.message || response.error?.message}
                </span>
              </div>
              <pre className="bg-base-200 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}