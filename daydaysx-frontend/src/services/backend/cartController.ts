// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** doCart POST /api/cart/add */
export async function doCartUsingPost(body: API.CartAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong_>('/api/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** deleteCartGoods POST /api/cart/delete */
export async function deleteCartGoodsUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/cart/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** editGoods POST /api/cart/edit */
export async function editGoodsUsingPost(
  body: API.CartEditRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/cart/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listCartByPage POST /api/cart/list/page */
export async function listCartByPageUsingPost(
  body: API.CartQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageCartVO_>('/api/cart/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listCartVOByPageFast POST /api/cart/list/page/vo/fast */
export async function listCartVoByPageFastUsingPost(
  body: API.CartQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageCartVO_>('/api/cart/list/page/vo/fast', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateCartGoods POST /api/cart/update */
export async function updateCartGoodsUsingPost(
  body: API.CartUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/cart/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
