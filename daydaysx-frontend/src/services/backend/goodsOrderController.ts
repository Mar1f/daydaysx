// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** doGoodsOrder POST /api/goods_order/ */
export async function doGoodsOrderUsingPost(
  body: API.GoodsOrderAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/goods_order/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
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
