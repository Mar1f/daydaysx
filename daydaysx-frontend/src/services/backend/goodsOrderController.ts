// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** doGoodsOrder POST /api/goods_order/add */
export async function doGoodsOrderUsingPost(
  body: API.GoodsOrderAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/goods_order/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getGoodsVOById GET /api/goods_order/get/vo */
export async function getGoodsVoByIdUsingGet1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getGoodsVOByIdUsingGET1Params,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseGoodsVO_>('/api/goods_order/get/vo', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** listGoodsOrderByPage POST /api/goods_order/list/page */
export async function listGoodsOrderByPageUsingPost(
  body: API.GoodsOrderQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageGoodsOrderVO_>('/api/goods_order/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
