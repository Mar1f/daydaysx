import { listGoodsOrderByPageUsingPost, updateOrderStatusUsingPost } from '@/services/backend/goodsOrderController';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, Tabs, Typography, message } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { getLoginUserUsingGet } from '@/services/backend/userController';
/**
 * 默认分页参数
 */
const DEFAULT_PAGE_PARAMS: PageRequest = {
  current: 1,
  pageSize: 8,
  sortField: 'createTime',
  sortOrder: 'descend',
};
const BuyerSellerOrderPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // 获取当前登录用户ID
  useEffect(() => {
    const fetchUserId = async () => {
      const result = await getLoginUserUsingGet();
      if (result?.data?.id) {
        setCurrentUserId(result.data.id);
      }
    };
    fetchUserId();
  }, []);

  // 操作按钮的处理函数
  const handleActionClick = async (action: string, record: API.GoodsOrderVO) => {
    console.log("handleActionClick响应", action);
    console.log("id:", record.id);
    let response;
    let newStatus;

    switch (action) {
      case 'pay': // 下单
        window.open(`http://localhost:8101/api/aliPay/pay?id=${record.id}`);
        break;
      case 'confirmReceive': // 确认收货
        newStatus = 3; // 状态设置为“已送达”
        break;
      case 'deliver': // 发货
        newStatus = 2; // 状态设置为“配送中”
        break;
      case 'completeDelivery': // 已送达
        // Optional: Handle any specific logic for completed delivery if needed
        return; // You might not need to do anything here
      default:
        break;
    }

    if (newStatus !== undefined) {
      response = await updateOrderStatusUsingPost({ orderId: record.id, newStatus });
      console.log('API Response:', response); // 输出响应
    }

    if (response?.code === 0) {
      message.success('操作成功');
      actionRef.current?.reload(); // 操作成功后刷新表格
    } else {
      message.error(response?.message || '操作失败');
    }
  };

  // 公共订单表格列
  const columns: ProColumns<API.GoodsOrderVO>[] = [
    {
      title: '订单号',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '商品',
      dataIndex: 'title',
      valueType: 'text',
    },
    {
      title: '收货地址',
      dataIndex: 'arrivePlace',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '发货地址',
      dataIndex: 'startPlace',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '购买数量',
      dataIndex: 'goodsNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '订单价格（元）',
      dataIndex: 'orderPrice',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'placeStatus',
      valueType: 'text',
      valueEnum: {
        0: { text: '未付款', status: 'Error' },
        1: { text: '未发货', status: 'Default' },
        2: { text: '配送中', status: 'Processing' },
        3: { text: '已送达', status: 'Success' },
      },
      filters: true, // 增加过滤器
      onFilter: true, // 允许过滤
      hideInSearch: true,
    },
    {
      title: '下单时间',
      sorter: true,
      dataIndex: 'payTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        if (!currentUserId) return null;
        const isBuyer = record.userId === currentUserId; // 判断当前用户是否为买家
        const isSeller = record.sellerId === currentUserId; // 判断当前用户是否为卖家

        return (
          <Space size="middle">
            {isBuyer && record.placeStatus === 0 && (
              <Button type="primary"
                      style={{ backgroundColor: 'red', borderColor: 'red' }}
                      onClick={() => handleActionClick('pay', record)}>
                下单
              </Button>
            )}
            {isSeller && record.placeStatus === 1 && (
              <Button type="primary"
                      style={{ backgroundColor: 'blue', borderColor: 'blue' }}
                      onClick={() => handleActionClick('deliver', record)}>
                发货
              </Button>
            )}
            {isBuyer && record.placeStatus === 2 && (
              <Button type="primary"
                      style={{ backgroundColor: '#90EE90', borderColor: '#90EE90' }} // 绿色
                      onClick={() => handleActionClick('confirmReceive', record)}>
                确认收货
              </Button>
            )}
            {record.placeStatus === 3 && (
              <Button type="default"
                      style={{ backgroundColor: '#FFD700', borderColor: '#FFD700' }} // 金色或其他颜色
                      disabled>
                已送达
              </Button>
            )}
          </Space>
        );
      }
  },
  ];

  // Tab: 买家订单和卖家订单切换
  return (
    <div className="buyer-seller-order-page">
      {/*<Typography.Title level={4} style={{ marginBottom: 16 }}>*/}
      {/*  订单管理*/}
      {/*</Typography.Title>*/}
      {currentUserId && (
        <Tabs defaultActiveKey="buyer">
          {/* 买家订单 */}
          <Tabs.TabPane tab="买家订单" key="buyer">
            <ProTable<API.GoodsOrderVO>
              // headerTitle={'买家订单'}
              actionRef={actionRef}
              rowKey="id"
              search={{
                labelWidth: 120,
              }}
              request={async (params, sort, filter) => {
                const { data, code } = await listGoodsOrderByPageUsingPost({
                  ...params,
                  sortField: sort?.createTime ? 'createTime' : undefined,
                  sortOrder: sort?.createTime,
                  placeStatus: filter?.placeStatus ? filter.placeStatus[0] : undefined,  // 处理状态过滤条件
                } as API.GoodsQueryRequest);

                return {
                  success: code === 0,
                  data: data?.records?.filter(order => order.userId === currentUserId) || [], // 买家订单
                  total: Number(data?.total) || 0,
                };
              }}
              columns={columns}
            />
          </Tabs.TabPane>

          {/* 卖家订单 */}
          <Tabs.TabPane tab="卖家订单" key="seller">
            <ProTable<API.GoodsOrderVO>
              // headerTitle={'卖家订单'}
              actionRef={actionRef}
              rowKey="id"
              search={{
                labelWidth: 120,
              }}
              request={async (params, sort, filter) => {
                const { data, code } = await listGoodsOrderByPageUsingPost({
                  ...params,
                  ...filter,
                } as API.GoodsQueryRequest);
                return {
                  success: code === 0,
                  data: data?.records?.filter(order => order.sellerId === currentUserId) || [], // 卖家订单
                  total: Number(data?.total) || 0,
                };
              }}
              columns={columns}
            />
          </Tabs.TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default BuyerSellerOrderPage;
