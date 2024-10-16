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

/** updateOrderStatus POST /api/goods_order/updateStatus */
export async function updateOrderStatusUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.updateOrderStatusUsingPOSTParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/goods_order/updateStatus', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
