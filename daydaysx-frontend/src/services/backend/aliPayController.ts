// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** payNotify POST /api/aliPay/notify */
export async function payNotifyUsingPost(options?: { [key: string]: any }) {
  return request<any>('/api/aliPay/notify', {
    method: 'POST',
    ...(options || {}),
  });
}

/** pay GET /api/aliPay/pay */
export async function payUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.payUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/aliPay/pay', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
