// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** deleteCache DELETE /api/cache */
export async function deleteCacheUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCacheUsingDELETEParams,
  options?: { [key: string]: any },
) {
  return request<string>('/api/cache', {
    method: 'DELETE',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** getAllCacheKeys GET /api/cache/keys */
export async function getAllCacheKeysUsingGet(options?: { [key: string]: any }) {
  return request<string[]>('/api/cache/keys', {
    method: 'GET',
    ...(options || {}),
  });
}
