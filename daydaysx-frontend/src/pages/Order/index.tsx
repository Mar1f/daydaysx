import {
  listGoodsOrderByPageUsingPost,
} from '@/services/backend/goodsOrderController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Select, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';

/**
 * 商品管理页面
 *
 * @constructor
 */
const GoodsAdminPage: React.FC = () => {
 const actionRef = useRef<ActionType>();
  // 当前商品点击的数据
  const [currentRow, setCurrentRow] = useState<API.GoodsOrderVO>();


  /**
   * 表格列配置
   */
  const columns: ProColumns<API.GoodsOrderVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '商品ID',
      dataIndex: 'goodsId',
      valueType: 'text',
    },
    {
      title: '收货地址',
      dataIndex: 'arrivePlace',
      valueType: 'textarea',
    },
    {
      title: '发货地址',
      dataIndex: 'startPlace',
      valueType: 'text',
    },
    {
      title: '购买数量',
      dataIndex: 'goodsNum',
      valueType: 'text',
    },
    {
      title: '订单价格',
      dataIndex: 'orderPrice',
      valueType: 'text',
    },
    {
      title: '创建用户',
      dataIndex: 'userId',
      valueType: 'text',
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
            }}
          >
            修改
          </Typography.Link>
        </Space>
      ),
    },
  ];

  return (
    <div className="goods-admin-page">
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        订单管理
      </Typography.Title>
      <ProTable<API.Goods>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}

        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;

          const { data, code } = await listGoodsOrderByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.GoodsQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          };
        }}
        columns={columns}
      />
    </div>
  );
};
export default GoodsAdminPage;
